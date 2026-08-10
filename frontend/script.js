const filterButtons = document.querySelectorAll(".quick-filter");
const searchInput = document.getElementById("search-input");
const offersGrid = document.querySelector(".offers-grid");
const sortSelect = document.getElementById("sort-select");

let currentFilter = "all";
let currentSort = "featured";

// ---------- COMPONENTS ----------

function createBadge(badge) {
    if (!badge) return "";

    const icon = BADGE_ICONS[badge] || "";

    return `
        <span class="offer-badge">
            ${icon} ${badge}
        </span>
    `;
}

function createLogo(offer) {
    if (offer.logo) {
        return `
            <img
                class="offer-logo"
                src="${offer.logo}"
                alt="${offer.name}"
            >
        `;
    }

    return `
        <div class="offer-placeholder">
            LOGO
        </div>
    `;
}

function createFeature(label, value) {
    return `
        <div class="offer-feature">
            <span class="offer-label">${label}</span>
            <span class="offer-value">${value}</span>
        </div>
    `;
}

function createButton(offer) {
    return `
        <a
            class="btn green"
            href="${offer.url}"
            target="_blank"
            rel="noopener noreferrer"
        >
            ${offer.actionLabel}
        </a>
    `;
}

function createOfferCard(offer) {

    return `
        <article
            class="offer-card"
            data-id="${offer.id}"
            data-category="${offer.category}"
        >

            <div class="offer-header">

                <div class="offer-brand">

                    ${createLogo(offer)}

                    <h3>${offer.name}</h3>

                </div>

                ${createBadge(offer.badge)}

            </div>

            <div class="offer-info">

                ${FEATURES.map(feature =>
                    createFeature(
                        feature.label,
                        offer[feature.key]
                    )
                ).join("")}

            </div>

            <div class="offer-description">

                <p>${offer.description}</p>

            </div>

            <div class="offer-footer">

                ${createButton(offer)}

            </div>

        </article>
    `;
}

// ---------- FILTERS ----------

function getVisibleOffers() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    return offers.filter((offer) => {

        const matchesSearch =
            offer.name.toLowerCase().includes(searchValue);

        const matchesCategory =
            currentFilter === "all" ||
            offer.category === currentFilter;

        return matchesSearch && matchesCategory;

    });

}

function sortOffers(offersList) {

    const sorted = [...offersList];

    switch (currentSort) {

        case "bonus-desc":

            sorted.sort((a, b) => {

                return b.bonusValue - a.bonusValue;

            });

            break;

        case "time-asc":

            sorted.sort((a, b) => {

                return a.timeValue - b.timeValue;

            });

            break;

        case "newest":

            sorted.reverse();

            break;

        case "featured":

        default:

            sorted.sort((a, b) => {

                return Number(b.featured) - Number(a.featured);

            });

            break;

    }

    return sorted;

}

// ---------- RENDER ----------

function renderOffers() {

const visibleOffers = sortOffers(getVisibleOffers());

    offersGrid.innerHTML =
        visibleOffers
            .map(createOfferCard)
            .join("");

}

// ---------- EVENTS ----------

searchInput.addEventListener("input", renderOffers);

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach((btn) =>
            btn.classList.toggle("active", btn === button)
        );

        renderOffers();

    });

});

// ---------- INIT ----------

sortSelect.addEventListener("change", () => {

    currentSort = sortSelect.value;

    renderOffers();

});

renderOffers();