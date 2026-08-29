const DATA_URL = new URL("../data/decision-offers.json", import.meta.url);
export const PROFILE_STORAGE_KEY = "north.offerExperience.profile.v1";

const OFFER_IDS = Object.freeze([
    "bank-millennium-millennium-360",
    "nest-bank-nest-konto",
    "bank-pekao-konto-przekorzystne"
]);

const presentation = Object.freeze({
    "bank-millennium-millennium-360": {
        product: "Millennium 360°",
        provider: "Bank Millennium",
        logo: "../assets/logos/Bank_Millenium.svg",
        visual: {
            type: "north-fallback",
            src: null,
            alt: "",
            focalPosition: "50% 50%",
            providerAccent: "#d4145a",
            treatment: "orbit"
        }
    },
    "nest-bank-nest-konto": {
        product: "Nest Konto",
        provider: "Nest Bank",
        logo: "../assets/logos/nest1.svg",
        visual: {
            type: "north-fallback",
            src: null,
            alt: "",
            focalPosition: "50% 50%",
            providerAccent: "#e8782f",
            treatment: "grid"
        }
    },
    "bank-pekao-konto-przekorzystne": {
        product: "Konto Przekorzystne",
        provider: "Bank Pekao",
        logo: "../assets/logos/Bank_Pekao_SA_Logo_(2017).svg",
        visual: {
            type: "north-fallback",
            src: null,
            alt: "",
            focalPosition: "50% 50%",
            providerAccent: "#c91c22",
            treatment: "route"
        }
    }
});

const profileLabels = Object.freeze({
    ageBand: {
        "18_25": "18–25 lat",
        "26_34": "26–34 lata",
        "35_54": "35–54 lata",
        "55_plus": "55+ lat"
    },
    ownership: {
        individual: "konto indywidualne",
        joint: "konto wspólne"
    },
    goal: {
        everyday: "codzienne konto",
        reward: "gotówka lub cashback",
        simplicity: "minimum obowiązków",
        travel: "korzyści podróżne"
    },
    effort: {
        low: "mały wysiłek",
        medium: "średni wysiłek",
        high: "większy wysiłek"
    }
});

const ageRepresentatives = Object.freeze({
    "18_25": 22,
    "26_34": 30,
    "35_54": 45,
    "55_plus": 60
});

const statusLabels = Object.freeze({
    fit: "Wstępnie pasuje",
    conditional: "Wstępnie pasuje, ale…",
    poor: "Raczej nie dla Ciebie",
    missing: "Potrzebujemy jeszcze jednej informacji"
});

const categoryLabels = Object.freeze({
    bank_account: "KONTO OSOBISTE"
});

const categories = Object.freeze([
    {
        id: "accounts",
        label: "Konta",
        description: "Konta osobiste i promocje bankowe bez ukrywania warunków i haczyków.",
        status: "active",
        route: "north-offer-experience.html#category-accounts",
        active: true
    },
    { id: "savings", label: "Oszczędzanie", status: "planned", route: null, active: false },
    { id: "investing", label: "Inwestowanie", status: "planned", route: null, active: false },
    { id: "fintech", label: "Fintech", status: "planned", route: null, active: false },
    { id: "crypto", label: "Krypto", status: "planned", route: null, active: false }
]);

function categoryNavigationHtml() {
    return categories.map((category) => {
        if (category.active && category.route) {
            return `<li><a class="noe-category-link noe-category-link--active" href="${escapeHtml(category.route)}" aria-current="page"><span>${escapeHtml(category.label)}</span><small>Aktywne</small></a></li>`;
        }
        return `<li><span class="noe-category-link noe-category-link--planned" aria-label="${escapeHtml(category.label)} — przyszła kategoria"><span>${escapeHtml(category.label)}</span></span></li>`;
    }).join("");
}

function categoryMenuHtml() {
    return `<dialog id="category-menu" class="noe-category-dialog" aria-labelledby="category-menu-title">
        <div class="noe-category-dialog__header">
            <div><p class="noe-eyebrow">Kategorie North</p><h2 id="category-menu-title">Wybierz obszar</h2></div>
            <button class="noe-dialog-close" type="button" data-category-menu-close aria-label="Zamknij menu kategorii">×</button>
        </div>
        <nav aria-label="Mobilne menu kategorii"><ul>${categoryNavigationHtml()}</ul></nav>
        <p class="noe-category-dialog__note">Konta są aktywnym prototypem. Pozostałe obszary pokazują przyszłą architekturę North, ale nie prowadzą do pustych katalogów.</p>
    </dialog>`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function unique(items) {
    return [...new Set(items.filter(Boolean))];
}

function formatMoney(amount, currency = "PLN") {
    if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "—";
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency,
        minimumFractionDigits: Number.isInteger(Number(amount)) ? 0 : 2,
        maximumFractionDigits: 2
    }).format(Number(amount));
}

function formatDisplayAmount(amount, currency = "PLN") {
    const value = Number(amount);
    if (!Number.isFinite(value)) return "—";
    const [whole, fraction] = value.toFixed(Number.isInteger(value) ? 0 : 2).split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const currencyLabel = currency === "PLN" ? "zł" : currency;
    return `${grouped}${fraction ? `,${fraction}` : ""} ${currencyLabel}`;
}

