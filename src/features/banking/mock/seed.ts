import type { Account, BankingState, Contact, CreditProfile, Invoice, LoanProduct, Transaction, VirtualCard } from "../types/banking";

const now = Date.now();
const mins = (n: number) => now - n * 60_000;
const hrs = (n: number) => now - n * 3_600_000;
const days = (n: number) => now - n * 86_400_000;

export const MOBILE_TEST_INVOICE_ID = "i_test";

export function createMobileTestInvoice(): Invoice {
  return {
    id: MOBILE_TEST_INVOICE_ID,
    sender: "Pacific Bank",
    reason: "Test unpaid bill",
    amount: 250,
    dueDate: days(-14),
    status: "unpaid",
    category: "player",
  };
}

const accounts: Account[] = [
  {
    id: "acc_personal_main",
    kind: "personal",
    name: "Personal Account",
    iban: "LS00 4421 8893 1207",
    balance: 184_520,
    shortLabel: "PERSONAL",
  },
  {
    id: "acc_personal_savings",
    kind: "personal",
    name: "Savings",
    iban: "LS00 8821 5530 4419",
    balance: 62_300,
    shortLabel: "SAVINGS",
  },
  {
    id: "acc_society_lspd",
    kind: "society",
    name: "Los Santos Police Department",
    iban: "LS00 0001 0911 0000",
    balance: 1_240_750,
    shortLabel: "GOVERNMENT",
    role: "Sergeant",
    withdrawLimit: 25_000,
    depositLimit: 250_000,
    members: 42,
    authorizedRanks: ["Chief", "Captain", "Sergeant"],
    memberRoster: [
      { name: "Vincent Harris", rank: "Chief" },
      { name: "Sarah Chen", rank: "Captain" },
      { name: "Alex Mercer", rank: "Sergeant" },
      { name: "Jordan Blake", rank: "Officer" },
      { name: "Mia Torres", rank: "Officer" },
    ],
  },
  {
    id: "acc_society_mechanic",
    kind: "society",
    name: "Bennys Motorworks",
    iban: "LS00 0044 2210 5511",
    balance: 318_900,
    shortLabel: "MECHANIC",
    role: "Owner",
    withdrawLimit: 100_000,
    depositLimit: 500_000,
    members: 8,
    authorizedRanks: ["Owner", "Manager"],
    memberRoster: [
      { name: "Benny Ortega", rank: "Owner" },
      { name: "Alex Mercer", rank: "Owner" },
      { name: "Rico Santos", rank: "Manager" },
      { name: "Dani Kim", rank: "Mechanic" },
    ],
  },
  {
    id: "acc_shared_dm_test",
    kind: "shared",
    name: "DM TEST",
    iban: "LS00 7733 0091 4420",
    balance: 0,
    shortLabel: "SHARED",
    members: 2,
    sharedMembers: [
      {
        id: "sm_001",
        name: "Dm_ Dm_",
        citizenId: "W3KU9H44",
        role: "owner",
        addedAt: new Date("2026-06-07").getTime(),
      },
      {
        id: "sm_002",
        name: "Alex Mercer",
        citizenId: "ABC12345",
        role: "owner",
        addedAt: days(14),
      },
    ],
  },
];

const transactions: Transaction[] = [
  { id: "t1", accountId: "acc_personal_main", type: "salary", amount: 4_500, label: "LSPD Paycheck", counterparty: "Government", timestamp: hrs(2) },
  { id: "t2", accountId: "acc_personal_main", type: "purchase", amount: 89, label: "Burger Shot", counterparty: "Burger Shot", timestamp: hrs(5) },
  { id: "t3", accountId: "acc_personal_main", type: "transfer_in", amount: 2_500, label: "From Michael DeSanta", counterparty: "M. DeSanta", note: "Poker debt", timestamp: hrs(9) },
  { id: "t4", accountId: "acc_personal_main", type: "withdraw", amount: 1_200, label: "ATM Withdrawal", counterparty: "Pacific Bank ATM", timestamp: hrs(14) },
  { id: "t5", accountId: "acc_personal_main", type: "purchase", amount: 320, label: "Premium Deluxe Motorsport", counterparty: "PDM", timestamp: hrs(20) },
  { id: "t6", accountId: "acc_personal_main", type: "transfer_out", amount: 750, label: "To Trevor Philips", counterparty: "T. Philips", note: "Rent", timestamp: days(1) },
  { id: "t7", accountId: "acc_personal_main", type: "deposit", amount: 6_000, label: "Cash Deposit", counterparty: "Branch", timestamp: days(1) },
  { id: "t8", accountId: "acc_personal_main", type: "invoice", amount: 450, label: "Speeding fine", counterparty: "LSPD", timestamp: days(2) },
  { id: "t9", accountId: "acc_personal_main", type: "salary", amount: 4_500, label: "LSPD Paycheck", counterparty: "Government", timestamp: days(2) },
  { id: "t10", accountId: "acc_personal_main", type: "purchase", amount: 27, label: "24/7 Convenience", counterparty: "24/7", timestamp: days(3) },
  { id: "t11", accountId: "acc_personal_main", type: "deposit", amount: 3_200, label: "Cash Deposit", counterparty: "Branch", timestamp: days(4) },
  { id: "t12", accountId: "acc_personal_main", type: "transfer_in", amount: 1_100, label: "From Franklin Clinton", counterparty: "F. Clinton", note: "Split gas", timestamp: days(5) },
  { id: "t13", accountId: "acc_personal_main", type: "withdraw", amount: 500, label: "ATM Withdrawal", counterparty: "Pacific Bank ATM", timestamp: days(6) },
  { id: "t14", accountId: "acc_personal_main", type: "purchase", amount: 145, label: "Ammu-Nation", counterparty: "Ammu-Nation", timestamp: days(6) },
];

