(function renderNorthLanding() {
    "use strict";

    const { load, formatMoney, formatValue, formatDate, freshnessFor, escapeHtml } = window.NorthOffers;

    const offerRoutes = {
        "bank-millennium-millennium-360": "offers/millennium.html",
        "nest-bank-nest-konto": "offers/nest.html",
        "bank-pekao-konto-przekorzystne": "offers/pekao.html"
    };

    const scenarioLetters = ["A", "B", "C"];

    function shortProvider(offer) {
        if (offer.identity.id.includes("millennium")) return "Bank Millennium";
        if (offer.identity.id.includes("nest")) return "Nest Bank";
        if (offer.identity.id.includes("pekao")) return "Bank Pekao";
        return offer.identity.provider;
    }

    function monogram(offer) {
        if (offer.identity.id.includes("millennium")) return "M";
        if (offer.identity.id.includes("nest")) return "N";
        if (offer.identity.id.includes("pekao")) return "P";
        return shortProvider(offer).slice(0, 1);
    }

    function verdictClass(verdict) {
        return `verdict-badge verdict-badge--${String(verdict).toLowerCase().replaceAll("_", "-")}`;
    }

    function freshnessBadge(offer) {
        const freshness = freshnessFor(offer);
        return `<span class="freshness-badge freshness-badge--${freshness.state.toLowerCase().replaceAll("_", "-")}">${escapeHtml(freshness.label)}</span>`;
    }

    function renderPekaoDemo(offer) {
        const target = document.getElementById("pekao-demo");
        const freshness = freshnessFor(offer);
        const advertisedMoney = offer.value.advertisedMax.displayLabel.replace(/^do\s+/i, "").replace(/\s+łącznie$/i, "");
        document.getElementById("value-demo-title").textContent = `${advertisedMoney} nie zawsze znaczy ${advertisedMoney}`;
        const travel = offer.value.rewardComponents.find((component) => component.id === "pekao-travel-rewards");
        const cashComponents = offer.value.rewardComponents.filter((component) => component.id !== "pekao-travel-rewards");
        const cashTotal = cashComponents.reduce((sum, component) => sum + component.advertisedValue.amount, 0);
        const scenario = offer.decision.northValue.find((item) => item.scenarioId === "pekao-opening-actions-only");
        const example = offer.value.scenarioExamples.find((item) => item.id === scenario.scenarioId);
        const mainFailure = offer.execution.failurePoints.find((point) => point.id === "pekao-insufficient-travel-spend");

        target.className = "pekao-demo-grid";
        target.innerHTML = `
            <article class="breakdown-panel">
                <div class="advertised-bar">
                    <span>Advertised Max · reklamowane przez oferenta</span>
                    <strong>${escapeHtml(offer.value.advertisedMax.displayLabel)}</strong>
                    <small>Łączna wartość nominalna; nie jedna gotówkowa premia.</small>
                </div>
                <div class="reward-breakdown">
                    <div class="reward-part reward-part--cash">
                        <span>Przelewy pieniężne</span>
                        <strong>${formatMoney({ amount: cashTotal, currency: "PLN" })}</strong>
                        <p>${cashComponents.map((component) => escapeHtml(component.calculation)).join(" ")}</p>
                    </div>
                    <div class="reward-plus" aria-hidden="true">+</div>
                    <div class="reward-part reward-part--restricted">
                        <span>Warunkowe nagrody podróżne</span>
                        <strong>do ${formatMoney(travel.advertisedValue)}</strong>
                        <p>${escapeHtml(travel.usability.usableValueRule)}</p>
                    </div>
                </div>
                <div class="critical-note">
                    <strong>Saldo podróżne nie jest gotówką.</strong>
                    <p>${escapeHtml(travel.usability.restrictions[0])} ${escapeHtml(travel.usability.restrictions[1])}</p>
                </div>
                <p class="record-meta">${freshnessBadge(offer)} Edycja sprawdzona ${formatDate(offer.identity.verifiedAt)} · Confidence ${escapeHtml(offer.decision.northConfidence.band)}</p>
                <a class="north-link" href="${offerRoutes[offer.identity.id]}#sources">Zobacz źródła i punkty regulaminu <span aria-hidden="true">→</span></a>
            </article>
            <aside class="snapshot-panel">
                <div class="panel-topline"><span>North Snapshot</span><span class="confidence-badge">${escapeHtml(offer.decision.northConfidence.band)}</span></div>
                <p class="snapshot-intro">Jawny scenariusz: ${escapeHtml(example.label)}.</p>
                <dl class="snapshot-values">
                    <div><dt>Advertised Max</dt><dd>${formatMoney(scenario.advertisedMax)}</dd><span>nie jest jedną gotówkową premią</span></div>
                    <div><dt>Easy Floor</dt><dd>${formatMoney(scenario.easyFloor)}</dd><span>przy założeniach opisanych w analizie</span></div>
                    <div><dt>Your Likely Value</dt><dd>${formatValue(scenario.likelyGrossValue)}</dd><span>część podróżna wyłączona bez danych</span></div>
                    <div><dt>Expected Usable Value</dt><dd>${formatValue(scenario.expectedUsableValue)}</dd><span>dla części startowej</span></div>
                    <div><dt>Net Scenario Value</dt><dd>${formatValue(scenario.netScenarioValue)}</dd><span>potwierdzony koszt bezpośredni: ${formatMoney(scenario.directCost)}</span></div>
                    <div><dt>Conditional Max</dt><dd>${formatValue(offer.value.conditionalMax.grossValue)}</dd><span>wymaga pełnego salda i wydatków podróżnych</span></div>
                </dl>
                <dl class="scenario-qualities">
                    <div><dt>Wysiłek</dt><dd>${escapeHtml(scenario.effortBurden)}</dd></div>
                    <div><dt>Czas</dt><dd>${escapeHtml(scenario.duration)}</dd></div>
                    <div><dt>Ryzyko</dt><dd>${escapeHtml(scenario.failureRisk)}</dd></div>
                    <div><dt>Elastyczność</dt><dd>${escapeHtml(scenario.flexibility)}</dd></div>
                </dl>
                <p class="risk-callout"><strong>Główny punkt utraty:</strong> ${escapeHtml(mainFailure.consequence)}</p>
                <span class="${verdictClass(example.verdict)}">${escapeHtml(example.verdict)}</span>
            </aside>`;
    }

    function scenarioInputs(scenario) {
        const inputs = scenario.userInputs;
        if (scenario.id === "nest-low-qualified-spend") {
            return [
                `${inputs.eligibleSpendPerMonth} zł kwalifikowanych wydatków miesięcznie`,
                `wymagany wpływ i zgody przez ${inputs.activeMonths} miesiące`,
                "bez wymiany EUR"
            ];
        }
        if (scenario.id === "nest-no-salary-transfer") {
            return [
                `${inputs.eligibleSpendPerMonth} zł kwalifikowanych wydatków miesięcznie`,
                "bez kwalifikowanego wpływu",
                "bez wymiany EUR"
            ];
        }
        return [
            `${inputs.eligibleSpendPerMonth} zł kwalifikowanych wydatków miesięcznie`,
            `wymagany wpływ i zgody przez ${inputs.activeMonths} miesiące`,
            `wymiana ${inputs.eurExchangeWithin30Days} EUR w terminie`
        ];
    }

    function renderNestScenarios(offer) {
        const target = document.getElementById("nest-scenarios");
        target.className = "scenario-grid";
        target.innerHTML = offer.value.scenarioExamples.map((example, index) => {
            const value = offer.decision.northValue.find((item) => item.scenarioId === example.id);
            const inputs = scenarioInputs(example);
            return `
                <article class="persona-card">
                    <div class="persona-card__head"><span>Scenariusz demonstracyjny ${scenarioLetters[index]}</span><span class="${verdictClass(example.verdict)}">${escapeHtml(example.verdict)}</span></div>
                    <h3>${escapeHtml(example.label)}</h3>
                    <ul class="assumption-list">${inputs.map((input) => `<li>${escapeHtml(input)}</li>`).join("")}</ul>
                    <div class="scenario-result">
                        <div><span>Your Likely Value</span><strong>${formatValue(example.grossValue)}</strong></div>
                        <div><span>Expected Usable Value</span><strong>${formatValue(example.usableValue)}</strong></div>
                    </div>
                    ${example.calculation ? `<p class="calculation">${escapeHtml(example.calculation)}</p>` : ""}
                    <dl class="compact-qualities">
                        <div><dt>Wysiłek</dt><dd>${escapeHtml(value.effortBurden)}</dd></div>
                        <div><dt>Czas</dt><dd>${escapeHtml(value.duration)}</dd></div>
                        <div><dt>Ryzyko</dt><dd>${escapeHtml(value.failureRisk)}</dd></div>
                        <div><dt>Elastyczność</dt><dd>${escapeHtml(value.flexibility)}</dd></div>
                    </dl>
                    <p class="verdict-reason"><strong>Powód Verdict:</strong> ${escapeHtml(example.verdictReason)}</p>
                    <p class="do-nothing"><strong>Kontra brak działania:</strong> 0 zł nagrody, 0 zł nowego kosztu, minimalny wysiłek.</p>
                    <p class="scenario-confidence">Confidence dla scenariusza: <strong>${escapeHtml(example.confidenceBand)}</strong></p>
                </article>`;
        }).join("");
    }

    function renderOffers(offers) {
        const target = document.getElementById("decision-offers");
        target.className = "decision-offers-grid";
        target.innerHTML = offers.map((offer) => {
            const firstExample = offer.value.scenarioExamples[0];
            const firstValue = offer.decision.northValue.find((item) => item.scenarioId === firstExample.id);
            const freshness = freshnessFor(offer);
            return `
                <article class="decision-offer-card">
                    <div class="decision-offer-card__top">
                        <span class="bank-monogram" aria-hidden="true">${escapeHtml(monogram(offer))}</span>
                        <div><p>${escapeHtml(shortProvider(offer))}</p><span class="offer-status">${escapeHtml(freshness.label)} · sprawdzono ${formatDate(offer.identity.verifiedAt)}</span></div>
                        <span class="confidence-badge">${escapeHtml(offer.decision.northConfidence.band)}</span>
                    </div>
                    <p class="problem-label">${escapeHtml(offer.listing.problemLabel)}</p>
                    <h3>${escapeHtml(offer.identity.title)}</h3>
                    <p class="offer-summary">${escapeHtml(offer.listing.summary)}</p>
                    <dl class="offer-card-values">
                        <div><dt>Advertised Max</dt><dd>${escapeHtml(offer.value.advertisedMax.displayLabel)}</dd></div>
                        <div><dt>Przykład Your Likely Value</dt><dd>${formatValue(firstValue.likelyGrossValue)}</dd></div>
                    </dl>
                    <div class="offer-card-verdict"><span>Bez danych użytkownika</span><strong>${escapeHtml(offer.decision.verdict.state)}</strong></div>
                    <a class="north-button north-button--card" href="${offerRoutes[offer.identity.id]}">Zobacz analizę <span aria-hidden="true">→</span></a>
                </article>`;
        }).join("");
    }

    function renderConfidence(offers, data) {
        const target = document.getElementById("confidence-summary");
        target.classList.remove("data-loading");
        target.innerHTML = offers.map((offer) => `<div><dt>${escapeHtml(shortProvider(offer).replace("Bank ", ""))}</dt><dd>${escapeHtml(offer.decision.northConfidence.band)}</dd></div>`).join("");
        const recheckBy = offers.map((offer) => offer.evidence.recheckBy).sort()[0];
        const dueCount = offers.filter((offer) => freshnessFor(offer).state === "RECHECK_DUE").length;
        document.getElementById("confidence-review").textContent = dueCount
            ? `${dueCount} ${dueCount === 1 ? "analiza wymaga" : "analizy wymagają"} ręcznego rechecku · poprzedni review: ${formatDate(data.reviewedAt)}`
            : `Pełny review: ${formatDate(data.reviewedAt)} · kolejny recheck do ${formatDate(recheckBy)}`;
        document.getElementById("footer-review").textContent = dueCount
            ? `ręczny recheck wymagany dla ${dueCount} ${dueCount === 1 ? "analizy" : "analiz"}`
            : `review ${formatDate(data.reviewedAt)} · recheck do ${formatDate(recheckBy)}`;
    }

    function renderError(message) {
        document.querySelectorAll(".data-loading").forEach((element) => {
            element.className = "notice notice--error";
            element.textContent = message;
        });
    }

    load("data/decision-offers.json")
        .then((data) => {
            const activeOffers = data.offers.filter((offer) => ["active", "closing"].includes(offer.identity.status) && offer.identity.verifiedAt && offer.identity.category !== "crypto_validation");
            const pekao = activeOffers.find((offer) => offer.identity.id.includes("pekao"));
            const nest = activeOffers.find((offer) => offer.identity.id.includes("nest"));
            document.getElementById("published-count").textContent = activeOffers.length;
            const states = activeOffers.map((offer) => freshnessFor(offer).state);
            const structureStatus = document.getElementById("structure-status");
            if (structureStatus) {
                structureStatus.textContent = states.every((state) => state === "VERIFIED")
                    ? "Dane ręcznie zweryfikowane"
                    : "Sprawdź aktualność danych";
            }
            renderPekaoDemo(pekao);
            renderNestScenarios(nest);
            renderOffers(activeOffers);
            renderConfidence(activeOffers, data);
        })
        .catch(() => renderError("Nie udało się wczytać zweryfikowanych danych. Otwórz stronę przez lokalny serwer i spróbuj ponownie."));
}());
