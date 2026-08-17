(function renderNorthLanding() {
    "use strict";

    const { load, formatMoney, formatValue, formatDate, freshnessFor, escapeHtml } = window.NorthOffers;
    const term = (key, label) => window.NorthGlossary.label(key, label);

    const offerRoutes = {
        "bank-millennium-millennium-360": "offers/millennium.html",
        "nest-bank-nest-konto": "offers/nest.html",
        "bank-pekao-konto-przekorzystne": "offers/pekao.html"
    };

    const providerLogos = {
        "bank-millennium-millennium-360": "assets/logos/bank-millennium.svg",
        "nest-bank-nest-konto": "assets/logos/nest-bank.png",
        "bank-pekao-konto-przekorzystne": "assets/logos/bank-pekao.svg"
    };

    const scenarioLetters = ["A", "B", "C"];
    let listedOffers = [];
    let selectedFilter = "all";
    let resultsAnnouncementTimer = null;

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

    function verdictClass(verdict) {
        return `verdict-badge verdict-badge--${String(verdict).toLowerCase().replaceAll("_", "-")}`;
    }

    function verdictLabel(verdict) {
        return ({ "TAKE NOW": "Ma sens teraz", "TAKE IF": "Ma sens pod warunkiem", "SKIP": "Lepiej odpuścić", "NOT ENOUGH DATA": "Najpierw uzupełnij dane" })[verdict] || verdict;
    }

    function confidenceLabel(band) {
        return ({ HIGH: "wysoka", MEDIUM: "średnia", LOW: "niska" })[band] || band;
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
                    <span>${term("advertisedMax")} · kwota podana przez oferenta</span>
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
                <p class="record-meta">${freshnessBadge(offer)} Edycja sprawdzona ${formatDate(offer.identity.verifiedAt)} · pewność danych: ${escapeHtml(confidenceLabel(offer.decision.northConfidence.band))}</p>
                <a class="north-link" href="${offerRoutes[offer.identity.id]}#sources">Zobacz źródła i punkty regulaminu <span aria-hidden="true">→</span></a>
            </article>
            <aside class="snapshot-panel">
                <div class="panel-topline"><span>Najważniejsze liczby</span><span class="confidence-badge">Pewność danych: ${escapeHtml(confidenceLabel(offer.decision.northConfidence.band))}</span></div>
                <p class="snapshot-intro">Przykład: ${escapeHtml(example.label)}.</p>
                <dl class="snapshot-values">
                    <div><dt>${term("advertisedMax")}</dt><dd>${formatMoney(scenario.advertisedMax)}</dd><span>nie jest jedną gotówkową premią</span></div>
                    <div><dt>${term("easyFloor")}</dt><dd>${formatMoney(scenario.easyFloor)}</dd><span>przy założeniach opisanych w analizie</span></div>
                    <div><dt>${term("yourLikelyValue")}</dt><dd>${formatValue(scenario.likelyGrossValue)}</dd><span>część podróżna wyłączona bez danych</span></div>
                    <div><dt>${term("expectedUsableValue")}</dt><dd>${formatValue(scenario.expectedUsableValue)}</dd><span>dla części startowej</span></div>
                    <div><dt>${term("netScenarioValue")}</dt><dd>${formatValue(scenario.netScenarioValue)}</dd><span>potwierdzony koszt bezpośredni: ${formatMoney(scenario.directCost)}</span></div>
                    <div><dt>${term("conditionalMax")}</dt><dd>${formatValue(offer.value.conditionalMax.grossValue)}</dd><span>wymaga pełnego salda i wydatków podróżnych</span></div>
                </dl>
                <dl class="scenario-qualities">
                    <div><dt>Wysiłek</dt><dd>${escapeHtml(scenario.effortBurden)}</dd></div>
                    <div><dt>Czas</dt><dd>${escapeHtml(scenario.duration)}</dd></div>
                    <div><dt>Ryzyko</dt><dd>${escapeHtml(scenario.failureRisk)}</dd></div>
                    <div><dt>${term("flexibility", "Elastyczność")}</dt><dd>${escapeHtml(scenario.flexibility)}</dd></div>
                </dl>
                <p class="risk-callout"><strong>Główny punkt utraty:</strong> ${escapeHtml(mainFailure.consequence)}</p>
                <span class="${verdictClass(example.verdict)}">${escapeHtml(verdictLabel(example.verdict))}<small>${escapeHtml(example.verdict)}</small></span>
            </aside>`;
    }

    function scenarioInputs(scenario) {
        const inputs = scenario.userInputs;
        if (scenario.id === "nest-low-qualified-spend") {
            return [
                `${inputs.eligibleSpendPerMonth} zł miesięcznie w płatnościach, które bank zalicza`,
                `wymagany wpływ i zgody przez ${inputs.activeMonths} miesiące`,
                "bez wymiany EUR"
            ];
        }
        if (scenario.id === "nest-no-salary-transfer") {
            return [
                `${inputs.eligibleSpendPerMonth} zł miesięcznie w płatnościach, które bank zalicza`,
                "bez wpływu, który bank zalicza",
                "bez wymiany EUR"
            ];
        }
        return [
            `${inputs.eligibleSpendPerMonth} zł miesięcznie w płatnościach, które bank zalicza`,
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
                    <div class="persona-card__head"><span>Przykład ${scenarioLetters[index]}</span><span class="${verdictClass(example.verdict)}">${escapeHtml(verdictLabel(example.verdict))}<small>${escapeHtml(example.verdict)}</small></span></div>
                    <h3>${escapeHtml(example.label)}</h3>
                    <ul class="assumption-list">${inputs.map((input) => `<li>${escapeHtml(input)}</li>`).join("")}</ul>
                    <div class="scenario-result">
                        <div><span>${term("yourLikelyValue")}</span><strong>${formatValue(example.grossValue)}</strong></div>
                        <div><span>${term("expectedUsableValue")}</span><strong>${formatValue(example.usableValue)}</strong></div>
                    </div>
                    ${example.calculation ? `<p class="calculation">${escapeHtml(example.calculation)}</p>` : ""}
                    <dl class="compact-qualities">
                        <div><dt>Wysiłek</dt><dd>${escapeHtml(value.effortBurden)}</dd></div>
                        <div><dt>Czas</dt><dd>${escapeHtml(value.duration)}</dd></div>
                        <div><dt>Ryzyko</dt><dd>${escapeHtml(value.failureRisk)}</dd></div>
                        <div><dt>${term("flexibility", "Elastyczność")}</dt><dd>${escapeHtml(value.flexibility)}</dd></div>
                    </dl>
                    <p class="verdict-reason"><strong>Dlaczego:</strong> ${escapeHtml(example.verdictReason)}</p>
                    <p class="do-nothing"><strong>Jeśli nic nie zrobisz:</strong> 0 zł nagrody, 0 zł nowego kosztu, minimalny wysiłek.</p>
                    <p class="scenario-confidence">Pewność danych: <strong>${escapeHtml(confidenceLabel(example.confidenceBand))}</strong> <small>(${escapeHtml(example.confidenceBand)})</small></p>
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
                        ${providerMark(offer)}
                        <div><p>${escapeHtml(shortProvider(offer))}</p><span class="offer-status">${escapeHtml(freshness.label)} · sprawdzono ${formatDate(offer.identity.verifiedAt)}</span></div>
                        <span class="confidence-badge">Pewność: ${escapeHtml(confidenceLabel(offer.decision.northConfidence.band))}</span>
                    </div>
                    <p class="problem-label">${escapeHtml(offer.listing.problemLabel)}</p>
                    <h3>${escapeHtml(offer.identity.title)}</h3>
                    <p class="offer-summary">${escapeHtml(offer.listing.summary)}</p>
                    <dl class="offer-card-values">
                        <div><dt>${term("advertisedMax")}</dt><dd>${escapeHtml(offer.value.advertisedMax.displayLabel)}</dd></div>
                        <div><dt>${term("yourLikelyValue", "Przykładowa realna kwota")}</dt><dd>${formatValue(firstValue.likelyGrossValue)}</dd></div>
                    </dl>
                    <div class="offer-card-verdict"><span>Przed podaniem Twoich danych</span><strong>${escapeHtml(verdictLabel(offer.decision.verdict.state))}</strong><small>${escapeHtml(offer.decision.verdict.state)}</small></div>
                    <a class="north-button north-button--card" href="${offerRoutes[offer.identity.id]}#match">Sprawdź dla siebie <span aria-hidden="true">→</span></a>
                </article>`;
        }).join("");
        initBankMarkFallbacks(target);
        window.NorthGlossary.init(target);
    }

    function normalized(value) {
        return String(value || "").toLocaleLowerCase("pl-PL").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function searchableOfferText(offer) {
        return normalized([
            shortProvider(offer),
            offer.identity.title,
            offer.listing.problemLabel,
            offer.listing.summary,
            ...(offer.value.rewardComponents || []).flatMap((component) => [component.label, component.form, component.calculation])
        ].join(" "));
    }

    function hasFilter(offer, filter) {
        if (filter === "all") return true;
        const components = offer.value.rewardComponents || [];
        if (filter === "cash") return components.some((component) => component.form === "cash");
        if (filter === "cashback") return components.some((component) => component.form === "cashback");
        if (filter === "travel") return normalized(components.map((component) => [component.label, component.calculation, ...(component.usability?.restrictions || [])].join(" ")).join(" ")).includes("podroz");
        return true;
    }

    function resultCountCopy(count) {
        if (count === 1) return "1 pasująca analiza";
        if ([2, 3, 4].includes(count)) return `${count} pasujące analizy`;
        return `${count} pasujących analiz`;
    }

    function updateOfferResults({ announceImmediately = false } = {}) {
        const search = document.getElementById("offer-search");
        const query = normalized(search.value.trim());
        const filtered = listedOffers.filter((offer) => hasFilter(offer, selectedFilter) && (!query || searchableOfferText(offer).includes(query)));
        const grid = document.getElementById("decision-offers");
        const empty = document.getElementById("offer-empty-state");
        const summary = document.getElementById("offer-results-summary");

        renderOffers(filtered);
        grid.hidden = filtered.length === 0;
        empty.hidden = filtered.length !== 0;

        globalThis.clearTimeout(resultsAnnouncementTimer);
        const announce = () => { summary.textContent = resultCountCopy(filtered.length); };
        if (announceImmediately) announce();
        else resultsAnnouncementTimer = globalThis.setTimeout(announce, 350);
    }

    function setupOfferFilters(offers) {
        listedOffers = offers;
        const form = document.getElementById("offer-filters");
        const search = document.getElementById("offer-search");
        const buttons = [...form.querySelectorAll("[data-offer-filter]")];
        const reset = document.getElementById("offer-filters-reset");

        form.addEventListener("submit", (event) => event.preventDefault());
        search.addEventListener("input", () => updateOfferResults());
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                selectedFilter = button.dataset.offerFilter;
                buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
                updateOfferResults({ announceImmediately: true });
            });
        });
        reset.addEventListener("click", () => {
            search.value = "";
            selectedFilter = "all";
            buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.offerFilter === "all")));
            updateOfferResults({ announceImmediately: true });
            search.focus();
        });

        updateOfferResults({ announceImmediately: true });
    }

    function renderConfidence(offers, data) {
        const target = document.getElementById("confidence-summary");
        target.classList.remove("data-loading");
        target.innerHTML = offers.map((offer) => `<div><dt>${escapeHtml(shortProvider(offer).replace("Bank ", ""))}</dt><dd>${escapeHtml(confidenceLabel(offer.decision.northConfidence.band))} <small>(${escapeHtml(offer.decision.northConfidence.band)})</small></dd></div>`).join("");
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
            setupOfferFilters(activeOffers);
            renderConfidence(activeOffers, data);
            window.NorthGlossary.init(document);
        })
        .catch(() => renderError("Nie udało się wczytać zweryfikowanych danych. Otwórz stronę przez lokalny serwer i spróbuj ponownie."));
}());
