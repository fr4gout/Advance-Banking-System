import { emptyNuiState } from "../mock/emptyState";
import { seedState } from "../mock/seed";
import { readStoredTheme } from "../hooks/useBankTheme";
import { isNuiEnvironment } from "../nui/bridge";
import type { BankingState } from "../types/banking";

export function getInitialBankingState(): BankingState {
  const bankTheme = readStoredTheme();
  if (isNuiEnvironment()) {
    return { ...emptyNuiState, bankTheme };
  }
  return { ...seedState, bankTheme };
}
