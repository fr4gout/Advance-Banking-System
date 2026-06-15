export type ViewKey = "dashboard" | "transfers" | "accounts" | "cards" | "loans" | "invoices";

export interface Character {
  id: string;
  firstName: string;
  lastName: string;
  citizenId: string;
  phone: string;
  /** Optional job slug for loan eligibility, e.g. business_owner */
  job?: string;
}

export type AccountKind = "personal" | "society" | "shared";

export type SharedMemberRole = "owner" | "contributor" | "viewer";

export interface SharedAccountMember {
  id: string;
  name: string;
  citizenId: string;
  role: SharedMemberRole;
  addedAt: number;
}

export interface SocietyMember {
  name: string;
  rank: string;
}

export interface Account {
  id: string;
  kind: AccountKind;
  name: string;
  iban: string;
  balance: number;
  /** Short label shown in header account picker, e.g. PERSONAL, GANG */
  shortLabel?: string;
  /** Society-only */
  role?: string;
  withdrawLimit?: number;
  depositLimit?: number;
  members?: number;
  memberRoster?: SocietyMember[];
  authorizedRanks?: string[];
  /** Shared-only */
  sharedMembers?: SharedAccountMember[];
}

export type TxType =
  | "deposit"
  | "withdraw"
  | "transfer_in"
  | "transfer_out"
  | "invoice"
  | "salary"
  | "purchase"
  | "loan";

export type TxFilterCategory =
  | "all"
  | "salary"
  | "transfers"
  | "purchases"
  | "invoices"
  | "deposits"
  | "withdrawals";

export interface Transaction {
  id: string;
  accountId: string;
  type: TxType;
  amount: number; // positive number, sign derived from type
  label: string;
  counterparty?: string;
  note?: string;
  timestamp: number;
}

export interface Contact {
  id: string;
  name: string;
  iban: string;
  avatarHue: number; // 0-360 for gradient avatar
  favorite?: boolean;
}

export type InvoiceStatus = "unpaid" | "paid" | "overdue";

export interface Invoice {
  id: string;
  sender: string;
  reason: string;
  amount: number;
  dueDate: number;
  status: InvoiceStatus;
  category: "fine" | "player" | "utility" | "tax";
}

export type BankTheme = "pacific" | "maze" | "fleeca" | "lombank";

export interface TransactionSearchState {
  query: string;
  category: TxFilterCategory;
}

export type VirtualCardDesign = "midnight" | "silver" | "navy" | "carbon" | "burgundy";

export type VirtualCardStatus = "active" | "frozen";

export interface VirtualCard {
  id: string;
  accountId: string;
  holderName: string;
  maskedPan: string;
  last4: string;
  expiresAt: string; // MM/YY
  design: VirtualCardDesign;
  status: VirtualCardStatus;
  spendingLimit: number;
  createdAt: number;
}

export type LoanTier = "bronze" | "silver" | "gold" | "platinum";

export type LoanProductStatus = "pre_approved" | "available" | "locked";

export type LoanProductIcon = "wallet" | "calendar" | "car" | "building";

export interface CreditProfile {
  score: number;
  tier: LoanTier;
  holderName: string;
  rangeMin: number;
  rangeMax: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  icon: LoanProductIcon;
  minAmount: number;
  maxAmount: number;
  apr: number;
  termDays: number;
  status: LoanProductStatus;
  featured?: boolean;
  preApproved?: boolean;
  requiredJob?: string;
  requiredAccountKind?: AccountKind;
}

export type ActiveLoanStatus = "open" | "closed";

export interface ActiveLoan {
  id: string;
  accountId: string;
  productId: string;
  principal: number;
  apr: number;
  termDays: number;
  issuedAt: number;
  status: ActiveLoanStatus;
}

export interface BankingState {
  character: Character;
  accounts: Account[];
  activeAccountId: string;
  cashOnHand: number;
  transactions: Transaction[];
  contacts: Contact[];
  invoices: Invoice[];
  cards: VirtualCard[];
  creditProfile: CreditProfile;
  loanProducts: LoanProduct[];
  activeLoans: ActiveLoan[];
  view: ViewKey;
  isVisible: boolean;
  transactionSearch: TransactionSearchState;
  bankTheme: BankTheme;
}
