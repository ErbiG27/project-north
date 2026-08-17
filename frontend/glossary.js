(function exposeNorthGlossary(global) {
    "use strict";

    const definitions = Object.freeze({
        advertisedMax: {
            term: "Maksimum z reklamy",
            systemTerm: "Advertised Max",
            definition: "Maksymalna wartość komunikowana przez oferenta. Nie oznacza, że każdy otrzyma pełną kwotę."
        },
        easyFloor: {
            term: "Prostszy wariant",
            systemTerm: "Easy Floor",
            definition: "Wartość dostępna przy relatywnie prostym zestawie warunków. Nadal trzeba spełnić regulamin."
        },
        yourLikelyValue: {
            term: "Ile realnie możesz dostać",
            systemTerm: "Your Likely Value",
            definition: "Wartość obliczona dla podanego przez Ciebie scenariusza."
        },
        conditionalMax: {
            term: "Maksimum po spełnieniu dodatkowych warunków",
            systemTerm: "Conditional Max",
            definition: "Dodatkowa wartość dostępna tylko po spełnieniu trudniejszych lub dodatkowych warunków."
        },
        expectedUsableValue: {
            term: "Ile faktycznie wykorzystasz",
            systemTerm: "Expected Usable Value",
            definition: "Ile nagroda jest realnie warta po uwzględnieniu jej formy i ograniczeń."
        },
        netScenarioValue: {
            term: "Ile zostaje po kosztach",
            systemTerm: "Net Scenario Value",
            definition: "Użyteczna wartość po odjęciu potwierdzonych kosztów i jawnego kosztu alternatywy."
        },
        northConfidence: {
            term: "Jak pewne są dane",
            systemTerm: "North Confidence",
            definition: "Jak mocne i kompletne są dane oraz źródła użyte do analizy."
        },
        verdict: {
            term: "Czy ta oferta ma dla Ciebie sens",
            systemTerm: "North Verdict",
            definition: "Wniosek North dla danego scenariusza: działaj, działaj pod warunkiem, odpuść albo potrzebujemy więcej danych."
        },
        failureRisk: {
            term: "Co może pójść nie tak",
            systemTerm: "Failure Risk",
            definition: "Jak łatwo stracić część lub całość nagrody przez niespełnienie warunku."
        },
        flexibility: {
            term: "Jak łatwo zrezygnować",
            systemTerm: "Flexibility",
            definition: "Jak łatwo zmienić decyzję albo wyjść z oferty bez utraty wartości lub dodatkowych kosztów."
        },
        opportunityCost: {
            term: "Z czego rezygnujesz, wybierając tę ofertę",
            systemTerm: "Opportunity Cost",
            definition: "Co tracisz, wybierając tę opcję zamiast sensownej alternatywy."
        },
        northMatch: {
            term: "Jak dobrze oferta pasuje do Ciebie",
            systemTerm: "North Match",
            definition: "Jak dobrze warunki oferty pasują do Twojej sytuacji. Nie jest procentową oceną."
        }
    });

    let openTrigger = null;
    let closeTimer = null;
    let popoverId = 0;

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function label(key, visibleText) {
        const item = definitions[key];
        const text = visibleText || item?.term || key;
        if (!item) return escapeHtml(text);
        return `<span class="glossary-term" data-glossary="${escapeHtml(key)}"><span>${escapeHtml(text)}</span></span>`;
    }

    function close({ restoreFocus = false } = {}) {
        if (!openTrigger) return;
        const popover = openTrigger.querySelector(".glossary-popover");
        openTrigger.querySelector(".glossary-trigger")?.setAttribute("aria-expanded", "false");
        popover?.removeAttribute("data-open");
        const previous = openTrigger;
        openTrigger = null;
        if (restoreFocus) previous.querySelector(".glossary-trigger")?.focus();
    }

    function positionPopover(wrapper) {
        const panel = wrapper.querySelector(".glossary-popover");
        if (!panel || global.matchMedia("(max-width: 600px)").matches) return;
        panel.style.removeProperty("--glossary-shift");
        const rect = panel.getBoundingClientRect();
        const margin = 12;
        let shift = 0;
        if (rect.right > global.innerWidth - margin) shift -= rect.right - global.innerWidth + margin;
        if (rect.left < margin) shift += margin - rect.left;
        panel.style.setProperty("--glossary-shift", `${shift}px`);
    }

    function open(wrapper) {
        if (openTrigger && openTrigger !== wrapper) close();
        clearTimeout(closeTimer);
        const trigger = wrapper.querySelector(".glossary-trigger");
        const panel = wrapper.querySelector(".glossary-popover");
        if (!trigger || !panel) return;
        openTrigger = wrapper;
        trigger.setAttribute("aria-expanded", "true");
        panel.dataset.open = "";
        positionPopover(wrapper);
    }

    function scheduleClose(wrapper) {
        clearTimeout(closeTimer);
        closeTimer = global.setTimeout(() => {
            if (openTrigger === wrapper && !wrapper.matches(":hover") && !wrapper.contains(document.activeElement)) close();
        }, 120);
    }

    function enhance(wrapper) {
        if (wrapper.dataset.glossaryReady === "true") return;
        const key = wrapper.dataset.glossary;
        const item = definitions[key];
        if (!item) return;
        const existingText = wrapper.querySelector(":scope > span")?.textContent?.trim() || wrapper.textContent.trim() || item.term;
        const panelId = `north-glossary-${key}-${popoverId++}`;
        wrapper.dataset.glossaryReady = "true";
        wrapper.classList.add("glossary-term");
        const technicalName = item.systemTerm ? ` (${item.systemTerm})` : "";
        wrapper.innerHTML = `<span class="glossary-label">${escapeHtml(existingText)}</span><button class="glossary-trigger" type="button" aria-label="Wyjaśnij: ${escapeHtml(existingText)}" aria-expanded="false" aria-controls="${panelId}" aria-describedby="${panelId}"><span aria-hidden="true">i</span></button><span class="glossary-popover" id="${panelId}" role="tooltip"><strong>${escapeHtml(item.term + technicalName)}</strong><span>${escapeHtml(item.definition)}</span></span>`;

        const trigger = wrapper.querySelector(".glossary-trigger");
        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            open(wrapper);
        });
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close({ restoreFocus: true });
            } else if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open(wrapper);
            }
        });
        trigger.addEventListener("focus", () => open(wrapper));
        wrapper.addEventListener("mouseenter", () => open(wrapper));
        wrapper.addEventListener("mouseleave", () => scheduleClose(wrapper));
        wrapper.addEventListener("focusout", () => scheduleClose(wrapper));
    }

    function init(root = document) {
        root.querySelectorAll("[data-glossary]").forEach(enhance);
    }

    document.addEventListener("click", (event) => {
        if (openTrigger && !openTrigger.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && openTrigger) close({ restoreFocus: true });
    });
    global.addEventListener("resize", () => {
        if (openTrigger) positionPopover(openTrigger);
    });
    document.addEventListener("DOMContentLoaded", () => init());

    global.NorthGlossary = { definitions, label, init, close };
}(window));
