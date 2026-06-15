import type { Contact } from "@/features/banking/types/banking";

export type MobileTab = "dashboard" | "transfer" | "cards" | "invoices" | "contacts";

export const MOBILE_TAB_ORDER: MobileTab[] = [
  "dashboard",
  "transfer",
  "cards",
  "invoices",
  "contacts",
];

export type LockMode = "face" | "passcode";

export type TransferStep = 1 | 2 | 3 | 4;

export type RequestStep = 1 | 2 | 3;

export interface RequestDraft {
  step: RequestStep;
  selectedContact: Contact | null;
  toIban: string;
  citizenId: string;
  amountRaw: string;
  reason: string;
  useManualRecipient: boolean;
}

export interface TransferDraft {
  step: TransferStep;
  selectedContact: Contact | null;
  toIban: string;
  citizenId: string;
  amountRaw: string;
  note: string;
  useManualRecipient: boolean;
}

export const MOBILE_PASSCODE = "1234";

export const DEFAULT_TRANSFER_DRAFT: TransferDraft = {
  step: 1,
  selectedContact: null,
  toIban: "",
  citizenId: "",
  amountRaw: "",
  note: "",
  useManualRecipient: false,
};

export const DEFAULT_REQUEST_DRAFT: RequestDraft = {
  step: 1,
  selectedContact: null,
  toIban: "",
  citizenId: "",
  amountRaw: "",
  reason: "",
  useManualRecipient: false,
};
