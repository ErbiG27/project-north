/*
 * Thin data adapter for the Decision Model UI.
 * All offer facts live in decision-offers.json; this file only loads and formats them.
 */
(function exposeNorthOffers(global) {
    "use strict";

    let dataPromise;

    function load(url) {
        if (!dataPromise) {
            dataPromise = fetch(url, { cache: "no-store" }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Nie udało się wczytać danych ofert (${response.status}).`);
                }
                return response.json();
            });
        }
        return dataPromise;
    }

    function formatMoney(money) {
        if (!money || typeof money.amount !== "number") return "Brak danych";
        const currency = money.currency || "PLN";
        const decimals = Number.isInteger(money.amount) ? 0 : 2;
        const sign = money.amount < 0 ? "−" : "";
        const [integer, fraction] = Math.abs(money.amount).toFixed(decimals).split(".");
        const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
        const amount = `${sign}${grouped}${fraction ? `,${fraction}` : ""}`;
        const currencyLabel = currency === "PLN" ? "zł" : currency;
        return `${amount}\u00a0${currencyLabel}`;
    }

    function formatValue(value) {
        if (!value) return "Wymaga danych scenariusza";
        if (typeof value.amount === "number") return formatMoney(value);
        if (value.min && value.max) return `${formatMoney(value.min)}–${formatMoney(value.max)}`;
        return "Wymaga danych scenariusza";
    }

    function formatDate(value) {
        if (!value) return "Brak daty";
        const [year, month, day] = value.split("-").map(Number);
        return new Intl.DateTimeFormat("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(new Date(Date.UTC(year, month - 1, day)));
    }

    function localIsoDate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function freshnessFor(offer, today = localIsoDate()) {
        const status = offer?.identity?.status;
        const verifiedAt = offer?.identity?.verifiedAt;
        const validTo = offer?.identity?.edition?.validTo;
        const recheckBy = offer?.evidence?.recheckBy;
        const hasEvidence = Array.isArray(offer?.evidence?.sources) && offer.evidence.sources.length > 0;

        if (["expired", "withdrawn"].includes(status) || (validTo && today > validTo)) {
            return {
                state: "EXPIRED",
                label: "EXPIRED",
                explanation: validTo
                    ? `Okno wejścia zakończyło się ${formatDate(validTo)}. Sprawdź, czy istnieje nowa edycja.`
                    : "Oferta została oznaczona jako zakończona."
            };
        }

        if (!verifiedAt || !hasEvidence || ["draft", "under_verification", "unverified"].includes(status)) {
            return {
                state: "UNVERIFIED",
                label: "UNVERIFIED",
                explanation: "Brakuje pełnej ręcznej weryfikacji bieżącej edycji lub jej oficjalnych źródeł."
            };
        }

        if (recheckBy && today > recheckBy) {
            return {
                state: "RECHECK_DUE",
                label: "RECHECK DUE",
                explanation: `Termin ręcznego sprawdzenia minął ${formatDate(recheckBy)}. Dane nie są automatycznie uznawane za aktualne.`
            };
        }

        return {
            state: "VERIFIED",
            label: "VERIFIED",
            explanation: recheckBy
                ? `Ręcznie sprawdzono ${formatDate(verifiedAt)}; kolejny recheck zaplanowano do ${formatDate(recheckBy)}.`
                : `Ręcznie sprawdzono ${formatDate(verifiedAt)}.`
        };
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    global.NorthOffers = { load, formatMoney, formatValue, formatDate, freshnessFor, escapeHtml };
}(window));