function profileDialogHtml() {
    return `<dialog id="profile-dialog" class="noe-profile-dialog" aria-labelledby="profile-dialog-title">
        <form id="profile-form" method="dialog" novalidate>
            <div class="noe-dialog-header">
                <div>
                    <p class="noe-eyebrow">Profil główny · tylko lokalnie</p>
                    <h2 id="profile-dialog-title">Dopasuj oferty do mnie</h2>
                    <p>Odpowiedz raz. Te same informacje zadziałają w katalogu i na stronach ofert.</p>
                </div>
                <button class="noe-dialog-close" type="button" data-profile-close aria-label="Zamknij profil">×</button>
            </div>

            <div class="noe-progress" aria-label="Postęp profilu">
                <span class="is-active" data-progress-step="0">1</span>
                <span data-progress-step="1">2</span>
                <span data-progress-step="2">3</span>
            </div>

            <section class="noe-profile-step" data-profile-step="0" aria-labelledby="profile-step-1-title">
                <p class="noe-step-label">Krok 1 z 3</p>
                <h3 id="profile-step-1-title">Podstawowa sytuacja</h3>
                <fieldset class="noe-choice-field">
                    <legend>W jakim jesteś przedziale wieku?</legend>
                    <p>Wiek zmienia część progów i twardych warunków ofert.</p>
                    <div class="noe-choice-grid noe-choice-grid--four">
                        <label><input type="radio" name="ageBand" value="18_25" required><span>18–25</span></label>
                        <label><input type="radio" name="ageBand" value="26_34" required><span>26–34</span></label>
                        <label><input type="radio" name="ageBand" value="35_54" required><span>35–54</span></label>
                        <label><input type="radio" name="ageBand" value="55_plus" required><span>55+</span></label>
                    </div>
                </fieldset>
                <fieldset class="noe-choice-field">
                    <legend>Jak chcesz prowadzić konto?</legend>
                    <p>Konto wspólne może mieć inne zasady produktu i promocji.</p>
                    <div class="noe-choice-grid">
                        <label><input type="radio" name="ownership" value="individual" required><span>Indywidualnie</span></label>
                        <label><input type="radio" name="ownership" value="joint" required><span>Wspólnie</span></label>
                    </div>
                </fieldset>
            </section>

            <section class="noe-profile-step" data-profile-step="1" aria-labelledby="profile-step-2-title" hidden>
                <p class="noe-step-label">Krok 2 z 3</p>
                <h3 id="profile-step-2-title">Twój zwykły miesiąc</h3>
                <div class="noe-number-grid">
                    <label class="noe-number-field" for="profile-monthly-inflows">
                        <span>Miesięczne wpływy, które możesz kierować na konto</span>
                        <small>Podaj naturalną kwotę, nie kwotę tworzoną tylko dla promocji.</small>
                        <span class="noe-number-control"><input id="profile-monthly-inflows" name="monthlyInflows" type="number" min="0" max="1000000" step="100" inputmode="numeric" required><span>zł</span></span>
                    </label>
                    <label class="noe-number-field" for="profile-card-spend">
                        <span>Miesięczne wydatki zwykłą kartą</span>
                        <small>Bez przelewów, wypłat gotówki i wydatków, których nie zrobisz naturalnie.</small>
                        <span class="noe-number-control"><input id="profile-card-spend" name="cardSpend" type="number" min="0" max="1000000" step="100" inputmode="numeric" required><span>zł</span></span>
                    </label>
                </div>
            </section>

            <section class="noe-profile-step" data-profile-step="2" aria-labelledby="profile-step-3-title" hidden>
                <p class="noe-step-label">Krok 3 z 3</p>
                <h3 id="profile-step-3-title">Cel i akceptowany wysiłek</h3>
                <fieldset class="noe-choice-field">
                    <legend>Co jest dla Ciebie najważniejsze?</legend>
                    <div class="noe-choice-grid">
                        <label><input type="radio" name="goal" value="everyday" required><span>Codzienne konto</span></label>
                        <label><input type="radio" name="goal" value="reward" required><span>Gotówka lub cashback</span></label>
                        <label><input type="radio" name="goal" value="simplicity" required><span>Minimum obowiązków</span></label>
                        <label><input type="radio" name="goal" value="travel" required><span>Korzyści podróżne</span></label>
                    </div>
                </fieldset>
                <fieldset class="noe-choice-field">
                    <legend>Ile powtarzalnych warunków akceptujesz?</legend>
                    <div class="noe-choice-grid noe-choice-grid--three">
                        <label><input type="radio" name="effort" value="low" required><span>Mało<br><small>najwyżej miesiąc</small></span></label>
                        <label><input type="radio" name="effort" value="medium" required><span>Średnio<br><small>do około 6 miesięcy</small></span></label>
                        <label><input type="radio" name="effort" value="high" required><span>Dużo<br><small>dłuższy rytm jest OK</small></span></label>
                    </div>
                </fieldset>
            </section>

            <p id="profile-form-error" class="noe-form-error" role="alert" hidden>Uzupełnij odpowiedzi w tym kroku. North nie zgaduje brakujących danych.</p>
            <div class="noe-dialog-actions">
                <button class="noe-button noe-button--quiet" type="button" data-profile-back hidden>Wstecz</button>
                <button class="noe-button noe-button--primary" type="button" data-profile-next>Dalej</button>
                <button class="noe-button noe-button--primary" type="submit" data-profile-save hidden>Zapisz profil</button>
            </div>
            <p class="noe-storage-note">Twoje odpowiedzi zostają tylko w tej przeglądarce. Możesz je zmienić lub wyczyścić w każdej chwili.</p>
        </form>
    </dialog>`;
}

