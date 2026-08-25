const CONTRACT_URL = new URL("../data/mbank-alternative-comparison-v0.8.0.json", import.meta.url);

const labels = Object.freeze({
    "FIT": "Dobrze pasuje",
    "CONDITIONAL FIT": "Pasuje warunkowo",
    "POOR FIT": "Raczej nie pasuje",
    "CANNOT ASSESS": "Brakuje danych",
    "TAKE IF": "Ma sens pod warunkiem",
    "SKIP": "Lepiej odpuścić",
    "NOT ENOUGH DATA": "Najpierw uzupełnij dane"
});

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isKnown(value) {
    return value !== undefined && value !== null && value !== "" && !Number.isNaN(value);
}

export function conditionMet(condition, values) {
    if (!condition) return true;
    if (condition.always) return true;
    if (condition.all) return condition.all.every((item) => conditionMet(item, values));
    if (condition.any) return condition.any.some((item) => conditionMet(item, values));
    if (condition.not) return !conditionMet(condition.not, values);

    const actual = values[condition.field];
    switch (condition.op) {
        case "eq": return actual === condition.value;
        case "ne": return actual !== condition.value;
        case "lt": return Number(actual) < Number(condition.value);
        case "lte": return Number(actual) <= Number(condition.value);
        case "gt": return Number(actual) > Number(condition.value);
        case "gte": return Number(actual) >= Number(condition.value);
        case "between": return Number(actual) >= Number(condition.value[0]) && Number(actual) <= Number(condition.value[1]);
        case "in": return condition.value.includes(actual);
        default: return false;
    }
}

