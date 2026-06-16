import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Account,
  BankTheme,
  BankingState,
  Contact,
  Transaction,
  ViewKey,
  SharedMemberRole,
  VirtualCardDesign,
  VirtualCardStatus,
} from "../types/banking";
import { createMobileTestInvoice, MOBILE_TEST_INVOICE_ID } from "../mock/seed";
import { fetchNui } from "../nui/bridge";
import { applyBankTheme } from "../hooks/useBankTheme";
import { getInitialBankingState } from "./initialState";
import { useBankingMutations } from "./useBankingMutations";
import { useBankingNuiListeners, useBankingVisibility } from "./useBankingNui";
import type { TransferMode } from "../utils/transferLimits";

interface BankingContextValue extends BankingState {
  activeAccount: BankingState["accounts"][number];
  setView: (v: ViewKey) => void;
  openBanking: () => void;
  close: () => void;
  switchAccount: (id: string) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  issueVirtualCard: (args: {
    accountId: string;
    pin: string;
    design: VirtualCardDesign;
  }) => void;
  updateVirtualCard: (args: {
    cardId: string;
    status?: VirtualCardStatus;
    spendingLimit?: number;
  }) => void;
  applyForLoan: (args: {
    accountId: string;
    productId: string;
    amount: number;
  }) => void;
  transfer: (args: {
    toIban?: string;
    citizenId?: string;
    amount: number;
    note?: string;
    contactName?: string;
  }) => void;
  requestPayment: (args: {
    toIban?: string;
    citizenId?: string;
    amount: number;
    reason: string;
    contactName?: string;
  }) => void;
  payInvoice: (id: string) => void;
  ensureMobileTestInvoice: () => void;
  setTransactionSearch: (
    patch: Partial<BankingState["transactionSearch"]>,
  ) => void;
  clearTransactionSearch: () => void;
  saveContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  toggleContactFavorite: (id: string) => void;
  updateSocietyLimits: (
    accountId: string,
    limits: { withdrawLimit: number; depositLimit: number },
  ) => void;
  addSharedMember: (
    accountId: string,
    args: { citizenId: string; role: SharedMemberRole },
  ) => void;
  updateSharedMemberRole: (
    accountId: string,
    memberId: string,
    role: SharedMemberRole,
  ) => void;
  removeSharedMember: (accountId: string, memberId: string) => void;
  setBankTheme: (theme: BankTheme) => void;
  transfersPanel: "send" | "history";
  setTransfersPanel: (panel: "send" | "history") => void;
  transferMode: TransferMode;
  openTransfersHistory: () => void;
  openTransfersSend: (mode?: TransferMode) => void;
}

const BankingContext = createContext<BankingContextValue | null>(null);

const DEFAULT_SEARCH = { query: "", category: "all" as const };
const contactUid = () => `c_${Math.random().toString(36).slice(2, 10)}`;

export function BankingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankingState>(getInitialBankingState);
  const [transfersPanel, setTransfersPanel] = useState<"send" | "history">(
    "send",
  );
  const [transferMode, setTransferMode] = useState<TransferMode>("transfer");

  const setBankTheme = useCallback((theme: BankTheme) => {
    setState((s) => ({ ...s, bankTheme: theme }));
    localStorage.setItem("banking-theme", theme);
    applyBankTheme(theme);
  }, []);

  useEffect(() => {
    applyBankTheme(state.bankTheme);
  }, [state.bankTheme]);

  useBankingNuiListeners(setState, setBankTheme);
  const { openBanking, close: hideBanking } = useBankingVisibility(setState);
  const mutations = useBankingMutations(setState);

  const pushTx = useCallback((tx: Transaction) => {
    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
  }, []);

  const setView = useCallback(
    (v: ViewKey) => setState((s) => ({ ...s, view: v })),
    [],
  );

  const close = useCallback(() => {
    hideBanking();
    void fetchNui("close");
  }, [hideBanking]);

  const ensureMobileTestInvoice = useCallback(() => {
    setState((s) => {
      const existing = s.invoices.find((i) => i.id === MOBILE_TEST_INVOICE_ID);
      if (existing && existing.status !== "paid") return s;
      const invoice = createMobileTestInvoice();
      return {
        ...s,
        invoices: [
          invoice,
          ...s.invoices.filter((i) => i.id !== MOBILE_TEST_INVOICE_ID),
        ],
      };
    });
  }, []);

  const setTransactionSearch = useCallback(
    (patch: Partial<BankingState["transactionSearch"]>) => {
      setState((s) => ({
        ...s,
        transactionSearch: { ...s.transactionSearch, ...patch },
      }));
    },
    [],
  );

  const clearTransactionSearch = useCallback(() => {
    setState((s) => ({ ...s, transactionSearch: DEFAULT_SEARCH }));
  }, []);

  const openTransfersHistory = useCallback(() => {
    setState((s) => ({ ...s, view: "transfers" }));
    setTransfersPanel("history");
  }, []);

  const openTransfersSend = useCallback((mode: TransferMode = "transfer") => {
    setTransferMode(mode);
    setState((s) => ({ ...s, view: "transfers" }));
    setTransfersPanel("send");
  }, []);

  const value = useMemo<BankingContextValue>(() => {
    const activeAccount: Account = state.accounts.find(
      (a) => a.id === state.activeAccountId,
    ) ??
      state.accounts[0] ?? {
        id: "",
        kind: "personal",
        name: "",
        iban: "",
        balance: 0,
      };

    return {
      ...state,
      activeAccount,
      setView,
      openBanking,
      close,
      ...mutations,
      ensureMobileTestInvoice,
      setTransactionSearch,
      clearTransactionSearch,
      setBankTheme,
      transfersPanel,
      setTransfersPanel,
      transferMode,
      openTransfersHistory,
      openTransfersSend,
    };
  }, [
    state,
    setView,
    openBanking,
    close,
    mutations,
    ensureMobileTestInvoice,
    setTransactionSearch,
    clearTransactionSearch,
    setBankTheme,
    transfersPanel,
    transferMode,
    openTransfersHistory,
    openTransfersSend,
  ]);

  if (import.meta.env.DEV && typeof window !== "undefined") {
    (window as unknown as { __bankingPushTx?: typeof pushTx }).__bankingPushTx =
      pushTx;
    (
      window as unknown as { __bankingContactUid?: typeof contactUid }
    ).__bankingContactUid = contactUid;
    (
      window as unknown as {
        __bankingEnsureMobileTestInvoice?: typeof ensureMobileTestInvoice;
      }
    ).__bankingEnsureMobileTestInvoice = ensureMobileTestInvoice;
  }

  return (
    <BankingContext.Provider value={value}>{children}</BankingContext.Provider>
  );
}

export function useBanking() {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error("useBanking must be used within BankingProvider");
  return ctx;
}

export function createContactId(): string {
  return `c_${Math.random().toString(36).slice(2, 10)}`;
}