export function readProfile(storage = window.localStorage) {
    try {
        const raw = storage.getItem(PROFILE_STORAGE_KEY);
        if (!raw) return null;
        const profile = JSON.parse(raw);
        const required = ["ageBand", "ownership", "monthlyInflows", "cardSpend", "goal", "effort"];
        return profile?.version === 1 && required.every((field) => profile[field] !== undefined && profile[field] !== "")
            ? profile
            : null;
    } catch {
        return null;
    }
}

export function writeProfile(profile, storage = window.localStorage) {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...profile, version: 1 }));
}

export function clearProfile(storage = window.localStorage) {
    storage.removeItem(PROFILE_STORAGE_KEY);
}

function representativeAge(profile) {
    return ageRepresentatives[profile.ageBand] ?? null;
}

function incomeThresholdFor(offer, profile) {
    const requiredIncome = offer.eligibility?.requiredIncome;
    if (!requiredIncome?.required) return null;
    const ageBands = asArray(requiredIncome.ageBands);
    if (ageBands.length) {
        const band = profile.ageBand === "18_25"
            ? ageBands.find((item) => String(item.age).includes("18-25"))
            : ageBands.find((item) => String(item.age).includes("26"));
        return band?.amount?.amount ?? null;
    }
    return requiredIncome.amount?.amount ?? null;
}

function spendThresholdFor(offer) {
    const values = asArray(offer.eligibility?.requiredSpend)
        .map((item) => item.amount?.amount)
        .filter((value) => Number.isFinite(Number(value)))
        .map(Number);
    return values.length ? Math.max(...values) : null;
}

function activeMonthsFor(offer) {
    return Number(offer.execution?.activeMonths?.max ?? 0);
}

function goalSignal(offer, profile) {
    const forms = asArray(offer.value?.rewardForms);
    const haystack = JSON.stringify({
        listing: offer.listing,
        linked: offer.linkedPromotions,
        components: offer.value?.rewardComponents
    }).toLowerCase();

    if (profile.goal === "reward" && forms.some((form) => ["cash", "cashback"].includes(form))) {
        return "Forma głównej korzyści odpowiada Twojemu celowi: gotówka lub cashback.";
    }
    if (profile.goal === "simplicity" && activeMonthsFor(offer) <= 1) {
        return "Krótki rytm warunków odpowiada Twojemu celowi minimum obowiązków.";
    }
    if (profile.goal === "travel" && /podróż|travel/.test(haystack)) {
        return "Oferta zawiera element podróżny, ale jego użyteczność trzeba ocenić osobno od gotówki.";
    }
    if (profile.goal === "everyday" && offer.identity?.category === "bank_account") {
        return "To produkt do codziennego użycia; promocja jest tylko dodatkową warstwą.";
    }
    return null;
}

export function evaluateOfferContext(offer, profile) {
    if (!profile) return null;

    const blockers = [];
    const positives = [];
    const unresolved = [];
    const age = representativeAge(profile);
    const minAge = offer.eligibility?.age?.min;
    const maxAge = offer.eligibility?.age?.max;

    const hasMinAge = minAge !== null && minAge !== undefined && minAge !== "" && Number.isFinite(Number(minAge));
    const hasMaxAge = maxAge !== null && maxAge !== undefined && maxAge !== "" && Number.isFinite(Number(maxAge));
    if ((hasMinAge && age < Number(minAge)) || (hasMaxAge && age > Number(maxAge))) {
        blockers.push("Twój przedział wieku nie mieści się w podstawowym warunku produktu.");
    }

    const incomeThreshold = incomeThresholdFor(offer, profile);
    if (incomeThreshold !== null) {
        if (Number(profile.monthlyInflows) >= incomeThreshold) {
            positives.push(`Naturalne wpływy osiągają próg ${formatMoney(incomeThreshold)}.`);
        } else {
            blockers.push(`Naturalne wpływy są niższe niż próg ${formatMoney(incomeThreshold)}.`);
        }
    }

    const spendThreshold = spendThresholdFor(offer);
    if (spendThreshold !== null) {
        if (Number(profile.cardSpend) >= spendThreshold) {
            positives.push(`Zwykłe wydatki kartą osiągają próg ${formatMoney(spendThreshold)}.`);
        } else {
            blockers.push(`Zwykłe wydatki kartą są niższe niż próg ${formatMoney(spendThreshold)}.`);
        }
    }

    const effortLimit = profile.effort === "low" ? 1 : profile.effort === "medium" ? 6 : Number.POSITIVE_INFINITY;
    const activeMonths = activeMonthsFor(offer);
    if (activeMonths > effortLimit) {
        blockers.push(`Warunki trwają do ${activeMonths} mies., dłużej niż akceptowany przez Ciebie wysiłek.`);
    } else if (activeMonths > 0) {
        positives.push(`Horyzont do ${activeMonths} mies. mieści się w Twojej tolerancji wysiłku.`);
    }

    const goal = goalSignal(offer, profile);
    if (goal) positives.push(goal);

    if (profile.ownership === "joint") {
        unresolved.push("Trzeba potwierdzić, czy produkt i ta edycja promocji obsługują konto wspólne.");
    }
    if (offer.eligibility?.newCustomer?.required) {
        unresolved.push("Trzeba potwierdzić status nowego klienta i karencję w tym banku.");
    }

    let status = "fit";
    if (blockers.length >= 2 || blockers.some((item) => item.includes("wieku"))) status = "poor";
    else if (profile.ownership === "joint") status = "missing";
    else if (blockers.length === 1 || unresolved.length > 0) status = "conditional";

    const summary = status === "poor"
        ? blockers[0]
        : status === "missing"
            ? unresolved[0]
            : status === "conditional"
                ? blockers[0] || unresolved[0] || positives[0]
                : positives[0] || "Profil nie ujawnia oczywistego niedopasowania.";

    return {
        status,
        label: statusLabels[status],
        summary,
        positives: unique(positives),
        blockers: unique(blockers),
        unresolved: unique(unresolved)
    };
}

