(function exposeNorthMatch(global) {
    "use strict";

    const { formatMoney, escapeHtml } = global.NorthOffers;

    function money(amount) {
        return { amount: Math.round((amount + Number.EPSILON) * 100) / 100, currency: "PLN" };
    }

    function readValue(formData, field) {
        const raw = formData.get(field.id);
        if (raw === null || raw === "") return null;
        if (field.type === "number") {
            const value = Number(raw);
            return Number.isFinite(value) ? value : null;
        }
        if (raw === "true") return true;
        if (raw === "false") return false;
        return raw;
    }

    function isKnown(value) {
        return value !== null && value !== "unknown";
    }

    function compare(value, test) {
        if (!isKnown(value)) return false;
        const expected = test.value;
        const operations = {
            eq: () => value === expected,
            neq: () => value !== expected,
            gt: () => Number(value) > Number(expected),
            gte: () => Number(value) >= Number(expected),
            lt: () => Number(value) < Number(expected),
            lte: () => Number(value) <= Number(expected),
            in: () => Array.isArray(expected) && expected.includes(value)
        };
        return (operations[test.op || "eq"] || (() => false))();
    }

    function conditionState(condition, values) {
        if (!condition) return true;
        if (condition.all) {
            const states = condition.all.map((item) => conditionState(item, values));
            if (states.includes(false)) return false;
            return states.includes(null) ? null : true;
        }
        if (condition.any) {
            const states = condition.any.map((item) => conditionState(item, values));
            if (states.includes(true)) return true;
            return states.includes(null) ? null : false;
        }
        if (condition.not) {
            const state = conditionState(condition.not, values);
            return state === null ? null : !state;
        }
        if (!isKnown(values[condition.field])) return null;
        return compare(values[condition.field], condition);
    }

    function conditionMet(condition, values) {
        return conditionState(condition, values) === true;
    }

    function componentAmount(rule, values, offer) {
        const component = offer.value.rewardComponents.find((item) => item.id === rule.componentId);
        const maximum = component?.advertisedValue?.amount || 0;
        if (rule.formula.type === "fixed") return maximum;
        if (rule.formula.type === "monthlyCappedRate") {
            const spend = Number(values[rule.formula.spendField] || 0);
            const months = Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths);
            return Math.min(spend * rule.formula.rate, rule.formula.monthlyCap) * months;
        }
        if (rule.formula.type === "travelWallet") {
            const firstSpend = Number(values[rule.formula.firstTransactionsSpendField] || 0);
            const laterSpend = Number(values[rule.formula.laterTransactionsSpendField] || 0);
            const months = Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths);
            const travelSpend = Number(values[rule.formula.travelSpendField] || 0);
            const expenseCount = Number(values[rule.formula.expenseCountField] || 0);
            const monthlyWallet = Math.min(
                Math.min(firstSpend * rule.formula.firstRate, rule.formula.firstCap) + laterSpend * rule.formula.laterRate,
                rule.formula.monthlyCap
            );
            const wallet = Math.min(monthlyWallet * months, maximum);
            return Math.min(travelSpend * rule.formula.payoutRate, wallet, rule.formula.singlePayoutCap * expenseCount, maximum);
        }
        return 0;
    }

    function costAmount(rule, values) {
        if (!conditionMet(rule.when, values)) return 0;
        if (rule.formula.type === "monthly") {
            const months = Math.max(0, Math.min(Number(values[rule.formula.monthsField] || 0), rule.formula.maxMonths) - (rule.formula.freeMonths || 0));
            const amount = conditionMet(rule.formula.lowerAmountWhen, values) ? rule.formula.lowerAmount : rule.formula.amount;
            return amount * months;
        }
        return 0;
    }

    function formatInput(field, value) {
        if (field.type === "number") return `${new Intl.NumberFormat("pl-PL").format(value)}${field.suffix ? ` ${field.suffix}` : ""}`;
        return field.options?.find((option) => String(option.value) === String(value))?.label || String(value);
    }

    const matchLabels = Object.freeze({
        "FIT": "Dobrze pasuje",
        "CONDITIONAL FIT": "Pasuje, jeśli spełnisz warunki",
        "POOR FIT": "Raczej nie pasuje",
        "CANNOT ASSESS": "Brakuje danych"
    });
    const verdictLabels = Object.freeze({
        "TAKE NOW": "Ma sens teraz",
        "TAKE IF": "Ma sens pod warunkiem",
        "SKIP": "Lepiej odpuścić",
        "NOT ENOUGH DATA": "Najpierw uzupełnij dane"
    });

    function plainResultSummary(result, offer) {
        if (result.match === "CANNOT ASSESS") {
            const missing = result.unknowns.length
                ? result.unknowns.map((item) => item.replace(/\?$/, "")).join("; ")
                : "odpowiedzi potrzebne do obliczenia wyniku";
            return `Brakuje danych: ${missing}. Uzupełnij je, aby sprawdzić kwotę i ocenić, czy oferta ma dla Ciebie sens.`;
        }
        if (result.match === "POOR FIT") {
            const reason = result.blockers[0] || "W tym scenariuszu nie ma potwierdzonej użytecznej wartości.";
            return `Ta oferta raczej nie ma dla Ciebie sensu. ${reason}`;
        }
        const amount = result.usableMin === result.usableMax
            ? formatMoney(money(result.usableMax))
            : `${formatMoney(money(result.usableMin))}–${formatMoney(money(result.usableMax))}`;
        const mainComponent = result.componentResults
            .filter((item) => item.earned && item.amount > 0)
            .sort((a, b) => b.amount - a.amount)[0];
        const condition = mainComponent?.rule.condition || result.conditions[0] || "Spełnij wszystkie pokazane warunki.";
        const risk = result.blockers[0]
            || mainComponent?.rule.failureReason
            || offer.execution?.failurePoints?.[0]?.consequence
            || "niespełnienie warunku może obniżyć albo wyzerować premię";
        return `Ta oferta może mieć dla Ciebie sens. Możesz faktycznie wykorzystać około ${amount}. Główny warunek: ${condition} Największe ryzyko: ${risk.charAt(0).toLowerCase()}${risk.slice(1)}`;
    }

    function evaluate(offer, values) {
        const config = offer.match;
        const visibleFields = config.fields.filter((field) => !field.showWhen || conditionMet(field.showWhen, values));
        const missing = visibleFields.filter((field) => field.required && !isKnown(values[field.id]));
        const explicitUnknown = visibleFields.filter((field) => values[field.id] === "unknown");
        const reasons = [];
        const blockers = [];
        const conditions = [];
        const unknowns = [...missing, ...explicitUnknown.filter((field) => !missing.includes(field))];

        let disqualified = false;
        for (const rule of config.eligibilityRules) {
            if (!conditionMet(rule.when, values)) continue;
            if (rule.outcome === "disqualified") {
                disqualified = true;
                blockers.push(rule.message);
            } else if (rule.outcome === "reason") {
                reasons.push(rule.message);
            } else if (rule.outcome === "condition") {
                conditions.push(rule.message);
            }
        }

        const componentResults = config.componentRules.map((rule) => {
            const relevant = !rule.includeWhen || conditionMet(rule.includeWhen, values);
            if (!relevant) return { rule, relevant, earned: false, amount: 0 };
            const state = conditionState(rule.when, values);
            const hasUnknownDependency = state === null;
            const earned = state === true;
            const amount = earned ? componentAmount(rule, values, offer) : 0;
            if (earned && amount > 0) reasons.push(rule.successReason);
            else if (!hasUnknownDependency && rule.failureReason) blockers.push(rule.failureReason);
            if (earned && rule.condition) conditions.push(rule.condition);
            return { rule, relevant, earned, amount, hasUnknownDependency };
        });

        const gross = componentResults.reduce((sum, item) => sum + item.amount, 0);
        const costs = config.costRules.map((rule) => ({ rule, amount: costAmount(rule, values) }));
        const directCost = costs.reduce((sum, item) => sum + item.amount, 0);
        costs.filter((item) => item.amount > 0).forEach((item) => blockers.push(item.rule.message));
        const uncertainUsability = componentResults.some((item) => item.earned && item.rule.usabilityUncertain);
        const uncertainAmount = componentResults.filter((item) => item.earned && item.rule.usabilityUncertain).reduce((sum, item) => sum + item.amount, 0);
        const usableMin = Math.max(0, gross - uncertainAmount);
        const usableMax = gross;
        const netMin = Math.max(0, usableMin - directCost);
        const netMax = Math.max(0, usableMax - directCost);
        const hasMissing = unknowns.length > 0 || componentResults.some((item) => item.relevant && item.hasUnknownDependency);
        const hasRelevantFailure = componentResults.some((item) => item.relevant && !item.earned && !item.hasUnknownDependency);
        const earnedRelevant = componentResults.filter((item) => item.relevant && item.earned);

        let match = "CANNOT ASSESS";
        let verdict = "NOT ENOUGH DATA";
        let summary = "Brakuje danych, które mogą zmienić kwalifikację, wartość albo decyzję.";
        if (disqualified) {
            match = "POOR FIT";
            verdict = "SKIP";
            summary = "Potwierdzony warunek wyklucza ten scenariusz z oferty.";
        } else if (!hasMissing) {
            if (gross <= 0 || earnedRelevant.length === 0) {
                match = "POOR FIT";
                verdict = "SKIP";
                summary = "W podanym scenariuszu oferta nie daje użytecznej wartości, która uzasadniałaby nowe obowiązki.";
            } else {
                match = hasRelevantFailure || directCost > 0 || uncertainUsability ? "CONDITIONAL FIT" : "FIT";
                verdict = "TAKE IF";
                summary = match === "FIT"
                    ? "Warunki oferty pasują do zadeklarowanego scenariusza."
                    : "Oferta może mieć sens, ale część wartości lub koszt zależy od wskazanych warunków.";
            }
        }

        const influenced = visibleFields
            .filter((field) => isKnown(values[field.id]))
            .map((field) => `${field.shortLabel || field.label}: ${formatInput(field, values[field.id])}`);

        const result = {
            match,
            verdict,
            summary,
            reasons: [...new Set(reasons)],
            blockers: [...new Set(blockers)],
            conditions: [...new Set(conditions)],
            unknowns: [...new Set(unknowns.map((field) => field.label))],
            influenced,
            gross,
            usableMin,
            usableMax,
            directCost,
            netMin,
            netMax,
            componentResults
        };
        result.summary = plainResultSummary(result, offer);
        return result;
    }

    function fieldHtml(field) {
        const describedBy = field.help ? `match-${field.id}-help` : "";
        if (field.type === "number") {
            return `<div class="match-field" data-match-field="${escapeHtml(field.id)}"><label for="match-${escapeHtml(field.id)}">${escapeHtml(field.label)}</label>${field.help ? `<p id="${describedBy}">${escapeHtml(field.help)}</p>` : ""}<div class="match-number"><input id="match-${escapeHtml(field.id)}" name="${escapeHtml(field.id)}" type="number" min="${field.min ?? 0}" ${field.max !== undefined ? `max="${field.max}"` : ""} ${field.step ? `step="${field.step}"` : "step=\"1\""} ${describedBy ? `aria-describedby="${describedBy}"` : ""}><span>${escapeHtml(field.suffix || "")}</span></div></div>`;
        }
        return `<fieldset class="match-field" data-match-field="${escapeHtml(field.id)}"><legend>${escapeHtml(field.label)}</legend>${field.help ? `<p id="${describedBy}">${escapeHtml(field.help)}</p>` : ""}<div class="match-options">${field.options.map((option) => `<label><input type="radio" name="${escapeHtml(field.id)}" value="${escapeHtml(option.value)}" ${describedBy ? `aria-describedby="${describedBy}"` : ""}><span>${escapeHtml(option.label)}</span></label>`).join("")}</div></fieldset>`;
    }

    function resultList(title, items, symbol, className) {
        const content = items.length ? items : [className === "match-reasons" ? "Brak potwierdzonych powodów na plus." : className === "match-unknowns" ? "Wszystkie wymagane dane zostały podane." : "Brak dodatkowych punktów w tej grupie."];
        return `<div class="${className}"><h4>${title}</h4><ul>${content.map((item) => `<li><span aria-hidden="true">${symbol}</span>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
    }

    function renderResult(container, result, offer) {
        const range = (min, max) => min === max ? formatMoney(money(min)) : `${formatMoney(money(min))}–${formatMoney(money(max))}`;
        const unavailable = result.match === "CANNOT ASSESS" ? "Brak danych" : null;
        container.innerHTML = `<div class="match-result-head"><div><span>${global.NorthGlossary.label("northMatch")}</span><strong class="match-band match-band--${result.match.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(matchLabels[result.match])}</strong><small>${escapeHtml(result.match)}</small></div><div><span>${global.NorthGlossary.label("verdict")}</span><strong class="match-verdict">${escapeHtml(verdictLabels[result.verdict])}</strong><small>${escapeHtml(result.verdict)}</small></div></div><p class="match-summary">${escapeHtml(result.summary)}</p><dl class="match-values"><div><dt>${global.NorthGlossary.label("yourLikelyValue")}</dt><dd>${unavailable || formatMoney(money(result.gross))}</dd></div><div><dt>${global.NorthGlossary.label("expectedUsableValue")}</dt><dd>${unavailable || range(result.usableMin, result.usableMax)}</dd></div><div><dt>${global.NorthGlossary.label("netScenarioValue")}</dt><dd>${unavailable || range(result.netMin, result.netMax)}</dd></div><div><dt>Potwierdzony koszt</dt><dd>${unavailable || formatMoney(money(result.directCost))}</dd></div></dl><div class="match-explanation"><h3>Dlaczego ten wynik?</h3>${resultList("Co pasuje", result.reasons, "✓", "match-reasons")}${resultList("Co nie pasuje lub blokuje", result.blockers, "×", "match-blockers")}${resultList("Warunki", result.conditions, "→", "match-conditions")}${resultList("Brakujące dane", result.unknowns, "?", "match-unknowns")}</div><details class="match-input-summary"><summary>Dane, które wpłynęły na wynik</summary><ul>${result.influenced.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details><p class="match-local-note">Odpowiedzi są przetwarzane tylko na tym urządzeniu. North ich nie wysyła ani nie zapisuje profilu.</p><p class="match-method-note">Dopasowanie mówi, jak dobrze warunki pasują do Twojej sytuacji. Ocena sensu oferty mówi, co zrobić w tym scenariuszu. Maksimum z reklamy to ${escapeHtml(offer.value.advertisedMax.displayLabel)}.</p>`;
        global.NorthGlossary.init(container);
    }

    function mount(root, offer) {
        if (!offer.match) return;
        const core = offer.match.fields.filter((field) => field.stage === 1);
        const additional = offer.match.fields.filter((field) => field.stage === 2);
        root.innerHTML = `<section class="offer-section north-match-section" id="match" aria-labelledby="match-title"><div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> ${global.NorthGlossary.label("northMatch")}</p><h2 id="match-title">Sprawdź tę ofertę dla siebie</h2></div><p>Odpowiedz tylko na pytania, które zmieniają wynik. Nie podawaj imienia, PESEL-u ani danych bankowych.</p></div><div class="match-layout"><form class="match-form" novalidate><fieldset class="match-step"><legend><span>Etap 1</span> Najważniejsze dane</legend>${core.map(fieldHtml).join("")}<button class="north-button match-next" type="button">Przejdź do pytań dodatkowych <span aria-hidden="true">→</span></button><p class="match-form-error" role="status" hidden>Brakuje części odpowiedzi. Możesz przejść dalej — wynik wskaże, co trzeba uzupełnić.</p></fieldset><fieldset class="match-step match-step--additional" hidden><legend><span>Etap 2</span> Tylko warunki tej oferty</legend>${additional.map(fieldHtml).join("")}<button class="north-button" type="submit">Sprawdź kwotę i sens oferty</button><button class="match-reset" type="reset">Wyczyść odpowiedzi</button><p class="match-form-error" role="status" hidden>Brakuje części odpowiedzi. Wynik wskaże braki zamiast je zgadywać.</p></fieldset></form><aside class="match-result" aria-label="Wynik dopasowania oferty" aria-live="polite" aria-atomic="false"><div class="match-empty"><span>${global.NorthGlossary.label("northMatch")}</span><h3>Konkretny wynik bez procentów</h3><p>Po odpowiedzi zobaczysz, czy oferta pasuje, ile możesz dostać, jakie są koszty i co może pójść nie tak.</p></div></aside></div></section>`;
        global.NorthGlossary.init(root);

        const form = root.querySelector(".match-form");
        const additionalStep = root.querySelector(".match-step--additional");
        const resultContainer = root.querySelector(".match-result");
        const next = root.querySelector(".match-next");

        function valuesFromForm() {
            const data = new FormData(form);
            return Object.fromEntries(offer.match.fields.map((field) => [field.id, readValue(data, field)]));
        }

        function updateVisibility() {
            const values = valuesFromForm();
            offer.match.fields.forEach((field) => {
                const wrapper = form.querySelector(`[data-match-field="${CSS.escape(field.id)}"]`);
                const visible = !field.showWhen || conditionMet(field.showWhen, values);
                wrapper.hidden = !visible;
                wrapper.querySelectorAll("input").forEach((input) => { input.disabled = !visible; });
            });
        }

        function markMissing(step) {
            updateVisibility();
            const values = valuesFromForm();
            const missingField = offer.match.fields.find((field) => field.required && step.querySelector(`[data-match-field="${CSS.escape(field.id)}"]:not([hidden])`) && !isKnown(values[field.id]));
            const error = step.querySelector(".match-form-error");
            error.hidden = !missingField;
            return missingField;
        }

        function clearResolvedErrors() {
            const values = valuesFromForm();
            form.querySelectorAll(".match-step").forEach((step) => {
                const error = step.querySelector(".match-form-error");
                if (!error || error.hidden) return;
                const stillMissing = offer.match.fields.some((field) => field.required && step.querySelector(`[data-match-field="${CSS.escape(field.id)}"]:not([hidden])`) && !isKnown(values[field.id]));
                if (!stillMissing) error.hidden = true;
            });
        }

        next.addEventListener("click", () => {
            const step = next.closest("fieldset");
            markMissing(step);
            additionalStep.hidden = false;
            updateVisibility();
            additionalStep.querySelector("input:enabled")?.focus();
        });
        form.addEventListener("change", () => { updateVisibility(); clearResolvedErrors(); });
        form.addEventListener("input", () => { updateVisibility(); clearResolvedErrors(); });
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            markMissing(additionalStep);
            const values = valuesFromForm();
            renderResult(resultContainer, evaluate(offer, values), offer);
            resultContainer.focus();
        });
        form.addEventListener("reset", () => {
            global.setTimeout(() => {
                additionalStep.hidden = true;
                updateVisibility();
                resultContainer.innerHTML = `<div class="match-empty"><span>${global.NorthGlossary.label("northMatch")}</span><h3>Konkretny wynik bez procentów</h3><p>Po odpowiedzi zobaczysz, czy oferta pasuje, ile możesz dostać, jakie są koszty i co może pójść nie tak.</p></div>`;
                global.NorthGlossary.init(resultContainer);
                next.focus();
            });
        });
        resultContainer.tabIndex = -1;
        updateVisibility();
    }

    global.NorthMatch = { mount, evaluate, conditionMet };
}(window));
