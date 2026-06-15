export const TRANSFER_LIMIT = 1_000_000;

export const CITIZEN_ID_RE = /^[A-Z0-9]{4,12}$/i;

export type TransferMode = "deposit" | "withdraw" | "transfer";

export function getLimitForMode(
  mode: TransferMode,
  cashOnHand: number,
  balance: number,
): number {
  switch (mode) {
    case "deposit":
      return cashOnHand;
    case "withdraw":
      return balance;
    case "transfer":
      return Math.min(balance, TRANSFER_LIMIT);
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function isCitizenIdValid(id: string): boolean {
  return CITIZEN_ID_RE.test(id.trim());
}