function displayName(offer) {
    return presentation[offer.identity.id] || {
        product: offer.identity.title,
        provider: offer.identity.provider,
        logo: null,
        visual: {
            type: "north-fallback",
            src: null,
            alt: "",
            focalPosition: "50% 50%",
            providerAccent: "#00b894",
            treatment: "grid"
        }
    };
}

function providerAccent(names) {
    const accent = names.visual?.providerAccent;
    return /^#[0-9a-f]{6}$/i.test(accent || "") ? accent : "#00b894";
}

function providerLogoHtml(names, variant = "card") {
    if (!names.logo) {
        return `<span class="noe-provider-logo noe-provider-logo--${escapeHtml(variant)} noe-provider-logo--placeholder" aria-hidden="true">N</span>`;
    }
    return `<span class="noe-provider-logo noe-provider-logo--${escapeHtml(variant)}"><img src="${escapeHtml(names.logo)}" alt=""></span>`;
}

function visualSlotHtml(names) {
    const visual = names.visual || {};
    const type = visual.type || "north-fallback";
    const treatment = visual.treatment || "grid";
    const style = `--noe-provider-accent: ${providerAccent(names)}; --noe-focal-position: ${escapeHtml(visual.focalPosition || "50% 50%")} `;
    const image = visual.src
        ? `<img class="noe-visual-slot__image" src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt || "")}">`
        : `<div class="noe-visual-slot__art" aria-hidden="true"><span></span><span></span><span></span></div>`;
    const accessibility = visual.src ? "" : ' aria-hidden="true"';
    return `<aside class="noe-visual-slot noe-visual-slot--${escapeHtml(type)} noe-visual-slot--${escapeHtml(treatment)}" style="${style}"${accessibility}>
        ${image}
        <div class="noe-visual-slot__signature">
            ${providerLogoHtml(names, "visual")}
            <span><small>Product Identity</small><strong>${escapeHtml(names.product)}</strong></span>
        </div>
    </aside>`;
}

function valuePresentationHtml(offer, mode = "card") {
    const advertised = offer.value?.advertisedMax || {};
    const cash = advertised.cashValueTotal?.amount;
    const nonCash = advertised.nonCashValueTotal?.amount;
    const total = advertised.faceValueTotal?.amount;
    const hasMixedValue = Number(cash) > 0 && Number(nonCash) > 0;

    if (!hasMixedValue) {
        return `<strong>${escapeHtml(advertised.displayLabel || offer.listing?.cardValue || "Sprawdź analizę")}</strong>`;
    }

    const travelComponent = asArray(offer.value?.rewardComponents).some((component) => /podróż|travel/i.test(`${component.label || ""} ${component.calculation || ""}`));
    const conditionalKind = travelComponent ? "warunkowej wartości podróżnej" : "warunkowej wartości niegotówkowej";
    const totalNote = Number(total) > 0
        ? `Maksimum łączne: do ${formatDisplayAmount(total)} — nie jest jedną premią gotówkową.`
        : "To dwie różne formy wartości, nie jedna premia gotówkowa.";

    return `<div class="noe-value-breakdown noe-value-breakdown--${escapeHtml(mode)}">
        <strong>${escapeHtml(formatDisplayAmount(cash))} gotówki</strong>
        <span class="noe-value-breakdown__plus" aria-hidden="true">+</span>
        <strong>do ${escapeHtml(formatDisplayAmount(nonCash))} ${escapeHtml(conditionalKind)}</strong>
        ${mode === "detail" ? `<p>${escapeHtml(totalNote)}</p>` : ""}
    </div>`;
}

function valueExplanation(offer) {
    const advertised = offer.value?.advertisedMax || {};
    const hasMixedValue = Number(advertised.cashValueTotal?.amount) > 0 && Number(advertised.nonCashValueTotal?.amount) > 0;
    if (hasMixedValue) {
        return asArray(offer.value?.usabilityConstraints)[1]
            || advertised.valuationBasis
            || advertised.caveat
            || "Wartość zależy od warunków wykorzystania.";
    }
    return advertised.caveat || advertised.valuationBasis || "Wartość zależy od warunków.";
}

function conditionItems(offer) {
    const items = [];
    const income = offer.eligibility?.requiredIncome;
    if (income?.required) {
        const bands = asArray(income.ageBands);
        if (bands.length) {
            items.push(`Wpływ: ${bands.map((band) => `${formatMoney(band.amount?.amount)} (${band.age})`).join(" / ")}`);
        } else if (income.amount?.amount !== undefined && income.amount?.amount !== null) {
            items.push(`Wpływ: ${formatMoney(income.amount.amount)} ${income.cadence || ""}`.trim());
        } else {
            items.push(`Regularny wpływ: ${income.cadence || "w okresie warunków"}`);
        }
    }
    const spend = spendThresholdFor(offer);
    if (spend !== null) items.push(`Płatności kartą: co najmniej ${formatMoney(spend)} miesięcznie`);
    if (offer.eligibility?.newCustomer?.required) items.push("Wymagany status nowego klienta");
    const activeMonths = activeMonthsFor(offer);
    if (activeMonths > 0) items.push(`Powtarzalne warunki: do ${activeMonths} mies.`);
    else if (offer.execution?.cadence?.summary) items.push(offer.execution.cadence.summary);
    return unique(items).slice(0, 3);
}

