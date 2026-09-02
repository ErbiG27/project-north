import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "frontend/data/decision-offers.json"), "utf8"));
const matchSource = fs.readFileSync(path.join(root, "frontend/offers/match.js"), "utf8");
const sandbox = {
    window: {
        NorthOffers: {
            formatMoney: ({ amount, currency }) => `${amount} ${currency}`,
            escapeHtml: (value) => String(value ?? "")
        }
    }
};
vm.createContext(sandbox);
vm.runInContext(matchSource, sandbox, { filename: "frontend/offers/match.js" });
const evaluate = sandbox.window.NorthMatch.evaluateLegacy;
const offers = new Map(data.offers.map((offer) => [offer.identity.id, offer]));

const base = {
    "bank-millennium-millennium-360": {
        residencePoland: true, age: 25, relationshipClear: true, willRouteInflow: true,
        monthlyInflow: 1500, monthlySpend: 1000, commitmentMonths: 5,
        acceptsRecurring: true, initialActions: true, maintainsConsentsAndAccount: true,
        avoidsCardFee: true
    },
    "nest-bank-nest-konto": {
        residencePoland: true, age: 25, relationshipClear: true, salaryTransfer: true,
        monthlyInflow: 1500, monthlySpend: 2500, commitmentMonths: 24,
        acceptsRecurring: true, maintainsConsents: true, includeEur: false,
        eurExchangeAmount: 0, acceptsFxUncertainty: false
    },
    "bank-pekao-konto-przekorzystne": {
        residencePoland: true, age: 25, relationshipClear: true, eligibleOpeningPath: true,
        commitmentMonths: 2, acceptsRecurring: true, maintainsConsents: true,
        monthOneCardPayments: 5, monthTwoCardPayments: 5, avoidsCardFee: true,
        includeTravel: false, firstTransactionsSpend: 0, laterTransactionsSpend: 0,
        travelMonths: 0, travelSpend: 0, travelExpenseCount: 0, acceptsRestrictedReward: false
    },
    "alior-konto-18-25": {
        age: 21, relationshipClear: true, initialWallet: true, monthlyInflow: 500,
        walletPayments: 10, months: 3
    },
    "erste-konto-smart": {
        relationshipClear: true, variant: "600", monthlyInflow: 2000,
        monthlyPayments: 10, months: 4, savingsAndTransfer: true, insurancePremium: 0
    },
    "revolut-standard": {
        fxMonthly: 1000, weekendFx: false, atmMonthly: 400, atmWithdrawals: 2,
        acceptsAtmFees: false, valuesFeatures: true
    },
    "mbank-ekonto-do-uslug": {
        relationshipClear: true, variant: "main", initialActions: true, months: 6,
        monthlySpend: 350, openingMethod: true, salary: true, child: true, valuesVoucher: false
    },
    "pko-konto-za-zero": {
        relationshipClear: true, variant: "letni", monthlySpend: 1000, months: 1,
        plannedSamsung: false, samsungPurchase: 0, monthlyInflow: 0,
        extraProduct: false, valuesVoucher: false
    },
    "bnp-konto-otwarte-na-ciebie": {
        relationshipClear: true, firstMonthAbility: true, months: 1, monthlyInflow: 1000,
        monthlyTransactions: 7, appAndConsents: true, savingsProduct: false
    },
    "unicredit-konto-osobiste": {
        relationshipClear: true, months: 1, monthlyInflow: 3000, monthlySpend: 1000,
        valuesVouchers: true, valuesFeatures: false
    },
    "velobank-elastyczne-konto-oszczednosciowe": {
        customerType: "new_remote", balance: 5000, newMoney: true,
        activityMet: true, acceptsTax: true
    },
    "alior-konto-plus": {
        age: 30, relationshipClear: true, monthlyInflow: 1000, monthlyPayments: 3,
        months: 5, valuesRing: true, feeWaiverInflow: 3000, feeWaiverPayments: 5
    }
};

const values = (id, overrides = {}) => ({ ...base[id], ...overrides });
const without = (id, field, overrides = {}) => {
    const result = values(id, overrides);
    delete result[field];
    return result;
};

