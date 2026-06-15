import type { Account } from "../types/banking";

export function isSocietyAdmin(account: Account): boolean {
  if (account.kind !== "society" || !account.role || !account.authorizedRanks?.length) {
    return false;
  }
  return account.authorizedRanks.includes(account.role);
}