function biggestCatch(offer) {
    const priority = { high: 3, medium: 2, low: 1 };
    const failures = [...asArray(offer.execution?.failurePoints)]
        .sort((left, right) => (priority[right.severity] || 0) - (priority[left.severity] || 0));
    const first = failures[0];
    if (!first) return offer.value?.advertisedMax?.caveat || offer.listing?.cardEffort || "Warunki trzeba potwierdzić w źródłach.";
    return `${first.label}: ${first.consequence}`.replaceAll("North Value", "wartości dla Ciebie");
}

function contextCardHtml(context) {
    if (!context) return "";
    return `<div class="noe-personal-context noe-personal-context--${escapeHtml(context.status)}">
        <span>Twój kontekst</span>
        <strong>${escapeHtml(context.label)}</strong>
        <p>${escapeHtml(context.summary)}</p>
    </div>`;
}

function offerCardHtml(offer, profile) {
    const names = displayName(offer);
    const context = evaluateOfferContext(offer, profile);
    const detailsUrl = `north-offer-detail.html?id=${encodeURIComponent(offer.identity.id)}&v=offer-identity-v1`;
    return `<article class="noe-offer-card" data-offer-id="${escapeHtml(offer.identity.id)}" style="--noe-provider-accent: ${providerAccent(names)}">
        <header class="noe-offer-card__header">
            ${providerLogoHtml(names)}
            <div><p>${escapeHtml(names.provider)}</p><h3>${escapeHtml(names.product)}</h3></div>
        </header>
        <div class="noe-offer-card__value">
            <span>Główna wartość</span>
            ${valuePresentationHtml(offer)}
        </div>
        <section class="noe-card-conditions" aria-label="Najważniejsze warunki">
            <h4>Najważniejsze warunki</h4>
            <ul>${conditionItems(offer).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <div class="noe-catch"><span>Największy haczyk</span><p>${escapeHtml(biggestCatch(offer))}</p></div>
        ${contextCardHtml(context)}
        <a class="noe-button noe-button--secondary noe-card-cta" href="${escapeHtml(detailsUrl)}">Zobacz szczegóły <span aria-hidden="true">→</span></a>
    </article>`;
}

function profileSummaryHtml(profile) {
    if (!profile) {
        return `<div>
            <p class="noe-eyebrow">Twój kontekst</p>
            <h3 id="profile-strip-title">Katalog działa bez profilu</h3>
            <p>Wypełnij profil, jeśli chcesz zobaczyć kontekst dopasowania na wszystkich kartach.</p>
        </div><button class="noe-button noe-button--secondary" type="button" data-profile-open>Dopasuj oferty</button>`;
    }
    return `<div>
        <p class="noe-eyebrow">Twój kontekst jest aktywny</p>
        <h3 id="profile-strip-title">${escapeHtml(profileLabels.ageBand[profile.ageBand])} · ${escapeHtml(profileLabels.ownership[profile.ownership])}</h3>
        <p>${formatMoney(profile.monthlyInflows)} wpływów · ${formatMoney(profile.cardSpend)} kartą · ${escapeHtml(profileLabels.goal[profile.goal])} · ${escapeHtml(profileLabels.effort[profile.effort])}</p>
    </div><div class="noe-profile-actions"><button class="noe-button noe-button--secondary" type="button" data-profile-open>Zmień odpowiedzi</button><button class="noe-button noe-button--quiet" type="button" data-profile-clear>Wyczyść profil</button></div>`;
}

function renderHeaderProfile(profile) {
    const active = Boolean(profile);
    document.querySelectorAll("[data-header-profile]").forEach((button) => {
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-label", active
            ? "Twoje dopasowanie jest aktywne — zmień odpowiedzi"
            : "Dopasuj oferty do swojej sytuacji");
        const label = button.querySelector("[data-header-profile-label]");
        if (label) label.textContent = active ? "Twoje dopasowanie" : "Dopasuj oferty";
    });

    document.querySelectorAll("[data-category-profile-action]").forEach((button) => {
        button.textContent = active ? "Edytuj dopasowanie" : "Dopasowane do mnie";
        button.classList.toggle("is-active", active);
    });
}

function mountCategoryNavigation() {
    document.querySelectorAll("[data-category-nav]").forEach((list) => {
        list.innerHTML = categoryNavigationHtml();
    });
}

function mountCategoryMenuController() {
    const mount = document.querySelector("#category-menu-mount");
    if (!mount) return;
    mount.innerHTML = categoryMenuHtml();
    const dialog = mount.querySelector("#category-menu");
    const closeButton = mount.querySelector("[data-category-menu-close]");
    let lastTrigger = null;

    const close = () => {
        if (dialog.open) dialog.close();
    };

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-category-menu-open]");
        if (!trigger) return;
        lastTrigger = trigger;
        trigger.setAttribute("aria-expanded", "true");
        dialog.showModal();
        window.setTimeout(() => dialog.querySelector("a[aria-current='page']")?.focus(), 0);
    });

    closeButton.addEventListener("click", close);
    dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            close();
        }
    });
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) close();
    });
    dialog.addEventListener("close", () => {
        lastTrigger?.setAttribute("aria-expanded", "false");
        lastTrigger?.focus();
    });
}

function fillProfileForm(form, profile) {
    form.reset();
    if (!profile) return;
    Object.entries(profile).forEach(([key, value]) => {
        if (key === "version") return;
        const field = form.elements.namedItem(key);
        if (!field) return;
        if (typeof RadioNodeList !== "undefined" && field instanceof RadioNodeList) field.value = String(value);
        else field.value = String(value);
    });
}