function formatMoney(amount) {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function productEligibility(product, values) {
    const rule = product.productEligibility;
    const age = Number(values.age);
    if (!isKnown(age)) return { eligible: false, status: "CANNOT ASSESS", reason: "Brakuje wieku." };
    if (age < rule.ageMin || (rule.ageMax !== null && age > rule.ageMax)) {
        const range = rule.ageMax === null ? `${rule.ageMin}+` : `${rule.ageMin}–${rule.ageMax}`;
        return { eligible: false, status: "NOT ELIGIBLE", reason: `Produkt jest przeznaczony dla wieku ${range}.` };
    }
    if (!rule.ownershipModes.includes(values.ownership)) {
        return { eligible: false, status: "NOT ELIGIBLE", reason: "Ten Product Identity nie obsługuje wybranego sposobu prowadzenia w bounded mapowaniu." };
    }
    return { eligible: true, status: "ELIGIBLE", reason: "Spełniasz podstawowe warunki wieku i sposobu prowadzenia produktu." };
}

function fitFor(product, values, eligibility) {
    if (!eligibility.eligible) {
        return { band: eligibility.status === "CANNOT ASSESS" ? "CANNOT ASSESS" : "POOR FIT", reason: eligibility.reason };
    }
    return product.fitRules.find((rule) => conditionMet(rule.when, values)) || {
        band: "CANNOT ASSESS",
        reason: "Kontrakt nie rozstrzyga tego scenariusza."
    };
}

function promotionFor(contract, product, values, eligibility) {
    const edition = contract.promotionEditions[0];
    const override = edition.productOverrides[product.id];
    if (!eligibility.eligible || !edition.eligibleProductIds.includes(product.id)) {
        return {
            status: "NOT ELIGIBLE",
            reason: "Brak Product eligibility blokuje Promotion eligibility.",
            possibleValue: "0 zł w tej edycji",
            naturalActivity: false,
            linkedSavings: override?.linkedSavings || "Brak"
        };
    }
    if (values.ownership === "joint") {
        return {
            status: "NOT ELIGIBLE",
            reason: "Cała naprzód obejmuje rachunek indywidualny; zmiana na wspólny kończy udział.",
            possibleValue: "0 zł dla rachunku wspólnego",
            naturalActivity: false,
            linkedSavings: override.linkedSavings
        };
    }

    const naturalActivity = Number(values.monthlyInflows) >= override.initialAndMonthlyInflows
        && Number(values.monthlyCardSpend) >= edition.commonRequirements.monthlyCardSpend;
    return {
        status: "CONDITIONAL",
        reason: naturalActivity
            ? "Deklarowane wpływy i płatności osiągają progi aktywności, ale historia relacji i typ wpływu wynagrodzenia pozostają nierozstrzygnięte."
            : `Deklarowane zachowanie nie osiąga jednego z progów aktywności: ${formatMoney(override.initialAndMonthlyInflows)} wpływu i ${formatMoney(edition.commonRequirements.monthlyCardSpend)} płatności kartą.`,
        possibleValue: `do ${formatMoney(override.maximumCash)} gotówki`,
        naturalActivity,
        linkedSavings: override.linkedSavings,
        childBonusIncluded: override.childBonus > 0 && values.childAccount === "yes"
    };
}

function costFor(product, values) {
    const cost = product.cost;
    if (cost.model === "always_free") {
        return {
            display: "0 zł za konto i kartę",
            waiver: "Niepotrzebny — brak miesięcznego warunku za konto i kartę.",
            monthlyCost: 0,
            waiverNatural: true
        };
    }
    if (cost.model === "card_spend_waiver") {
        if (values.ownership === "joint") {
            return {
                display: "0 zł za konto; koszt kart zależy od każdej osoby",
                waiver: "Nie można ocenić z łącznej kwoty — każda osoba musi wydać swoją kartą 350 zł.",
                monthlyCost: null,
                waiverNatural: null
            };
        }
        const waived = Number(values.monthlyCardSpend) >= cost.cardWaiverSpend;
        return {
            display: waived ? "0 zł za konto i kartę" : `${formatMoney(cost.cardMonthly)} miesięcznie za kartę`,
            waiver: waived
                ? `Tak — deklarowane wydatki osiągają ${formatMoney(cost.cardWaiverSpend)}.`
                : `Nie — brakuje do ${formatMoney(cost.cardWaiverSpend)} płatności kartą.`,
            monthlyCost: waived ? 0 : cost.cardMonthly,
            waiverNatural: waived
        };
    }

    if (cost.model !== "account_waiver_any") {
        return {
            display: "Koszt nierozstrzygnięty",
            waiver: "Kontrakt nie zawiera obsługiwanego modelu kosztu.",
            monthlyCost: null,
            waiverNatural: null
        };
    }

    const waived = Number(values.monthlyInflows) >= cost.waiverInflows
        || Number(values.qualifyingAssets) >= cost.waiverAssets;
    return {
        display: waived ? "0 zł za konto i kartę" : `${formatMoney(cost.accountMonthly)} miesięcznie za konto`,
        waiver: waived
            ? "Tak — naturalnie osiągasz próg wpływów lub kwalifikowanych aktywów."
            : `Nie — potrzeba ${formatMoney(cost.waiverInflows)} wpływów albo ${formatMoney(cost.waiverAssets)} aktywów.`,
        monthlyCost: waived ? 0 : cost.accountMonthly,
        waiverNatural: waived
    };
}

function effortFor(promotion, eligibility) {
    if (!eligibility.eligible) return "Niski — produkt odpada przed wykonywaniem warunków promocji.";
    if (promotion.status === "NOT ELIGIBLE") return "Niski dla promocji — nie należy wykonywać jej warunków.";
    return promotion.naturalActivity
        ? "Średni — sześć miesięcy wpływów, płatności kartą i wzrostu oszczędności."
        : "Wysoki — wymagane zachowanie wykracza poza zadeklarowane naturalne użycie.";
}

function failureRiskFor(product, promotion, cost, eligibility) {
    if (!eligibility.eligible) return "Wysokie ryzyko niedopasowania produktu; nie przechodź do promocji.";
    if (promotion.status === "NOT ELIGIBLE") return "Niskie ryzyko utraty premii, jeśli nie próbujesz jej realizować; premia wynosi 0 zł dla tego trybu.";
    if (product.cost.model === "account_waiver_any" && cost.waiverNatural === false) {
        return `Wysokie — ${formatMoney(product.cost.accountMonthly)} miesięcznie bez progu zwolnienia oraz ryzyko niedowiezienia promocji.`;
    }
    return promotion.naturalActivity
        ? "Średnie — jeden pominięty warunek miesiąca może obniżyć premię; historia relacji nadal wymaga sprawdzenia."
        : "Wysokie — deklarowane wpływy lub płatności nie osiągają progów promocji.";
}

function confidenceFor(values, eligibility, cost) {
    if (!eligibility.eligible) return "WYSOKA — bezpośrednia reguła wieku lub sposobu prowadzenia.";
    if (values.ownership === "joint" && cost.waiverNatural === null) {
        return "ŚREDNIA — produkt i wyłączenie promocji są potwierdzone, ale brakuje podziału wydatków między karty.";
    }
    return "ŚREDNIA — fakty produktu są potwierdzone; indywidualna karencja i typ wpływu pozostają poza krótkim flow.";
}

function verdictFor(product, preferredProductId, eligibility, fit) {
    if (!eligibility.eligible || fit.band === "POOR FIT") return "SKIP";
    if (!preferredProductId) return "NOT ENOUGH DATA";
    if (product.id === preferredProductId) return "TAKE IF";
    return "TAKE IF";
}

function unique(items) {
    return [...new Set(items.filter(Boolean))];
}

export function evaluateComparison(contract, values) {
    const missingFields = contract.inputFields.filter((field) => field.required && !isKnown(values[field.id]));
    if (missingFields.length) {
        return {
            preferredProductId: null,
            summary: "Brakuje danych potrzebnych do porównania.",
            decisiveFactors: [],
            tradeOffs: [],
            unresolvedFactors: missingFields.map((field) => `Brak odpowiedzi: ${field.shortLabel || field.label}`),
            candidates: []
        };
    }

    const recommendation = contract.recommendationRules.find((rule) => conditionMet(rule.when, values)) || {
        preferredProductId: null,
        summary: "Kontrakt nie wskazuje jednoznacznego zwycięzcy dla tego scenariusza.",
        decisiveFactors: ["Żadna zatwierdzona reguła wyboru nie rozstrzyga scenariusza."],
        tradeOffs: ["Rozważ brak działania lub ręczne porównanie kosztów i potrzeb."]
    };

    const candidates = contract.productIdentities.map((product) => {
        const eligibility = productEligibility(product, values);
        const fit = fitFor(product, values, eligibility);
        const promotion = promotionFor(contract, product, values, eligibility);
        const cost = costFor(product, values);
        return {
            id: product.id,
            name: product.name,
            segmentLabel: product.segmentLabel,
            eligibility,
            fit,
            cost,
            promotion,
            effort: effortFor(promotion, eligibility),
            failureRisk: failureRiskFor(product, promotion, cost, eligibility),
            confidence: confidenceFor(values, eligibility, cost),
            verdict: verdictFor(product, recommendation.preferredProductId, eligibility, fit),
            functionalValue: product.functionalValue,
            preferred: product.id === recommendation.preferredProductId
        };
    });

    const unresolved = [...contract.commonUnresolvedFactors];
    if (values.ownership === "joint") {
        unresolved.push("Łączne wydatki kartą nie pokazują, czy każda osoba spełnia osobny próg 350 zł dla swojej karty.");
    }
    if (values.travelNeeds === "frequent") {
        unresolved.push("Nie wyceniamy funkcji podróżnych bez informacji o faktycznych trasach, walutach i liczbie użyć.");
    }
    if (values.childAccount === "yes") {
        unresolved.push("Wiek dziecka i kwalifikacja osobnego produktu dziecięcego nie są częścią tego bounded flow.");
    }

    return {
        preferredProductId: recommendation.preferredProductId,
        summary: recommendation.summary,
        decisiveFactors: recommendation.decisiveFactors,
        tradeOffs: recommendation.tradeOffs,
        unresolvedFactors: unique(unresolved),
        candidates,
        doNothing: contract.doNothing
    };
}

function fieldHtml(field) {
    const helpId = `comparison-${field.id}-help`;
    const help = field.help ? `<p id="${helpId}">${escapeHtml(field.help)}</p>` : "";
    if (field.type === "number") {
        return `<div class="comparison-field"><label for="comparison-${escapeHtml(field.id)}">${escapeHtml(field.label)}</label>${help}<div class="comparison-number"><input id="comparison-${escapeHtml(field.id)}" name="${escapeHtml(field.id)}" type="number" min="${field.min}" max="${field.max}" step="${field.step}" required ${field.help ? `aria-describedby="${helpId}"` : ""}><span>${escapeHtml(field.suffix)}</span></div></div>`;
    }
    return `<fieldset class="comparison-field"><legend>${escapeHtml(field.label)}</legend>${help}<div class="comparison-options">${field.options.map((option) => `<label><input type="radio" name="${escapeHtml(field.id)}" value="${escapeHtml(option.value)}" required ${field.help ? `aria-describedby="${helpId}"` : ""}><span>${escapeHtml(option.label)}</span></label>`).join("")}</div></fieldset>`;
}

function valuesFromForm(form, contract) {
    const data = new FormData(form);
    return Object.fromEntries(contract.inputFields.map((field) => {
        const raw = data.get(field.id);
        return [field.id, field.type === "number" && raw !== null && raw !== "" ? Number(raw) : raw ?? ""];
    }));
}

function listHtml(title, items, modifier) {
    return `<section class="recommendation-list recommendation-list--${modifier}"><h3>${escapeHtml(title)}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function renderRecommendation(container, result, contract) {
    const preferred = contract.productIdentities.find((product) => product.id === result.preferredProductId);
    container.dataset.preferredProductId = result.preferredProductId || "none";
    container.innerHTML = `<div class="recommendation-eyebrow">North recommendation · bez numeric score</div><h2 class="recommendation-title">${preferred ? "Rekomendacja dla Twojego scenariusza" : "Brak jednoznacznego zwycięzcy"}</h2>${preferred ? `<div class="recommendation-product"><span>Najlepiej pasuje Ci</span><strong>${escapeHtml(preferred.name)}</strong></div>` : ""}<p class="recommendation-summary">${escapeHtml(result.summary)}</p><div class="recommendation-lists">${listHtml("Dlaczego", result.decisiveFactors, "decisive")}${listHtml("Na co uważać", result.tradeOffs, "tradeoffs")}${listHtml("Nierozstrzygnięte", result.unresolvedFactors, "unresolved")}</div><p class="recommendation-note">Wyższa premia nie może pokonać lepszego Product Fit. Źródło afiliacyjne nie jest wejściem do tego wyniku.</p>`;
}

function factHtml(label, headline, detail = "") {
    return `<div><dt>${escapeHtml(label)}</dt><dd><strong>${escapeHtml(headline)}</strong>${detail ? escapeHtml(detail) : ""}</dd></div>`;
}

function candidateHtml(candidate) {
    const promotionDetail = candidate.promotion.childBonusIncluded
        ? `${candidate.promotion.reason} Bonus za konto dziecka jest częścią maksimum, nie dodatkową kwotą ponad maksimum.`
        : candidate.promotion.reason;
    return `<article class="candidate-card${candidate.preferred ? " candidate-card--preferred" : ""}" data-product-id="${escapeHtml(candidate.id)}" data-promotion-eligibility="${escapeHtml(candidate.promotion.status)}"><div class="candidate-topline"><div><span class="candidate-status">${candidate.preferred ? "Rekomendowany" : "Alternatywa"}</span><h3>${escapeHtml(candidate.name)}</h3><p class="candidate-segment">${escapeHtml(candidate.segmentLabel)}</p></div><span class="candidate-band candidate-band--${candidate.fit.band.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(labels[candidate.fit.band])}</span></div><p class="candidate-why"><strong>Dlaczego:</strong> ${escapeHtml(candidate.fit.reason)}</p><dl class="candidate-facts">${factHtml("Product eligibility", candidate.eligibility.status, candidate.eligibility.reason)}${factHtml("Koszt produktu", candidate.cost.display)}${factHtml("Naturalny fee waiver", candidate.cost.waiver)}${factHtml("Promotion eligibility", candidate.promotion.status, promotionDetail)}${factHtml("Możliwa wartość promocji", candidate.promotion.possibleValue, "Linked savings nie jest tu doliczone.")}${factHtml("Effort", candidate.effort)}${factHtml("Failure risk", candidate.failureRisk)}${factHtml("Confidence", candidate.confidence)}${factHtml("Verdict", labels[candidate.verdict], candidate.verdict)}</dl><section class="candidate-functional"><h4>Istotna wartość funkcjonalna</h4><ul class="candidate-list">${candidate.functionalValue.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section><p class="candidate-linked"><strong>Osobno:</strong> ${escapeHtml(candidate.promotion.linkedSavings)}. To oprocentowanie powiązanego rachunku, nie gotówkowa premia konta.</p></article>`;
}

function alternativeDisclosureHtml(candidate) {
    const confidenceBand = candidate.confidence.split(" — ")[0];
    return `<details class="candidate-disclosure" data-alternative-product-id="${escapeHtml(candidate.id)}"><summary><span class="candidate-disclosure__identity"><span class="candidate-status">Alternatywa</span><strong>${escapeHtml(candidate.name)}</strong><span>${escapeHtml(candidate.segmentLabel)}</span></span><span class="candidate-disclosure__decision"><span class="candidate-band candidate-band--${candidate.fit.band.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(labels[candidate.fit.band])}</span><span>${escapeHtml(labels[candidate.verdict])} · Confidence ${escapeHtml(confidenceBand)}</span></span></summary><div class="candidate-disclosure__content">${candidateHtml(candidate)}</div></details>`;
}

function evidenceDisclosureHtml(contract) {
    const sources = contract.sources || [];
    const sourceItems = sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a><span>${escapeHtml(source.type.replaceAll("_", " "))} · wspiera: ${escapeHtml(source.supports.join(", "))}</span></li>`).join("");
    return `<details class="evidence-disclosure"><summary><span><strong>Evidence i metodologia</strong><span>Pełny zakres źródeł i granice wniosku</span></span><span class="evidence-disclosure__count">${sources.length} oficjalnych źródeł</span></summary><div class="evidence-disclosure__content"><p><strong>Sprawdzono:</strong> ${escapeHtml(contract.review.verifiedAt)} · <strong>recheck:</strong> ${escapeHtml(contract.review.recheckBy)}. Confidence ocenia jakość evidence, nie atrakcyjność produktu.</p><p>Flow zachowuje kolejność: sytuacja użytkownika → Product Identity → Product eligibility → Promotion eligibility → North decision. Nie pyta o historię relacji, dokładny typ wpływu ani sposób otwarcia, dlatego Promotion eligibility może pozostać warunkowa.</p><ul>${sourceItems}</ul></div></details>`;
}

function renderCandidates(container, section, result, contract) {
    const ordered = [...result.candidates].sort((left, right) => Number(right.preferred) - Number(left.preferred));
    const preferred = ordered.find((candidate) => candidate.preferred);
    const alternatives = ordered.filter((candidate) => !candidate.preferred);
    const title = section.querySelector("#candidate-title");
    title.textContent = preferred ? "Najlepiej pasuje Ci" : "Brak jednoznacznego wyboru";
    const winnerHtml = preferred
        ? `<section class="candidate-winner" aria-label="Pełna karta rekomendowanego Product Identity">${candidateHtml(preferred)}</section>`
        : `<section class="candidate-no-winner"><h3>Żaden Product Identity nie wygrywa automatycznie.</h3><p>Pełne dane kandydatów pozostają dostępne poniżej. Rozważ też brak działania.</p></section>`;
    container.innerHTML = `${winnerHtml}<section class="alternative-options" aria-labelledby="alternative-options-title"><div class="alternative-options__heading"><h3 id="alternative-options-title">Inne możliwości</h3><p>Domyślnie zwinięte; każda karta zachowuje komplet danych.</p></div><div class="alternative-disclosures">${alternatives.map(alternativeDisclosureHtml).join("")}</div></section><article class="do-nothing-card"><h3>${escapeHtml(result.doNothing.label)}</h3><ul><li>Nagroda: ${escapeHtml(result.doNothing.reward)}</li><li>Nowy koszt miesięczny: ${escapeHtml(result.doNothing.newMonthlyCost)}</li><li>Wysiłek: ${escapeHtml(result.doNothing.effort)}</li><li>Ryzyko: ${escapeHtml(result.doNothing.failureRisk)}</li></ul></article>${evidenceDisclosureHtml(contract)}`;
    section.hidden = false;
}

function renderLoadError(fields, result, error) {
    fields.innerHTML = "";
    result.innerHTML = `<div class="comparison-empty"><span>Nie udało się wczytać kontraktu</span><h2>Prototyp nie zgaduje danych.</h2><p>${escapeHtml(error.message)}</p></div>`;
}

export async function mountComparison() {
    const form = document.querySelector("#comparison-form");
    const fields = document.querySelector("#comparison-fields");
    const errorMessage = document.querySelector("#comparison-form-error");
    const resultContainer = document.querySelector("#comparison-result");
    const candidateSection = document.querySelector("#candidate-comparison");
    const candidateCards = document.querySelector("#candidate-cards");
    const prototypeNotes = document.querySelector(".prototype-notes");

    try {
        const response = await fetch(CONTRACT_URL);
        if (!response.ok) throw new Error(`Kontrakt zwrócił HTTP ${response.status}.`);
        const contract = await response.json();
        fields.innerHTML = contract.inputFields.map(fieldHtml).join("");

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.checkValidity()) {
                errorMessage.hidden = false;
                form.reportValidity();
                form.querySelector(":invalid")?.focus();
                return;
            }
            errorMessage.hidden = true;
            const comparison = evaluateComparison(contract, valuesFromForm(form, contract));
            prototypeNotes.open = false;
            renderRecommendation(resultContainer, comparison, contract);
            renderCandidates(candidateCards, candidateSection, comparison, contract);
            resultContainer.focus();
        });

        form.addEventListener("input", () => {
            if (form.checkValidity()) errorMessage.hidden = true;
        });

        form.addEventListener("change", () => {
            if (form.checkValidity()) errorMessage.hidden = true;
        });

        form.addEventListener("reset", () => {
            window.setTimeout(() => {
                errorMessage.hidden = true;
                resultContainer.removeAttribute("data-preferred-product-id");
                resultContainer.innerHTML = `<div class="comparison-empty"><span>Wynik bez rankingu</span><h2>Najpierw scenariusz, potem produkt.</h2><p>Po odpowiedzi zobaczysz rekomendowany Product Identity albo brak jednoznacznego zwycięzcy, wraz z powodami, kompromisami i nierozstrzygniętymi warunkami.</p></div>`;
                candidateSection.hidden = true;
                candidateSection.querySelector("#candidate-title").textContent = "Najlepiej pasuje Ci";
                candidateCards.innerHTML = "";
                prototypeNotes.open = false;
                form.querySelector("input")?.focus();
            });
        });
    } catch (error) {
        renderLoadError(fields, resultContainer, error);
    }
}

if (typeof document !== "undefined") {
    mountComparison();
}
