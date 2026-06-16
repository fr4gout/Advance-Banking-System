import { useCallback, type Dispatch, type SetStateAction } from "react";
import type {
  Account,
  ActiveLoan,
  BankTheme,
  BankingState,
  Character,
  Contact,
  CreditProfile,
  Invoice,
  LoanProduct,
  Transaction,
  VirtualCard,
} from "../types/banking";
import { applyBankTheme } from "../hooks/useBankTheme";
import { useNuiEvent } from "../nui/bridge";

export function useBankingNuiListeners(
  setState: Dispatch<SetStateAction<BankingState>>,
  setBankTheme: (theme: BankTheme) => void,
) {
  useNuiEvent<boolean>("setVisible", (visible) => {
    setState((s) => ({ ...s, isVisible: !!visible }));
  });

  useNuiEvent<Character>("setCharacter", (character) => {
    setState((s) => ({ ...s, character }));
  });

  useNuiEvent<Account[]>("setAccounts", (accounts) => {
    setState((s) => ({
      ...s,
      accounts,
      activeAccountId: accounts.some((a) => a.id === s.activeAccountId)
        ? s.activeAccountId
        : (accounts[0]?.id ?? ""),
    }));
  });

  useNuiEvent<Transaction>("pushTransaction", (tx) => {
    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
  });

  useNuiEvent<Invoice>("pushInvoice", (invoice) => {
    setState((s) => ({ ...s, invoices: [invoice, ...s.invoices] }));
  });

  useNuiEvent<Contact[]>("setContacts", (contacts) => {
    setState((s) => ({ ...s, contacts }));
  });

  useNuiEvent<number>("setCashOnHand", (cashOnHand) => {
    setState((s) => ({ ...s, cashOnHand }));
  });

  useNuiEvent<VirtualCard[]>("setCards", (cards) => {
    setState((s) => ({ ...s, cards }));
  });

  useNuiEvent<LoanProduct[]>("setLoanProducts", (loanProducts) => {
    setState((s) => ({ ...s, loanProducts }));
  });

  useNuiEvent<CreditProfile>("setCreditProfile", (creditProfile) => {
    setState((s) => ({ ...s, creditProfile }));
  });

  useNuiEvent<ActiveLoan>("pushActiveLoan", (loan) => {
    setState((s) => ({ ...s, activeLoans: [loan, ...s.activeLoans] }));
  });

  useNuiEvent<BankTheme>("setBankTheme", (theme) => {
    setBankTheme(theme);
  });
}

export function useBankingVisibility(
  setState: Dispatch<SetStateAction<BankingState>>,
) {
  const openBanking = useCallback(() => {
    setState((s) => ({ ...s, isVisible: true }));
  }, [setState]);

  const close = useCallback(() => {
    setState((s) => ({ ...s, isVisible: false }));
  }, [setState]);

  return { openBanking, close };
}