function valuesFromProfileForm(form) {
    const data = new FormData(form);
    return {
        ageBand: data.get("ageBand"),
        ownership: data.get("ownership"),
        monthlyInflows: Number(data.get("monthlyInflows")),
        cardSpend: Number(data.get("cardSpend")),
        goal: data.get("goal"),
        effort: data.get("effort")
    };
}

function validStep(step) {
    const controls = [...step.querySelectorAll("input[required]")];
    const radioNames = unique(controls.filter((input) => input.type === "radio").map((input) => input.name));
    const radiosValid = radioNames.every((name) => step.querySelector(`input[name="${CSS.escape(name)}"]:checked`));
    const othersValid = controls.filter((input) => input.type !== "radio").every((input) => input.checkValidity());
    return radiosValid && othersValid;
}

function mountProfileController(onChange) {
    const mount = document.querySelector("#profile-mount");
    if (!mount) return;
    mount.innerHTML = profileDialogHtml();
    const dialog = mount.querySelector("#profile-dialog");
    const form = mount.querySelector("#profile-form");
    const steps = [...mount.querySelectorAll("[data-profile-step]")];
    const progress = [...mount.querySelectorAll("[data-progress-step]")];
    const back = mount.querySelector("[data-profile-back]");
    const next = mount.querySelector("[data-profile-next]");
    const save = mount.querySelector("[data-profile-save]");
    const error = mount.querySelector("#profile-form-error");
    let currentStep = 0;
    let lastTrigger = null;

    const showStep = (index) => {
        currentStep = index;
        steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index; });
        progress.forEach((item, stepIndex) => item.classList.toggle("is-active", stepIndex <= index));
        back.hidden = index === 0;
        next.hidden = index === steps.length - 1;
        save.hidden = index !== steps.length - 1;
        error.hidden = true;
        steps[index].querySelector("input")?.focus();
    };

    const open = (trigger) => {
        lastTrigger = trigger;
        fillProfileForm(form, readProfile());
        currentStep = 0;
        steps.forEach((step, index) => { step.hidden = index !== 0; });
        progress.forEach((item, index) => item.classList.toggle("is-active", index === 0));
        back.hidden = true;
        next.hidden = false;
        save.hidden = true;
        error.hidden = true;
        dialog.showModal();
        window.setTimeout(() => steps[0].querySelector("input")?.focus(), 0);
    };

    document.addEventListener("click", (event) => {
        const openTrigger = event.target.closest("[data-profile-open]");
        if (openTrigger) open(openTrigger);
        if (event.target.closest("[data-profile-clear]")) {
            clearProfile();
            onChange(null, "Profil został wyczyszczony z tej przeglądarki.");
        }
    });

    mount.querySelector("[data-profile-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => lastTrigger?.focus());
    dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            dialog.close();
        }
    });
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    next.addEventListener("click", () => {
        if (!validStep(steps[currentStep])) {
            error.hidden = false;
            steps[currentStep].querySelector("input:invalid, input:not(:checked)")?.focus();
            return;
        }
        showStep(Math.min(currentStep + 1, steps.length - 1));
    });
    back.addEventListener("click", () => showStep(Math.max(currentStep - 1, 0)));
    form.addEventListener("input", () => { if (validStep(steps[currentStep])) error.hidden = true; });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!steps.every(validStep)) {
            const invalidIndex = steps.findIndex((step) => !validStep(step));
            showStep(invalidIndex < 0 ? 0 : invalidIndex);
            error.hidden = false;
            return;
        }
        const profile = valuesFromProfileForm(form);
        try {
            writeProfile(profile);
            dialog.close();
            onChange(profile, "Profil został zapisany tylko w tej przeglądarce.");
        } catch {
            error.textContent = "Przeglądarka nie pozwoliła zapisać profilu. Katalog nadal działa bez niego.";
            error.hidden = false;
        }
    });
}