const contacts: Contact[] = [
  { id: "c1", name: "Ballas Organization", iban: "LS00 1122 0044 8821", avatarHue: 210, favorite: true },
  { id: "c2", name: "mechanic", iban: "LS00 5567 8090 1144", avatarHue: 140, favorite: true },
  { id: "c3", name: "dm", iban: "LS00 9981 4422 0055", avatarHue: 30, favorite: true },
  { id: "c4", name: "Michael DeSanta", iban: "LS00 6612 7741 0088", avatarHue: 280 },
  { id: "c5", name: "Franklin Clinton", iban: "LS00 3322 9985 4400", avatarHue: 100 },
];

const invoices: Invoice[] = [
  createMobileTestInvoice(),
  { id: "i1", sender: "LSPD", reason: "Speeding (90 in 45)", amount: 850, dueDate: days(-3), status: "unpaid", category: "fine" },
  { id: "i2", sender: "City Hall", reason: "Property Tax — Eclipse Towers", amount: 3_200, dueDate: days(-7), status: "unpaid", category: "tax" },
  { id: "i3", sender: "LS Power", reason: "Electricity — March", amount: 412, dueDate: days(-1), status: "overdue", category: "utility" },
  { id: "i4", sender: "Bennys Motorworks", reason: "Tuning & respray", amount: 12_500, dueDate: days(-5), status: "unpaid", category: "player" },
  { id: "i5", sender: "LSPD", reason: "Illegal parking", amount: 150, dueDate: days(10), status: "paid", category: "fine" },
];

const cards: VirtualCard[] = [
  {
    id: "card_001",
    accountId: "acc_personal_main",
    holderName: "Alex Mercer",
    maskedPan: "**** **** **** 4471",
    last4: "4471",
    expiresAt: "06/30",
    design: "navy",
    status: "active",
    spendingLimit: 2_500,
    createdAt: days(14),
  },
  {
    id: "card_002",
    accountId: "acc_personal_main",
    holderName: "Alex Mercer",
    maskedPan: "**** **** **** 8964",
    last4: "8964",
    expiresAt: "06/30",
    design: "midnight",
    status: "active",
    spendingLimit: 50_000,
    createdAt: days(2),
  },
];

const creditProfile: CreditProfile = {
  score: 807,
  tier: "gold",
  holderName: "Alex Mercer",
  rangeMin: 300,
  rangeMax: 850,
};

const loanProducts: LoanProduct[] = [
  {
    id: "loan_quick",
    name: "Personal Quick Loan",
    description: "Fast cash for short-term needs with instant approval.",
    icon: "wallet",
    minAmount: 1_000,
    maxAmount: 25_000,
    apr: 8,
    termDays: 14,
    status: "pre_approved",
    featured: true,
    preApproved: true,
  },
  {
    id: "loan_term",
    name: "Personal Term Loan",
    description: "Flexible repayment over a longer period.",
    icon: "calendar",
    minAmount: 5_000,
    maxAmount: 150_000,
    apr: 12,
    termDays: 60,
    status: "available",
  },
  {
    id: "loan_vehicle",
    name: "Vehicle Loan",
    description: "Finance your next ride with competitive rates.",
    icon: "car",
    minAmount: 10_000,
    maxAmount: 500_000,
    apr: 9,
    termDays: 90,
    status: "available",
  },
  {
    id: "loan_business",
    name: "Business Loan",
    description: "Capital for registered business owners.",
    icon: "building",
    minAmount: 25_000,
    maxAmount: 1_000_000,
    apr: 11,
    termDays: 120,
    status: "locked",
    requiredJob: "business_owner",
    requiredAccountKind: "society",
  },
];

export const seedState: BankingState = {
  character: {
    id: "char_001",
    firstName: "Alex",
    lastName: "Mercer",
    citizenId: "ABC12345",
    phone: "555-0142",
  },
  accounts,
  activeAccountId: "acc_personal_main",
  cashOnHand: 3_450,
  transactions,
  contacts,
  invoices,
  cards,
  creditProfile,
  loanProducts,
  activeLoans: [],
  view: "dashboard",
  isVisible: true,
  transactionSearch: { query: "", category: "all" },
  bankTheme: "pacific",
};
