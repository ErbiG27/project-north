(function renderDecisionOffer() {
    "use strict";

    const { load, formatMoney, formatValue, formatDate, freshnessFor, escapeHtml } = window.NorthOffers;
    const root = document.getElementById("offer-content");
    const offerId = document.body.dataset.offerId;
    const term = (key, label) => window.NorthGlossary.label(key, label);

    const providerLogos = {
        "bank-millennium-millennium-360": "../assets/logos/bank-millennium.svg",
        "nest-bank-nest-konto": "../assets/logos/nest-bank.png",
        "bank-pekao-konto-przekorzystne": "../assets/logos/bank-pekao.svg"
    };

    const seoMetadata = {
        "bank-millennium-millennium-360": {
            title: "Konto Millennium 360° — analiza wartości | North",
            description: "Analiza Konta Millennium 360°: wartość dla scenariusza, warunki, koszty, ryzyko, North Match, Verdict i oficjalne źródła."
        },
        "nest-bank-nest-konto": {
            title: "Nest Konto — analiza cashbacku i warunków | North",
            description: "Analiza Nest Konta: wartość cashbacku dla scenariusza, warunki, koszty, North Match, Verdict i oficjalne źródła."
        },
        "bank-pekao-konto-przekorzystne": {
            title: "Konto Przekorzystne — analiza wartości | North",
            description: "Analiza Konta Przekorzystnego: gotówka i nagrody podróżne, wartość dla scenariusza, North Match, Verdict i oficjalne źródła."
        },
        "kraken-referral-crypto-hard-case": {
            title: "Kraken Referral — validation case | North",
            description: "Nieafiliacyjny validation case programu Kraken Referral: niepewna nagroda, kapitał narażony na ryzyko, koszty, Confidence i oficjalne źródła."
        }
    };

    const inputLabels = {
        age: ["Wiek", " lat"],
        eligibleInflowFirst14Days: ["Wpływ w 14 dni", " zł"],
        walletPaymentsFirst14Days: ["Płatności portfelem w 14 dni", ""],
        monthlyEligibleInflow: ["Miesięczny wpływ", " zł"],
        monthlyEligibleSpend: ["Miesięczne wydatki", " zł"],
        activeMonths: ["Horyzont", " mies."],
        keepsBlikAndConsents: ["BLIK i zgody utrzymane", ""],
        eligibleSpendPerMonth: ["Kwalifikowane wydatki", " zł/mies."],
        salaryConditionMet: ["Kwalifikowany wpływ", ""],
        allChannelConsent: ["Wszystkie kanały zgody", ""],
        eurExchange: ["Wymiana EUR", ""],
        eurExchangeWithin30Days: ["Wymiana EUR w terminie", " EUR"],
        eurAccount: ["Konto EUR", ""],
        qualifiedForBoth: ["Kwalifikacja do obu promocji", ""],
        openingConditions: ["Warunki otwarcia", ""],
        monthOneCardPayments: ["Płatności kartą — miesiąc 1", ""],
        monthTwoCardPayments: ["Płatności kartą — miesiąc 2", ""],
        travelExpenses: ["Założone wydatki podróżne", " zł"],
        monthlyTransactionOrderAndSpend: ["Miesięczny układ transakcji", ""],
        eligibleTravelExpenses: ["Kwalifikowane wydatki podróżne", ""],
        referralOfferVisible: ["Oferta widoczna w aplikacji", ""],
        requiredFiatDeposit: ["Wymagany depozyt fiat", ""],
        requiredTradeVolume: ["Wymagany obrót", ""],
        qualifyingAsset: ["Kwalifikowane aktywo", ""],
        executionFee: ["Opłata wykonania", ""],
        executionSpread: ["Spread wykonania", ""]
    };

    function shortProvider(offer) {
        if (offer.identity.id.includes("millennium")) return "Bank Millennium";
        if (offer.identity.id.includes("nest")) return "Nest Bank";
        if (offer.identity.id.includes("pekao")) return "Bank Pekao";
        return offer.identity.provider;
    }

    function monogram(offer) {
        return shortProvider(offer).split(" ").at(-1).slice(0, 1);
    }

    function asArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function providerMark(offer) {
        const src = providerLogos[offer.identity.id];
        const fallback = `<span class="bank-monogram" aria-hidden="true">${escapeHtml(monogram(offer))}</span>`;
        if (!src) return fallback;
        return `<span class="bank-mark"><img class="bank-logo" src="${src}" alt="" aria-hidden="true" decoding="async">${fallback}</span>`;
    }

    function initBankMarkFallbacks(scope) {
        scope.querySelectorAll(".bank-logo").forEach((image) => {
            const showFallback = () => image.closest(".bank-mark")?.classList.add("bank-mark--fallback");
            image.addEventListener("error", showFallback, { once: true });
            if (image.complete && image.naturalWidth === 0) showFallback();
        });
    }

    function sourceTitle(source) {
        return source?.title?.trim() || "Oficjalne źródło bez opisowej nazwy";
    }

    function verdictClass(verdict) {
        return `verdict-badge verdict-badge--${String(verdict).toLowerCase().replaceAll("_", "-")}`;
    }

    function readableStatus(status) {
        const labels = { active: "aktywna", closing: "kończy się", expired: "wygasła", under_verification: "w weryfikacji" };
        return labels[status] || status;
    }

    function readableForm(form) {
        const labels = { cash: "gotówka", cashback: "zwrot / nagroda pieniężna", voucher: "voucher", points: "punkty", interest: "odsetki", fee_waiver: "zwolnienie z opłaty", asset: "aktywo", other: "inna forma" };
        return labels[form] || form;
    }

    function readableSourceType(type) {
        const labels = {
            official_regulation: "Oficjalny regulamin",
            official_fee_table: "Oficjalna tabela opłat",
            official_product_page: "Oficjalna strona produktu",
            official_faq: "Oficjalne FAQ",
            official_support_confirmation: "Oficjalne potwierdzenie",
            secondary: "Źródło wtórne"
        };
        return labels[type] || "Oficjalne źródło";
    }

    function readableSupportLevel(level) {
        const labels = {
            direct: "Potwierdzone wprost",
            interpreted: "Interpretacja North",
            missing: "Brak pełnego potwierdzenia",
            conflicting: "Konflikt źródeł"
        };
        return labels[level] || level;
    }

    function evidenceFieldLabel(item, offer) {
        const path = item.fieldPath;
        if (path.startsWith("identity.edition")) return "Edycja i okres oferty";
        if (path.startsWith("identity.status")) return "Dostępność oferty";
        if (path.startsWith("value.advertisedMax")) return "Advertised Max";
        if (path.startsWith("value.rewardComponents")) {
            const componentId = path.match(/\[([^\]]+)\]/)?.[1];
            if (componentId === "*") return "Łączenie składników nagrody";
            const component = offer.value.rewardComponents.find((entry) => entry.id === componentId);
            return component ? `Składnik: ${component.label}` : "Składniki nagrody";
        }
        if (path.startsWith("value.easyFloor")) return "Easy Floor";
        if (path.startsWith("value.scenarioFormula")) return "Formuła wartości";
        if (path.startsWith("eligibility.requiredIncome")) return "Warunek wpływu";
        if (path.startsWith("eligibility.requiredSpend")) return "Warunek wydatków";
        if (path.startsWith("eligibility")) return "Kwalifikacja";
        if (path.startsWith("execution.deadlines")) return "Terminy";
        if (path.startsWith("execution.actions")) return "Wymagane działania";
        if (path.startsWith("execution.failurePoints")) return "Ryzyko utraty";
        if (path.startsWith("execution.safeExit")) return "Wyjście z oferty";
        if (path.startsWith("cost.directFees")) return "Koszty bezpośrednie";
        if (path.startsWith("cost.avoidableFees")) return "Opłaty możliwe do uniknięcia";
        if (path.startsWith("cost.downstreamCosts")) return "Koszty dalsze";
        if (path.startsWith("decision.northValue")) return "North Value scenariusza";
        if (path.startsWith("decision.verdict")) return "North Verdict scenariusza";
        return "Krytyczny warunek";
    }

    function valueFromScenario(value, key) {
        return value ? formatValue(value[key]) : "Wymaga danych scenariusza";
    }

    function renderInputs(inputs) {
        return Object.entries(inputs).map(([key, rawValue]) => {
            const [label, suffix] = inputLabels[key] || [key, ""];
            let value = rawValue;
            if (rawValue === true) value = "tak";
            if (rawValue === false) value = "nie";
            if (rawValue === null) value = "brak danych";
            return `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}${escapeHtml(suffix)}</strong></li>`;
        }).join("");
    }

    function renderMoneyOrRule(item) {
        if (item.amount) return formatMoney(item.amount);
        if (item.amountOrRule) return escapeHtml(item.amountOrRule);
        return "Brak stałej kwoty";
    }

    function renderHardCaseSummary(offer) {
        if (offer.identity.category !== "crypto_validation") return "";
        const capital = offer.eligibility.requiredCapital;
        const capitalAmount = capital.amount ? formatMoney(capital.amount) : "NOT DETERMINABLE";
        const fee = offer.cost.directFees[0];
        const spread = offer.cost.downstreamCosts.find((item) => item.label.toLowerCase().includes("spread"));
        return `
            <section class="offer-section hard-case-summary" id="risk" aria-labelledby="risk-title">
                <div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> Controlled validation case</p><h2 id="risk-title">Nagroda i ryzyko nie są jedną liczbą</h2></div><p>To test odporności Decision Model v1, nie rekomendacja krypto ani nowa kategoria North.</p></div>
                <dl class="hard-case-grid">
                    <div><dt>Nominal reward</dt><dd>${escapeHtml(offer.value.advertisedMax.displayLabel)}</dd><span>${escapeHtml(offer.value.advertisedMax.caveat)}</span></div>
                    <div><dt>Usable reward</dt><dd>NOT DETERMINABLE</dd><span>Forma i wartość aktywa mogą zmienić się przed zaksięgowaniem oraz po nim.</span></div>
                    <div><dt>Required capital</dt><dd>${capitalAmount}</dd><span>${escapeHtml(capital.note || "Brak pełnych danych publicznych.")}</span></div>
                    <div><dt>Capital at risk</dt><dd>${capital.capitalAtRisk ? "TAK" : "NIE"}</dd><span>${escapeHtml(capital.holdingPeriod || "Okres ekspozycji nie jest publicznie określony.")}</span></div>
                    <div><dt>Trading fee</dt><dd>${fee && fee.amount ? formatMoney(fee.amount) : "DYNAMICZNA"}</dd><span>${escapeHtml(fee ? fee.appliesDuring : "Zależy od ścieżki wykonania.")}</span></div>
                    <div><dt>Spread</dt><dd>DYNAMICZNY</dd><span>${escapeHtml(spread ? spread.amountOrRule : "Nie można ustalić z góry.")}</span></div>
                    <div><dt>Market exposure</dt><dd>TAK</dd><span>Stablecoiny nie kwalifikują się; wymagany zakup aktywa o zmiennej cenie.</span></div>
                    <div><dt>Time requirement</dt><dd>15 / 30 dni</dd><span>Oficjalne strony są sprzeczne, dlatego termin blokuje pozytywny Verdict.</span></div>
                </dl>
            </section>`;
    }

    function renderValueSummary(offer) {
        const floor = offer.value.easyFloor ? formatValue(offer.value.easyFloor.usableValue) : "Brak uczciwego łatwego rdzenia";
        const conditional = offer.value.conditionalMax ? formatValue(offer.value.conditionalMax.usableValue) : "Nie dotyczy";
        return `
            <section class="offer-section offer-value-section" id="value" aria-labelledby="value-title">
                <div class="offer-section-heading">
                    <div><p class="section-kicker"><span aria-hidden="true"></span> North Value</p><h2 id="value-title">Najpierw rozbijamy reklamę na wartości</h2></div>
                    <p>Nie łączymy pieniędzy, czasu, wysiłku i ryzyka w arbitralny wynik. Każdy jawny scenariusz ma własny Value i Verdict.</p>
                </div>
                <dl class="north-value-grid">
                    <div><dt>${term("advertisedMax")}</dt><dd>${escapeHtml(offer.value.advertisedMax.displayLabel)}</dd><span>${escapeHtml(offer.value.advertisedMax.caveat)}</span></div>
                    <div><dt>${term("easyFloor")}</dt><dd>${floor}</dd><span>${offer.value.easyFloor ? "Tylko przy opisanych założeniach; nie jest gwarantowany." : "Model nie udaje, że istnieje prosty gwarantowany rdzeń."}</span></div>
                    <div><dt>${term("yourLikelyValue")}</dt><dd>Wybierz jawny scenariusz</dd><span>Kwoty i zakresy są pokazane niżej.</span></div>
                    <div><dt>${term("conditionalMax")}</dt><dd>${conditional}</dd><span>${offer.value.conditionalMax ? escapeHtml(offer.value.conditionalMax.assumptions[0]) : "Nie jest potrzebny dla tej oferty."}</span></div>
                    <div><dt>${term("expectedUsableValue")}</dt><dd>Zależy od scenariusza</dd><span>Uwzględnia formę i ograniczenia nagrody, nie fikcyjne prawdopodobieństwo.</span></div>
                    <div><dt>${term("netScenarioValue")}</dt><dd>Zależy od scenariusza</dd><span>Potwierdzone koszty bezpośrednie są odejmowane; wysiłek pozostaje osobno.</span></div>
                </dl>
            </section>`;
    }

    function scenarioBlocker(example, offer) {
        if (example.verdict === "NOT ENOUGH DATA") {
            return offer.decision.verdict.positiveBlockers.join(" ") || "Brak krytycznych danych scenariusza.";
        }
        if (example.verdict === "SKIP") {
            return "Negatywny, potwierdzony warunek scenariusza nie uzasadnia nowych obowiązków.";
        }
        return "Niespełnienie któregokolwiek materialnego założenia scenariusza zmienia wartość lub Verdict.";
    }

    function renderScenarios(offer) {
        const cards = offer.value.scenarioExamples.map((example, index) => {
            const value = offer.decision.northValue.find((item) => item.scenarioId === example.id);
            const confidence = example.confidenceBand || offer.decision.northConfidence.band;
            return `
                <article class="offer-scenario-card">
                    <div class="scenario-card-head">
                        <span>Scenariusz demonstracyjny ${index + 1}</span>
                        <span class="${verdictClass(example.verdict)}">${escapeHtml(example.verdict)}</span>
                    </div>
                    <h3>${escapeHtml(example.label)}</h3>
                    <ul class="input-list">${renderInputs(example.userInputs)}</ul>
                    ${example.calculation ? `<p class="scenario-formula">${escapeHtml(example.calculation)}</p>` : ""}
                    <dl class="scenario-value-grid">
                        <div><dt>${term("advertisedMax")}</dt><dd>${escapeHtml(offer.value.advertisedMax.displayLabel)}</dd></div>
                        <div><dt>${term("easyFloor")}</dt><dd>${valueFromScenario(value, "easyFloor")}</dd></div>
                        <div><dt>${term("yourLikelyValue")}</dt><dd>${valueFromScenario(value, "likelyGrossValue")}</dd></div>
                        <div><dt>${term("expectedUsableValue")}</dt><dd>${valueFromScenario(value, "expectedUsableValue")}</dd></div>
                        <div><dt>${term("netScenarioValue")}</dt><dd>${valueFromScenario(value, "netScenarioValue")}</dd></div>
                        <div><dt>Koszt bezpośredni</dt><dd>${valueFromScenario(value, "directCost")}</dd></div>
                    </dl>
                    <dl class="scenario-qualities">
                        <div><dt>Wysiłek</dt><dd>${escapeHtml(value.effortBurden)}</dd></div>
                        <div><dt>Czas</dt><dd>${escapeHtml(value.duration)}</dd></div>
                        <div><dt>${term("failureRisk", "Ryzyko utraty")}</dt><dd>${escapeHtml(value.failureRisk)}</dd></div>
                        <div><dt>${term("flexibility", "Elastyczność")}</dt><dd>${escapeHtml(value.flexibility)}</dd></div>
                    </dl>
                    <div class="scenario-verdict-copy">
                        <p><strong>Summary:</strong> ${escapeHtml(example.verdictReason)}</p>
                        <p><strong>Conditions:</strong> założenia scenariusza wskazane powyżej.</p>
                        <p><strong>Blockers:</strong> ${escapeHtml(scenarioBlocker(example, offer))}</p>
                        <p><strong>Confidence:</strong> ${escapeHtml(confidence)}</p>
                        <p><strong>Kontra do nothing:</strong> ${escapeHtml(offer.decision.comparison.conclusion)}</p>
                    </div>
                </article>`;
        }).join("");

        return `
            <section class="offer-section" id="scenarios" aria-labelledby="scenarios-title">
                <div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> Jawne założenia</p><h2 id="scenarios-title">Scenariusze zmieniają wartość i decyzję</h2></div><p>To przykłady demonstracyjne, nie statystyczne profile klientów. Bez procentowego dopasowania.</p></div>
                <div class="offer-scenarios-grid">${cards}</div>
            </section>`;
    }

    function renderComponents(offer) {
        return `
            <section class="offer-section" id="components" aria-labelledby="components-title">
                <div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> Breakdown</p><h2 id="components-title">Co dokładnie składa się na wartość</h2></div><p>${escapeHtml(offer.value.advertisedMax.aggregationBasis)}</p></div>
                <div class="reward-components-grid">
                    ${offer.value.rewardComponents.map((component) => `
                        <article class="reward-component-card">
                            <div><span>${escapeHtml(readableForm(component.form))}</span><strong>${formatValue(component.advertisedValue)}</strong></div>
                            <h3>${escapeHtml(component.label)}</h3>
                            <p>${escapeHtml(component.calculation)}</p>
                            <p class="usable-rule"><strong>Użyteczność:</strong> ${escapeHtml(component.usability.usableValueRule)}</p>
                            ${component.usability.restrictions.length ? `<ul>${component.usability.restrictions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
                        </article>`).join("")}
                </div>
            </section>`;
    }

    function renderEligibility(offer) {
        const income = offer.eligibility.requiredIncome;
        return `
            <section class="offer-section offer-section--split" id="conditions" aria-labelledby="conditions-title">
                <div>
                    <p class="section-kicker"><span aria-hidden="true"></span> Kwalifikacja</p>
                    <h2 id="conditions-title">Krytyczne warunki wejścia</h2>
                    <p>${escapeHtml(offer.eligibility.geography.basis)}</p>
                    <div class="condition-block"><h3>Nowy klient</h3><p>${escapeHtml(offer.eligibility.newCustomer.definition)}</p></div>
                    <div class="condition-block"><h3>Wpływ</h3><p>${income.required ? escapeHtml(income.cadence) : "Wpływ nie jest warunkiem nagrody w tej ofercie."}</p>${income.ageBands ? `<ul>${income.ageBands.map((band) => `<li>${escapeHtml(band.age)}: ${formatMoney(band.amount)}</li>`).join("")}</ul>` : ""}</div>
                    <div class="condition-block"><h3>Wydatki</h3>${asArray(offer.eligibility.requiredSpend).length ? asArray(offer.eligibility.requiredSpend).map((spend) => `<p><strong>${escapeHtml(spend.cadence || "Warunek wydatków")}</strong><br>${escapeHtml(spend.eligibleTransactions || "Brak dodatkowego opisu w rekordzie.")}</p>`).join("") : "<p>Ta oferta nie ma osobnego warunku wydatków w rekordzie.</p>"}</div>
                </div>
                <aside class="blocker-panel">
                    <h3>Co może wykluczyć</h3>
                    ${asArray(offer.eligibility.disqualifiers).length ? `<ul>${asArray(offer.eligibility.disqualifiers).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>Brak dodatkowych wykluczeń opisanych w rekordzie.</p>"}
                    ${offer.eligibility.age.note ? `<p class="uncertainty-note"><strong>Nota:</strong> ${escapeHtml(offer.eligibility.age.note)}</p>` : ""}
                </aside>
            </section>`;
    }

    function renderExecution(offer) {
        return `
            <section class="offer-section" id="execution" aria-labelledby="execution-title">
                <div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> Execution</p><h2 id="execution-title">Działania, rytm i punkty utraty</h2></div><p>${escapeHtml(offer.execution.cadence.summary)}</p></div>
                <ol class="action-timeline">
                    ${asArray(offer.execution.actions).map((action, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(action.label)}</h3><p>${escapeHtml(action.timing)} · ${escapeHtml(action.cadence)}</p><small>Jeśli pominiesz: ${escapeHtml(action.consequenceIfMissed)}</small></div></li>`).join("") || "<li><div><h3>Brak osobnych kroków</h3><p>Rekord nie definiuje dodatkowej sekwencji działań.</p></div></li>"}
                </ol>
                <div class="failure-grid">
                    ${asArray(offer.execution.failurePoints).map((point) => `<article><span class="risk-level risk-level--${escapeHtml(point.severity)}">${escapeHtml(point.severity)}</span><h3>${escapeHtml(point.label)}</h3><p>${escapeHtml(point.consequence)}</p><small>Ograniczenie ryzyka: ${escapeHtml(point.mitigation)}</small></article>`).join("") || "<article><h3>Brak osobnych punktów utraty</h3><p>Rekord nie definiuje dodatkowego failure point.</p></article>"}
                </div>
                <article class="safe-exit-panel">
                    <div><p class="section-kicker">Safe exit · ${escapeHtml(offer.execution.safeExit.status)}</p><h3>${escapeHtml(offer.execution.safeExit.earliestExit)}</h3><p>${escapeHtml(offer.execution.safeExit.notice)}</p></div>
                    <div><strong>Przed wyjściem</strong>${asArray(offer.execution.safeExit.steps).length ? `<ol>${asArray(offer.execution.safeExit.steps).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>` : "<p>Brak dodatkowej checklisty w rekordzie.</p>"}<p class="uncertainty-note">${escapeHtml(offer.execution.safeExit.uncertaintyNote || "Brak dodatkowej noty.")}</p></div>
                </article>
            </section>`;
    }

    function renderCosts(offer) {
        const items = [
            ...asArray(offer.cost.directFees).map((item) => ({ type: "Koszt bezpośredni", label: item.label, value: formatMoney(item.amount), detail: item.appliesDuring })),
            ...asArray(offer.cost.avoidableFees).map((item) => ({ type: "Opłata możliwa do uniknięcia", label: item.label, value: item.amount ? formatMoney(item.amount) : (offer.identity.category === "crypto_validation" ? "Dynamiczna" : "Zależna od wieku"), detail: item.avoidanceCondition })),
            ...asArray(offer.cost.downstreamCosts).map((item) => ({ type: "Koszt dalszy", label: item.label, value: renderMoneyOrRule(item), detail: item.trigger })),
            ...asArray(offer.cost.opportunityCost).map((item) => ({ type: "Opportunity Cost", glossary: "opportunityCost", label: item.label, value: item.monetized ? renderMoneyOrRule(item) : "Nie monetyzujemy", detail: item.assumption }))
        ];
        return `
            <section class="offer-section" id="costs" aria-labelledby="costs-title">
                <div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> Koszt bez fikcji</p><h2 id="costs-title">Co płacisz i z czego rezygnujesz</h2></div><p>Czas i wysiłek pozostają opisem jakościowym. Nie przeliczamy ich na arbitralne złotówki.</p></div>
                <div class="cost-list">${items.length ? items.map((item) => `<article><span>${item.glossary ? term(item.glossary) : escapeHtml(item.type)}</span><h3>${escapeHtml(item.label || "Koszt bez nazwy")}</h3><strong>${item.value}</strong><p>${escapeHtml(item.detail || "Brak dodatkowego opisu.")}</p></article>`).join("") : "<p class=\"notice\">W rekordzie nie ma dodatkowych kosztów do pokazania.</p>"}</div>
            </section>`;
    }

    function renderVerdict(offer) {
        const verdict = offer.decision.verdict;
        const comparison = offer.decision.comparison;
        return `
            <section class="offer-section" id="verdict" aria-labelledby="offer-verdict-title">
                <article class="full-verdict">
                    <div class="full-verdict__head"><div><p class="section-kicker"><span aria-hidden="true"></span> Verdict bez danych użytkownika</p><h2 id="offer-verdict-title">North Verdict</h2></div><span class="${verdictClass(verdict.state)}">${escapeHtml(verdict.state)}</span></div>
                    <p class="verdict-summary">${escapeHtml(verdict.summary)}</p>
                    <div class="verdict-details">
                        <div><h3>Powody (Reasons)</h3><ul>${asArray(verdict.reasons).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
                        <div><h3>Warunki (Conditions)</h3>${asArray(verdict.conditions).length ? `<ul>${asArray(verdict.conditions).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>Brak warunków pozytywnego Verdict bez scenariusza użytkownika.</p>"}</div>
                        <div><h3>Blokery (Blockers)</h3>${asArray(verdict.positiveBlockers).length ? `<ul>${asArray(verdict.positiveBlockers).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>Brak dodatkowych blokerów w rekordzie.</p>"}</div>
                        <div><h3>${term("northConfidence")}</h3><strong class="confidence-large">${escapeHtml(offer.decision.northConfidence.band)}</strong><p>${escapeHtml(asArray(offer.decision.northConfidence.reasons)[0] || "Brak dodatkowego uzasadnienia w rekordzie.")}</p></div>
                    </div>
                    <div class="comparison-panel"><div><span>Do nothing</span><strong>${formatMoney(comparison.doNothing.reward)} nagrody · ${formatMoney(comparison.doNothing.directCost)} kosztu</strong><p>Wysiłek: ${escapeHtml(comparison.doNothing.effort)} · nowe ryzyko: ${escapeHtml(comparison.doNothing.failureRisk)}</p></div><div><span>Wniosek</span><p>${escapeHtml(comparison.conclusion)}</p></div></div>
                </article>
            </section>`;
    }

    function criticalEvidence(offer) {
        const selected = [];
        const fieldSources = asArray(offer.evidence?.fieldSources);
        const addFirst = (prefix) => {
            const found = fieldSources.find((item) => item.fieldPath.startsWith(prefix));
            if (found) selected.push(found);
        };
        const addAll = (prefix) => {
            fieldSources.filter((item) => item.fieldPath.startsWith(prefix)).forEach((item) => selected.push(item));
        };
        const addExact = (path) => {
            fieldSources.filter((item) => item.fieldPath === path).forEach((item) => selected.push(item));
        };
        const addOnePerField = (prefix) => {
            const seen = new Set();
            fieldSources.filter((item) => item.fieldPath.startsWith(prefix)).forEach((item) => {
                if (!seen.has(item.fieldPath)) {
                    selected.push(item);
                    seen.add(item.fieldPath);
                }
            });
        };

        addFirst("identity.status");
        addAll("value.advertisedMax");
        addOnePerField("value.rewardComponents[");
        addFirst("value.easyFloor");
        addExact("eligibility");
        addExact("execution.actions");
        addFirst("execution.failurePoints");
        addFirst("cost.directFees");
        addFirst("cost.avoidableFees");
        addFirst("decision.northValue");
        addFirst("decision.verdict");
        return selected;
    }

    function renderEvidence(offer) {
        const ledger = criticalEvidence(offer);
        const freshness = freshnessFor(offer);
        const sources = asArray(offer.evidence?.sources);
        const conflicts = asArray(offer.evidence?.conflicts);
        const sourceById = new Map(sources.map((source) => [source.id, source]));
        const affiliate = offer.affiliate?.available && offer.affiliate.url
            ? `<div class="affiliate-action"><a class="north-button" href="${escapeHtml(offer.affiliate.url)}" target="_blank" rel="sponsored noopener">Przejdź do oferty partnerskiej <span aria-hidden="true">↗</span><span class="visually-hidden"> (otwiera nową kartę)</span></a><p>${escapeHtml(offer.affiliate.disclosure)} Link nie wpływa na Value, Confidence ani Verdict.</p></div>`
            : "";
        const sourceActions = [
            offer.evidence?.regulationUrl ? `<a class="north-link" href="${escapeHtml(offer.evidence.regulationUrl)}" target="_blank" rel="noopener">Otwórz główny regulamin <span aria-hidden="true">↗</span><span class="visually-hidden"> (otwiera nową kartę)</span></a>` : "",
            offer.evidence?.officialUrl ? `<a class="north-link" href="${escapeHtml(offer.evidence.officialUrl)}" target="_blank" rel="noopener">Oficjalna strona produktu <span aria-hidden="true">↗</span><span class="visually-hidden"> (otwiera nową kartę)</span></a>` : ""
        ].filter(Boolean).join("");
        return `
            <section class="offer-section" id="sources" aria-labelledby="sources-title">
                <div class="offer-section-heading"><div><p class="section-kicker"><span aria-hidden="true"></span> Evidence</p><h2 id="sources-title">Skąd wiemy i kiedy sprawdziliśmy</h2></div><p>Przy każdej kluczowej liczbie i regule pokazujemy rodzaj źródła, dokładne miejsce w dokumencie, datę sprawdzenia oraz niepewność.</p></div>
                <div class="evidence-status-grid">
                    <div><span>Aktualność danych</span><strong class="freshness-text freshness-text--${freshness.state.toLowerCase().replaceAll("_", "-")}">${escapeHtml(freshness.label)}</strong></div>
                    <div><span>Ostatni pełny review</span><strong>${formatDate(offer.identity.verifiedAt)}</strong></div>
                    <div><span>${term("northConfidence")}</span><strong>${escapeHtml(offer.decision.northConfidence.band)}</strong></div>
                    <div><span>Ręczny recheck do</span><strong>${formatDate(offer.evidence?.recheckBy)}</strong></div>
                </div>
                <p class="freshness-explanation"><span class="freshness-badge freshness-badge--${freshness.state.toLowerCase().replaceAll("_", "-")}">${escapeHtml(freshness.label)}</span>${escapeHtml(freshness.explanation)}</p>
                <div class="sources-layout">
                    <div>
                        <h3>Oficjalne źródła</h3>
                        <ul class="source-list">${sources.length ? sources.map((source) => `<li>${source.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(sourceTitle(source))} <span aria-hidden="true">↗</span><span class="visually-hidden"> (otwiera nową kartę)</span></a>` : `<span class="source-title">${escapeHtml(sourceTitle(source))}</span>`}<span>${escapeHtml(readableSourceType(source.type))} · sprawdzono ${formatDate(source.accessedAt)} · ${escapeHtml(source.editionReference || "bieżąca edycja")}</span></li>`).join("") : "<li><span class=\"source-title\">Brak źródeł do pokazania</span><span>Pozytywny Verdict jest zablokowany do czasu uzupełnienia evidence.</span></li>"}</ul>
                    </div>
                    <aside class="confidence-reasons"><h3>Dlaczego ${escapeHtml(offer.decision.northConfidence.band)}</h3>${asArray(offer.decision.northConfidence.reasons).length ? `<ul>${asArray(offer.decision.northConfidence.reasons).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>` : "<p>Brak dodatkowego uzasadnienia w rekordzie.</p>"}${asArray(offer.decision.northConfidence.blockers).length ? `<h4>Blokery</h4><ul>${asArray(offer.decision.northConfidence.blockers).map((blocker) => `<li>${escapeHtml(blocker)}</li>`).join("")}</ul>` : ""}</aside>
                </div>
                <div class="evidence-ledger">
                    <h3>Dowody dla kluczowych liczb i warunków</h3>
                    ${ledger.map((item) => {
                        const source = sourceById.get(item.sourceId);
                        return `<article><div><span>${escapeHtml(evidenceFieldLabel(item, offer))}</span><strong>${escapeHtml(readableSupportLevel(item.supportLevel))}</strong></div>${source?.url ? `<a class="evidence-source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(readableSourceType(source.type))}: ${escapeHtml(sourceTitle(source))} <span aria-hidden="true">↗</span><span class="visually-hidden"> (otwiera nową kartę)</span></a>` : `<p class="evidence-source-missing">Źródło nie ma dostępnego linku.</p>`}<p><strong>Gdzie:</strong> ${escapeHtml(item.reference || "Brak dokładnej referencji")}</p><small>Sprawdzono ${formatDate(item.checkedAt)}</small>${item.uncertaintyNote ? `<p class="uncertainty-note"><strong>Niepewność:</strong> ${escapeHtml(item.uncertaintyNote)}</p>` : ""}</article>`;
                    }).join("")}
                </div>
                ${conflicts.length ? `<div class="conflicts-box"><h3>Konflikty źródeł</h3>${conflicts.map((conflict) => `<article><strong>${escapeHtml(evidenceFieldLabel({ fieldPath: conflict.fieldPath }, offer))}</strong><p>${escapeHtml(conflict.description)}</p><small>Jak traktuje to North: ${escapeHtml(conflict.resolutionStatus)}</small></article>`).join("")}</div>` : `<p class="no-conflicts">Nie wykryto konfliktu źródeł, który blokowałby ten rekord.</p>`}
                ${sourceActions ? `<div class="source-actions">${sourceActions}</div>` : "<p class=\"no-conflicts\">Brak dodatkowych linków źródłowych w rekordzie.</p>"}
                ${affiliate}
            </section>`;
    }

    function renderOffer(offer) {
        const freshness = freshnessFor(offer);
        const isValidationCase = offer.identity.category === "crypto_validation";
        const validityCopy = offer.identity.edition.validTo ? ` · wejście do ${formatDate(offer.identity.edition.validTo)}` : " · warunki dynamiczne";
        const footerDisclosure = isValidationCase
            ? "To nieafiliacyjny validation case bez linku referral."
            : "North może otrzymać wynagrodzenie za wybrane linki; nie wpływa to na Value, Confidence ani Verdict.";
        const seo = seoMetadata[offer.identity.id];
        document.title = seo?.title || `${shortProvider(offer)} — analiza wartości | North`;
        const meta = document.querySelector('meta[name="description"]');
        meta.content = seo?.description || `Analiza ${shortProvider(offer)}: wartość dla scenariusza, warunki, koszty, ryzyko, Verdict, Confidence i oficjalne źródła.`;
        root.removeAttribute("aria-live");
        root.innerHTML = `
            <section class="offer-decision-hero" aria-labelledby="offer-title">
                <div class="offer-decision-hero__copy">
                    <p class="section-kicker"><span aria-hidden="true"></span> ${isValidationCase ? "validation case · " : ""}${escapeHtml(readableStatus(offer.identity.status))} · review ${formatDate(offer.identity.verifiedAt)}</p>
                    <div class="offer-provider-row">${providerMark(offer)}<p>${escapeHtml(shortProvider(offer))}</p></div>
                    <h1 id="offer-title">${escapeHtml(offer.identity.title)}</h1>
                    <p class="offer-hero-problem">${escapeHtml(offer.listing.problemLabel)}</p>
                    <p>${escapeHtml(offer.listing.summary)}</p>
                    <div class="action-row"><a class="north-button" href="${offer.match ? "#match" : "#scenarios"}">${offer.match ? "Sprawdź dla siebie" : "Zobacz scenariusze"} <span aria-hidden="true">↓</span></a><a class="north-link" href="#sources">Sprawdź źródła</a></div>
                    <div class="hero-freshness"><span class="freshness-badge freshness-badge--${freshness.state.toLowerCase().replaceAll("_", "-")}">${escapeHtml(freshness.label)}</span><p>${escapeHtml(freshness.explanation)}</p></div>
                    <p class="record-meta">Edycja: ${escapeHtml(offer.identity.edition.name)}${validityCopy}</p>
                </div>
                <aside class="offer-hero-verdict">
                    <div class="panel-topline"><span>${term("verdict", "North Verdict")}</span><span class="confidence-badge">${term("northConfidence", "Confidence")} ${escapeHtml(offer.decision.northConfidence.band)}</span></div>
                    <span class="${verdictClass(offer.decision.verdict.state)}">${escapeHtml(offer.decision.verdict.state)}</span>
                    <h2>${escapeHtml(offer.decision.verdict.summary)}</h2>
                    <p>${escapeHtml(asArray(offer.decision.verdict.reasons).join(" ") || "Brak dodatkowego powodu w rekordzie.")}</p>
                    <div class="advertised-context"><span>${term("advertisedMax")}</span><strong>${escapeHtml(offer.value.advertisedMax.displayLabel)}</strong><small>${escapeHtml(offer.value.advertisedMax.caveat)}</small></div>
                </aside>
            </section>
            ${renderHardCaseSummary(offer)}
            ${renderValueSummary(offer)}
            ${offer.match ? '<div id="north-match-root"></div>' : ""}
            ${renderScenarios(offer)}
            ${renderComponents(offer)}
            ${renderEligibility(offer)}
            ${renderExecution(offer)}
            ${renderCosts(offer)}
            ${renderVerdict(offer)}
            ${renderEvidence(offer)}
            <footer class="offer-footer-page"><img src="../assets/brand/north-logo.svg" alt="North"><p>Decision Model v1 · ${escapeHtml(freshness.label)} · review ${formatDate(offer.identity.verifiedAt)}. North nie gwarantuje nagrody i nie zastępuje regulaminu ani indywidualnej porady.<br>${escapeHtml(footerDisclosure)}</p><nav aria-label="Linki analizy"><a class="north-link" href="../methodology.html">Metodologia</a><a class="north-link" href="${isValidationCase ? "../methodology.html#validation" : "../index.html#opportunities"}">${isValidationCase ? "Wróć do validation case" : "Wróć do analiz"}</a></nav></footer>`;
        window.NorthGlossary.init(root);
        initBankMarkFallbacks(root);
        if (offer.match) window.NorthMatch.mount(root.querySelector("#north-match-root"), offer);
    }

    load("../data/decision-offers.json")
        .then((data) => {
            const offer = data.offers.find((item) => item.identity.id === offerId);
            if (!offer) throw new Error("Nie znaleziono rekordu oferty.");
            renderOffer(offer);
        })
        .catch(() => {
            root.innerHTML = `<div class="notice notice--error"><h1>Nie udało się wczytać analizy</h1><p>Otwórz stronę przez lokalny serwer albo wróć do listy analiz.</p><a class="north-link" href="../index.html#opportunities">Wróć do analiz</a></div>`;
        });
}());
