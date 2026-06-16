import type { BankingState } from "../types/banking";

/** Minimal state used when running inside FiveM NUI before Lua pushes real data. */
export const emptyNuiState: BankingState = {
  character: {
    id: "",
    firstName: "",
    lastName: "",
    citizenId: "",
    phone: "",
  },
  accounts: [],
  activeAccountId: "",
  cashOnHand: 0,
  transactions: [],
  contacts: [],
  invoices: [],
  cards: [],
  creditProfile: {
    score: 0,
    tier: "bronze",
    holderName: "",
    rangeMin: 300,
    rangeMax: 850,
  },
  loanProducts: [],
  activeLoans: [],
  view: "dashboard",
  isVisible: false,
  transactionSearch: { query: "", category: "all" },
  bankTheme: "pacific",
};
