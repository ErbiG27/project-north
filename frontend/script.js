const filterButtons = document.querySelectorAll(".quick-filter");
const searchInput = document.getElementById("search-input");
const offerCards = document.querySelectorAll(".offer-card");

let currentFilter = "all";

function updateOffers() {

    const searchValue = searchInput.value.toLowerCase();

    offerCards.forEach((card) => {

        const offerName = card.dataset.name.toLowerCase();
        const offerCategory = card.dataset.category;

        const matchesSearch = offerName.includes(searchValue);

        const matchesCategory =
            currentFilter === "all" ||
            offerCategory === currentFilter;

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}

searchInput.addEventListener("input", () => {

    updateOffers();

});

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        updateOffers();

    });

});

updateOffers();