async function loadOffers() {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Dane ofert zwróciły HTTP ${response.status}.`);
    const data = await response.json();
    return OFFER_IDS.map((id) => data.offers.find((offer) => offer.identity.id === id)).filter(Boolean);
}

function renderCatalog(offers, profile, announcement = "") {
    const grid = document.querySelector("#offer-grid");
    const summary = document.querySelector("#profile-summary");
    if (!grid || !summary) return;
    summary.innerHTML = profileSummaryHtml(profile);
    if (announcement) summary.insertAdjacentHTML("beforeend", `<p class="noe-sr-status" role="status">${escapeHtml(announcement)}</p>`);
    grid.innerHTML = offers.map((offer) => offerCardHtml(offer, profile)).join("");
    renderHeaderProfile(profile);
}

function listBlock(title, items, className = "") {
    if (!items.length) return "";
    const id = className === "noe-steps" ? " id=\"steps\"" : "";
    return `<section${id} class="noe-detail-section ${escapeHtml(className)}"><h2>${escapeHtml(title)}</h2><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function detailContextHtml(context) {
    if (!context) {
        return `<section class="noe-detail-context noe-detail-context--empty" aria-labelledby="detail-context-title">
            <div><p class="noe-eyebrow">Czy ma sens dla Ciebie?</p><h2 id="detail-context-title">Profil jest opcjonalny</h2><p>Oferta pozostaje w pełni dostępna. Dodaj krótki profil, aby zobaczyć kontekst wpływów, wydatków i wysiłku.</p></div>
            <button class="noe-button noe-button--secondary" type="button" data-profile-open>Dopasuj do mnie</button>
        </section>`;
    }
    const reasonItems = [...context.blockers, ...context.unresolved, ...context.positives];
    return `<section class="noe-detail-context noe-detail-context--${escapeHtml(context.status)}" aria-labelledby="detail-context-title">
        <div><p class="noe-eyebrow">Czy ma sens dla Ciebie?</p><h2 id="detail-context-title">${escapeHtml(context.label)}</h2><p>${escapeHtml(context.summary)}</p></div>
        <ul>${reasonItems.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="noe-profile-actions"><button class="noe-button noe-button--secondary" type="button" data-profile-open>Zmień odpowiedzi</button><button class="noe-button noe-button--quiet" type="button" data-profile-clear>Wyczyść profil</button></div>
    </section>`;
}

function actionItems(offer) {
    return asArray(offer.execution?.actions).map((action, index) => `${index + 1}. ${action.label}${action.timing ? ` — ${action.timing}` : ""}`);
}

function timelineItems(offer) {
    const deadlines = asArray(offer.execution?.deadlines).map((item) => {
        const when = item.date || item.relativeRule || "Termin zależy od daty wejścia";
        return `${when}: ${item.appliesTo || item.type}`;
    });
    const payout = offer.execution?.payoutLag;
    if (payout?.latest) deadlines.push(`Wypłata: ${payout.latest}`);
    return deadlines;
}

function eligibilityItems(offer) {
    const items = [];
    const age = offer.eligibility?.age;
    if (age?.min !== undefined) items.push(`Wiek: od ${age.min} lat${age.max ? ` do ${age.max} lat` : ""}.`);
    const customer = offer.eligibility?.newCustomer;
    if (customer?.required) items.push(`Nowy klient: ${customer.definition}`);
    items.push(...asArray(offer.eligibility?.disqualifiers));
    return items;
}

function failureItems(offer) {
    return asArray(offer.execution?.failurePoints).map((item) => `${item.label}: ${item.consequence}${item.mitigation ? ` Jak ograniczyć ryzyko: ${item.mitigation}` : ""}`);
}

function costItems(offer) {
    const cost = offer.cost || {};
    const items = [];
    for (const item of asArray(cost.directFees)) {
        const amount = item.amount?.amount;
        items.push(`${item.label || item.type || "Koszt"}: ${amount !== undefined && amount !== null ? formatMoney(amount, item.amount?.currency || "PLN") : item.rule || item.note || "sprawdź warunek"}.`);
    }
    for (const item of asArray(cost.avoidableFees)) {
        const amount = item.amount?.amount;
        items.push(`${item.label || item.type || "Koszt do uniknięcia"}: ${amount !== undefined && amount !== null ? formatMoney(amount, item.amount?.currency || "PLN") : item.rule || item.avoidanceCondition || item.waiverCondition || item.note || "zależy od aktywności"}.`);
    }
    if (cost.opportunityCost?.summary) items.push(`Alternatywny koszt: ${cost.opportunityCost.summary}`);
    return items.length ? items : ["Brak kompletnego kosztu w skrócie. Sprawdź oficjalną tabelę opłat w źródłach."];
}

function variantItems(offer) {
    const variants = asArray(offer.promotionVariants).map((item) => `${item.name || item.id}: ${item.summary || item.status || "osobny wariant"}.`);
    const linked = asArray(offer.linkedPromotions).map((item) => `${item.name}: ${item.summary} Nie doliczamy tej wartości automatycznie do głównej oferty.`);
    return [...variants, ...linked];
}

function alternativesHtml(offer, offers) {
    const alternatives = offers.filter((item) => item.identity.id !== offer.identity.id);
    return `<section class="noe-detail-section noe-alternatives" aria-labelledby="alternatives-title">
        <h2 id="alternatives-title">Alternatywy i brak działania</h2>
        <div class="noe-alternative-grid">
            ${alternatives.map((item) => {
                const names = displayName(item);
                return `<a href="north-offer-detail.html?id=${encodeURIComponent(item.identity.id)}&v=offer-identity-v1"><span>${escapeHtml(names.provider)}</span><strong>${escapeHtml(names.product)}</strong><small>${escapeHtml(item.value?.advertisedMax?.displayLabel || item.listing?.cardValue)}</small></a>`;
            }).join("")}
            <article><span>Pełnoprawna alternatywa</span><strong>Nie otwieraj nowego konta</strong><small>0 zł nowego kosztu i 0 nowych obowiązków. Tracisz tylko potencjalną korzyść.</small></article>
        </div>
    </section>`;
}

function sourcesHtml(offer) {
    const sources = asArray(offer.evidence?.sources);
    return `<section class="noe-detail-section noe-sources" aria-labelledby="sources-title">
        <div class="noe-section-heading"><div><p class="noe-kicker"><span aria-hidden="true"></span> Skąd mamy te dane</p><h2 id="sources-title">Źródła i data weryfikacji</h2></div><p>Sprawdzono: <strong>${escapeHtml(offer.identity?.verifiedAt || "brak daty")}</strong><br>Ponowna weryfikacja: <strong>${escapeHtml(offer.evidence?.recheckBy || "nie ustalono")}</strong></p></div>
        <ul>${sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a><span>${escapeHtml(source.editionReference || source.type)} · dostęp: ${escapeHtml(source.accessedAt || "brak daty")}</span></li>`).join("")}</ul>
    </section>`;
}

function renderDetail(offer, offers, profile, announcement = "") {
    const root = document.querySelector("#detail-root");
    if (!root) return;
    const names = displayName(offer);
    const context = evaluateOfferContext(offer, profile);
    const topActions = actionItems(offer).slice(0, 3);
    const variants = variantItems(offer);
    root.innerHTML = `<article class="noe-detail-article">
        <nav class="noe-detail-breadcrumb" aria-label="Ścieżka kategorii">
            <a href="north-offer-experience.html#category-accounts">Konta</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(names.product)}</span>
        </nav>
        <section class="noe-detail-hero" aria-labelledby="detail-title" style="--noe-provider-accent: ${providerAccent(names)}">
            <div class="noe-detail-hero__intro">
                <div class="noe-detail-identity">
                    <div class="noe-provider-lockup">
                        ${providerLogoHtml(names, "hero")}
                        <span><small>Provider</small><strong>${escapeHtml(names.provider)}</strong><em>${escapeHtml(categoryLabels[offer.identity?.category] || offer.identity?.category?.replaceAll("_", " ").toUpperCase())}</em></span>
                    </div>
                    <p class="noe-kicker"><span aria-hidden="true"></span> Product Identity</p>
                    <h1 id="detail-title">${escapeHtml(names.product)}</h1>
                    <p>${escapeHtml(offer.listing?.summary || offer.identity?.title)}</p>
                    <a class="noe-button noe-button--primary" href="#steps">Zobacz plan krok po kroku</a>
                </div>
                ${visualSlotHtml(names)}
            </div>
            <div class="noe-above-fold-grid">
                <section><span>Co dostajesz?</span>${valuePresentationHtml(offer, "detail")}<p>${escapeHtml(valueExplanation(offer))}</p></section>
                <section><span>Co musisz zrobić?</span><ul>${topActions.map((item) => `<li>${escapeHtml(item.replace(/^\d+\.\s*/, ""))}</li>`).join("")}</ul></section>
                <section class="noe-above-fold-grid__catch"><span>Największy haczyk</span><strong>${escapeHtml(biggestCatch(offer))}</strong></section>
            </div>
        </section>
        ${detailContextHtml(context)}
        <div class="noe-detail-columns">
            ${listBlock("Kroki", actionItems(offer), "noe-steps")}
            ${listBlock("Oś czasu", timelineItems(offer))}
            ${listBlock("Warunki kwalifikacji", eligibilityItems(offer))}
            ${listBlock("Co może pójść nie tak", failureItems(offer), "noe-failures")}
            ${listBlock("Koszty", costItems(offer))}
            ${listBlock("Warianty i wartości powiązane", variants.length ? variants : ["Brak potwierdzonych wariantów w tym rekordzie. Nie sumujemy innych promocji automatycznie."])}
        </div>
        ${alternativesHtml(offer, offers)}
        ${sourcesHtml(offer)}
        <details class="noe-methodology">
            <summary><span><span class="noe-eyebrow">Warstwa dodatkowa</span><strong>Metodologia i granice wniosku</strong></span><span aria-hidden="true">Pokaż</span></summary>
            <div><p>Warstwa profilu ocenia tylko jawne sygnały: wiek, sposób prowadzenia, naturalne wpływy, zwykłe wydatki kartą, cel i tolerowany wysiłek. Nie wylicza procentu dopasowania ani punktowej oceny.</p><p>Dobry kontekst nie potwierdza statusu nowego klienta, karencji, dokumentów ani kwalifikowanej ścieżki. Te twarde warunki pozostają do sprawdzenia w oficjalnych źródłach. Profil nie zmienia faktów, pewności danych, kolejności ofert ani danych afiliacyjnych.</p></div>
        </details>
        ${announcement ? `<p class="noe-sr-status" role="status">${escapeHtml(announcement)}</p>` : ""}
    </article>`;
    renderHeaderProfile(profile);
    document.title = `${names.product} — North Offer Identity & Visual Assets Pass v1`;
}

function renderLoadError(container, message) {
    container.innerHTML = `<section class="noe-load-error"><p class="noe-eyebrow">Nie udało się wczytać danych</p><h1>North nie zgaduje faktów oferty.</h1><p>${escapeHtml(message)}</p><a class="noe-button noe-button--secondary" href="north-offer-experience.html">Wróć do katalogu prototypu</a></section>`;
}

async function mountCatalog() {
    const grid = document.querySelector("#offer-grid");
    try {
        const offers = await loadOffers();
        let profile = readProfile();
        const update = (nextProfile, announcement) => {
            profile = nextProfile;
            renderCatalog(offers, profile, announcement);
        };
        mountCategoryNavigation();
        mountCategoryMenuController();
        renderCatalog(offers, profile);
        mountProfileController(update);
    } catch (error) {
        renderLoadError(grid, error.message);
    }
}

async function mountDetail() {
    const root = document.querySelector("#detail-root");
    try {
        const offers = await loadOffers();
        const requestedId = new URL(window.location.href).searchParams.get("id");
        const offer = offers.find((item) => item.identity.id === requestedId) || offers[0];
        let profile = readProfile();
        const update = (nextProfile, announcement) => {
            profile = nextProfile;
            renderDetail(offer, offers, profile, announcement);
        };
        mountCategoryNavigation();
        mountCategoryMenuController();
        renderDetail(offer, offers, profile);
        mountProfileController(update);
    } catch (error) {
        renderLoadError(root, error.message);
    }
}

if (typeof document !== "undefined") {
    const page = document.body?.dataset.noePage;
    if (page === "catalog") mountCatalog();
    if (page === "detail") mountDetail();
}