const cases = [
    { name: "Millennium — brak danych", id: "bank-millennium-millennium-360", input: {}, expect: { match: "CANNOT ASSESS", verdict: "NOT ENOUGH DATA" } },
    { name: "Millennium — wiek 18–25", id: "bank-millennium-millennium-360", input: values("bank-millennium-millennium-360"), expect: { match: "FIT", gross: 700 } },
    { name: "Millennium — wiek 27+", id: "bank-millennium-millennium-360", input: values("bank-millennium-millennium-360", { age: 27, monthlyInflow: 3000 }), expect: { match: "FIT", gross: 700 } },
    { name: "Millennium — dokładnie 26 lat", id: "bank-millennium-millennium-360", input: values("bank-millennium-millennium-360", { age: 26, monthlyInflow: 3000 }), expect: { match: "CANNOT ASSESS", verdict: "NOT ENOUGH DATA" } },
    { name: "Millennium — wykluczenie", id: "bank-millennium-millennium-360", input: values("bank-millennium-millennium-360", { relationshipClear: false }), expect: { match: "POOR FIT", verdict: "SKIP" } },

    { name: "Nest — pełne 1 250 zł", id: "nest-bank-nest-konto", input: values("nest-bank-nest-konto", { includeEur: true, eurExchangeAmount: 100, acceptsFxUncertainty: true }), expect: { match: "CONDITIONAL FIT", gross: 1250, usableMin: 1200, usableMax: 1250 } },
    { name: "Nest — częściowe wydatki", id: "nest-bank-nest-konto", input: values("nest-bank-nest-konto", { monthlySpend: 500 }), expect: { gross: 240 } },
    { name: "Nest — pominięty miesiąc", id: "nest-bank-nest-konto", input: values("nest-bank-nest-konto", { commitmentMonths: 23 }), expect: { gross: 1150 } },
    { name: "Nest — wykluczenie", id: "nest-bank-nest-konto", input: values("nest-bank-nest-konto", { relationshipClear: false }), expect: { match: "POOR FIT", verdict: "SKIP" } },

    { name: "Pekao [LEGACY SCALAR MODEL] — tylko 300 zł", id: "bank-pekao-konto-przekorzystne", input: values("bank-pekao-konto-przekorzystne"), expect: { match: "FIT", gross: 300 } },
    { name: "Pekao [LEGACY SCALAR MODEL] — użytkownik podróżny", id: "bank-pekao-konto-przekorzystne", input: values("bank-pekao-konto-przekorzystne", { commitmentMonths: 12, includeTravel: true, firstTransactionsSpend: 3334, laterTransactionsSpend: 1667, travelMonths: 12, travelSpend: 12000, travelExpenseCount: 2, acceptsRestrictedReward: true }), expect: { gross: 2700 } },
    { name: "Pekao [LEGACY SCALAR MODEL] — brak planów podróżnych", id: "bank-pekao-konto-przekorzystne", input: values("bank-pekao-konto-przekorzystne", { includeTravel: false }), expect: { gross: 300 } },
    { name: "Pekao [LEGACY SCALAR MODEL] — brak danych", id: "bank-pekao-konto-przekorzystne", input: {}, expect: { match: "CANNOT ASSESS", verdict: "NOT ENOUGH DATA" } },

    { name: "Alior 18–25 — kwalifikowany", id: "alior-konto-18-25", input: values("alior-konto-18-25"), expect: { match: "FIT", gross: 500 } },
    { name: "Alior 18–25 — poza wiekiem", id: "alior-konto-18-25", input: values("alior-konto-18-25", { age: 26 }), expect: { match: "POOR FIT", verdict: "SKIP", gross: 0, usableMax: 0 } },
    { name: "Alior 18–25 — brak zdolności wpływu", id: "alior-konto-18-25", input: without("alior-konto-18-25", "monthlyInflow"), expect: { match: "CANNOT ASSESS", verdict: "NOT ENOUGH DATA" } },

    { name: "Erste — wariant 600 zł", id: "erste-konto-smart", input: values("erste-konto-smart"), expect: { gross: 600 } },
    { name: "Erste — wariant 800 zł z ubezpieczeniem", id: "erste-konto-smart", input: values("erste-konto-smart", { variant: "800", insurancePremium: 1701 }), expect: { gross: 800 } },
    { name: "Erste — bez potrzeby ubezpieczenia", id: "erste-konto-smart", input: values("erste-konto-smart", { variant: "600" }), expect: { gross: 600 } },
    { name: "Erste — historyczne wykluczenie Santander", id: "erste-konto-smart", input: values("erste-konto-smart", { relationshipClear: false }), expect: { match: "POOR FIT", verdict: "SKIP", gross: 0, usableMax: 0 } },

    { name: "Revolut — niskie FX", id: "revolut-standard", input: values("revolut-standard"), expect: { match: "FIT", gross: 0, usableMax: 0, functionalFit: true } },
    { name: "Revolut — częste FX ponad limit", id: "revolut-standard", input: values("revolut-standard", { fxMonthly: 6000 }), expect: { match: "FIT", functionalFit: true } },
    { name: "Revolut — intensywne bankomaty bez akceptacji opłat", id: "revolut-standard", input: values("revolut-standard", { atmMonthly: 1200, atmWithdrawals: 8 }), expect: { match: "POOR FIT", verdict: "SKIP" } },

    { name: "mBank — prostsze 100 zł", id: "mbank-ekonto-do-uslug", input: values("mbank-ekonto-do-uslug", { months: 0, monthlySpend: 0, openingMethod: false, salary: false, child: false }), expect: { gross: 100 } },
    { name: "mBank — pełne 1 000 zł", id: "mbank-ekonto-do-uslug", input: values("mbank-ekonto-do-uslug"), expect: { match: "FIT", gross: 1000 } },
    { name: "mBank — bez wynagrodzenia", id: "mbank-ekonto-do-uslug", input: values("mbank-ekonto-do-uslug", { salary: false }), expect: { gross: 700 } },
    { name: "mBank — bez konta dziecka", id: "mbank-ekonto-do-uslug", input: values("mbank-ekonto-do-uslug", { child: false }), expect: { gross: 900 } },
    { name: "mBank — Media Expert bez sumowania wariantu głównego", id: "mbank-ekonto-do-uslug", input: values("mbank-ekonto-do-uslug", { variant: "media", valuesVoucher: true }), expect: { gross: 1200, usableMax: 1200 } },

    { name: "PKO — podstawowy cashback", id: "pko-konto-za-zero", input: values("pko-konto-za-zero"), expect: { gross: 100 } },
    { name: "PKO — zakup Samsung", id: "pko-konto-za-zero", input: values("pko-konto-za-zero", { variant: "samsung", plannedSamsung: true, samsungPurchase: 4000, valuesVoucher: true }), expect: { gross: 600, usableMax: 600 } },
    { name: "PKO — brak planu zakupu Samsung", id: "pko-konto-za-zero", input: values("pko-konto-za-zero", { variant: "samsung", plannedSamsung: false, samsungPurchase: 0 }), expect: { match: "POOR FIT", verdict: "SKIP" } },
    { name: "PKO — Allegro poziom 3%", id: "pko-konto-za-zero", input: values("pko-konto-za-zero", { variant: "allegro", monthlySpend: 3334, months: 12, monthlyInflow: 2000, extraProduct: true }), expect: { gross: 1200 } },

    { name: "BNP — pierwszy miesiąc", id: "bnp-konto-otwarte-na-ciebie", input: values("bnp-konto-otwarte-na-ciebie"), expect: { gross: 75 } },
    { name: "BNP — pełne 12 miesięcy", id: "bnp-konto-otwarte-na-ciebie", input: values("bnp-konto-otwarte-na-ciebie", { months: 12, savingsProduct: true }), expect: { gross: 1000 } },
    { name: "BNP — błędny lookback", id: "bnp-konto-otwarte-na-ciebie", input: values("bnp-konto-otwarte-na-ciebie", { relationshipClear: false }), expect: { match: "POOR FIT", verdict: "SKIP", gross: 0, usableMax: 0 } },

    { name: "UniCredit — pierwszy bon 50 zł", id: "unicredit-konto-osobiste", input: values("unicredit-konto-osobiste"), expect: { gross: 50, usableMax: 50 } },
    { name: "UniCredit — pełne 150 zł bonów", id: "unicredit-konto-osobiste", input: values("unicredit-konto-osobiste", { months: 2 }), expect: { gross: 150, usableMax: 150 } },
    { name: "UniCredit — użytkownik nie wycenia bonów", id: "unicredit-konto-osobiste", input: values("unicredit-konto-osobiste", { months: 2, valuesVouchers: false }), expect: { match: "POOR FIT", verdict: "SKIP", gross: 150, usableMax: 0 } },
    { name: "UniCredit — tylko wartość funkcjonalna", id: "unicredit-konto-osobiste", input: values("unicredit-konto-osobiste", { months: 0, monthlyInflow: 0, monthlySpend: 0, valuesVouchers: false, valuesFeatures: true }), expect: { match: "CONDITIONAL FIT", functionalFit: true } },

    { name: "Velo — 5 000 zł", id: "velobank-elastyczne-konto-oszczednosciowe", input: values("velobank-elastyczne-konto-oszczednosciowe", { balance: 5000 }), expect: { gross: 75.62, usableMax: 61.25 } },
    { name: "Velo — 10 000 zł", id: "velobank-elastyczne-konto-oszczednosciowe", input: values("velobank-elastyczne-konto-oszczednosciowe", { balance: 10000 }), expect: { gross: 151.23, usableMax: 122.5 } },
    { name: "Velo — 50 000 zł", id: "velobank-elastyczne-konto-oszczednosciowe", input: values("velobank-elastyczne-konto-oszczednosciowe", { balance: 50000 }), expect: { gross: 756.16, usableMax: 612.49 } },
    { name: "Velo — bez 5 płatności, stawka bazowa", id: "velobank-elastyczne-konto-oszczednosciowe", input: values("velobank-elastyczne-konto-oszczednosciowe", { activityMet: false }), expect: { gross: 25.21, usableMax: 20.42 } },
    { name: "Velo — inny kwalifikowany klient", id: "velobank-elastyczne-konto-oszczednosciowe", input: values("velobank-elastyczne-konto-oszczednosciowe", { customerType: "other", balance: 50000 }), expect: { gross: 567.12, usableMax: 459.37 } },
    { name: "Velo — brak nowych środków", id: "velobank-elastyczne-konto-oszczednosciowe", input: values("velobank-elastyczne-konto-oszczednosciowe", { newMoney: false }), expect: { match: "POOR FIT", verdict: "SKIP" } },

    { name: "Alior Plus — prostsze 200 zł użytecznej wartości", id: "alior-konto-plus", input: values("alior-konto-plus", { monthlyInflow: 0, monthlyPayments: 0, months: 0, valuesRing: false, feeWaiverInflow: 0, feeWaiverPayments: 0 }), expect: { usableMax: 200, netMax: 200 } },
    { name: "Alior Plus — pełne 800 zł gotówki", id: "alior-konto-plus", input: values("alior-konto-plus", { valuesRing: false }), expect: { gross: 1300, usableMax: 800, netMax: 800 } },
    { name: "Alior Plus — użytkownik wycenia pierścień", id: "alior-konto-plus", input: values("alior-konto-plus", { valuesRing: true }), expect: { usableMax: 1300, netMax: 1300 } },
    { name: "Alior Plus — użytkownik nie wycenia pierścienia", id: "alior-konto-plus", input: values("alior-konto-plus", { valuesRing: false }), expect: { match: "CONDITIONAL FIT", usableMax: 800 } },
    { name: "Alior Plus — promocja spełniona, próg opłat nie", id: "alior-konto-plus", input: values("alior-konto-plus", { valuesRing: false, feeWaiverInflow: 1000, feeWaiverPayments: 3 }), expect: { directCost: 90, netMax: 710, match: "CONDITIONAL FIT" } }
];

function close(actual, expected, label) {
    assert.ok(Math.abs(actual - expected) <= 0.02, `${label}: oczekiwano ${expected}, otrzymano ${actual}`);
}

let passed = 0;
for (const test of cases) {
    const offer = offers.get(test.id);
    assert.ok(offer, `${test.name}: brak rekordu ${test.id}`);
    const normalizedInput = Object.fromEntries(offer.match.fields.map((field) => [
        field.id,
        Object.hasOwn(test.input, field.id) ? test.input[field.id] : null
    ]));
    const result = evaluate(offer, normalizedInput);
    for (const [key, expected] of Object.entries(test.expect)) {
        if (typeof expected === "number") close(result[key], expected, `${test.name} / ${key}`);
        else assert.equal(result[key], expected, `${test.name} / ${key}`);
    }
    passed += 1;
    console.log(`PASS ${test.name} — ${result.match} / ${result.verdict} / gross ${result.gross.toFixed(2)} / usable ${result.usableMin.toFixed(2)}–${result.usableMax.toFixed(2)} / net ${result.netMin.toFixed(2)}–${result.netMax.toFixed(2)}`);
}

console.log(`\n${passed}/${cases.length} scenariuszy Match zaliczonych.`);
