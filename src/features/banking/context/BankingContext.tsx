import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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
  TransactionSearchState,
  VirtualCard,
  VirtualCardDesign,
  VirtualCardStatus,
  ViewKey,
  SharedMemberRole,
} from "../types/banking";
import { createMobileTestInvoice, MOBILE_TEST_INVOICE_ID, seedState } from "../mock/seed";
import { fetchNui, useNuiEvent } from "../nui/bridge";
import { applyBankTheme, readStoredTheme } from "../hooks/useBankTheme";
import { getLoanEligibility } from "../utils/loanEligibility";
import { notifyBankingSuccess } from "../utils/bankingNotify";
import { countSharedOwners } from "../utils/sharedAccount";
import type { TransferMode } from "../utils/transferLimits";

interface BankingContextValue extends BankingState {
  activeAccount: BankingState["accounts"][number];
  setView: (v: ViewKey) => void;
  close: () => void;
  switchAccount: (id: string) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  issueVirtualCard: (args: { accountId: string; pin: string; design: VirtualCardDesign }) => void;
  updateVirtualCard: (args: { cardId: string; status?: VirtualCardStatus; spendingLimit?: number }) => void;
  applyForLoan: (args: { accountId: string; productId: string; amount: number }) => void;
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
  setTransactionSearch: (patch: Partial<TransactionSearchState>) => void;
  clearTransactionSearch: () => void;
  saveContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  toggleContactFavorite: (id: string) => void;
  updateSocietyLimits: (accountId: string, limits: { withdrawLimit: number; depositLimit: number }) => void;
  addSharedMember: (accountId: string, args: { citizenId: string; role: SharedMemberRole }) => void;
  updateSharedMemberRole: (accountId: string, memberId: string, role: SharedMemberRole) => void;
  removeSharedMember: (accountId: string, memberId: string) => void;
  setBankTheme: (theme: BankTheme) => void;
  transfersPanel: "send" | "history";
  setTransfersPanel: (panel: "send" | "history") => void;
  transferMode: TransferMode;
  openTransfersHistory: () => void;
  openTransfersSend: (mode?: TransferMode) => void;
}

const BankingContext = createContext<BankingContextValue | null>(null);

const uid = () => `tx_${Math.random().toString(36).slice(2, 10)}`;
const contactUid = () => `c_${Math.random().toString(36).slice(2, 10)}`;
const cardUid = () => `card_${Math.random().toString(36).slice(2, 10)}`;
const loanUid = () => `loan_${Math.random().toString(36).slice(2, 10)}`;
const memberUid = () => `sm_${Math.random().toString(36).slice(2, 10)}`;

const DEFAULT_SEARCH: TransactionSearchState = { query: "", category: "all" };

const SOCIETY_LIMIT_MAX = 10_000_000;

export function BankingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankingState>(() => ({
    ...seedState,
    bankTheme: readStoredTheme(),
  }));
  const [transfersPanel, setTransfersPanel] = useState<"send" | "history">("send");
  const [transferMode, setTransferMode] = useState<TransferMode>("transfer");

  useEffect(() => {
    applyBankTheme(state.bankTheme);
  }, [state.bankTheme]);

  useNuiEvent<boolean>("setVisible", (visible) => {
    setState((s) => ({ ...s, isVisible: !!visible }));
  });

  useNuiEvent<Character>("setCharacter", (character) => {
    setState((s) => ({ ...s, character }));
  });

  useNuiEvent<Account[]>("setAccounts", (accounts) => {
    setState((s) => ({ ...s, accounts }));
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

  const pushTx = useCallback((tx: Transaction) => {
    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
  }, []);

  const setView = useCallback((v: ViewKey) => setState((s) => ({ ...s, view: v })), []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, isVisible: false }));
    void fetchNui("close");
  }, []);

  const switchAccount = useCallback((id: string) => {
    setState((s) => ({ ...s, activeAccountId: id }));
    void fetchNui("switchAccount", { id });
  }, []);

  const deposit = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      let applied = false;
      setState((s) => {
        if (amount > s.cashOnHand) return s;
        applied = true;
        return {
          ...s,
          cashOnHand: s.cashOnHand - amount,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId ? { ...a, balance: a.balance + amount } : a,
          ),
          transactions: [
            { id: uid(), accountId: s.activeAccountId, type: "deposit", amount, label: "Cash Deposit", counterparty: "Branch", timestamp: Date.now() },
            ...s.transactions,
          ],
        };
      });
      if (!applied) return;
      void fetchNui("deposit", { amount });
      notifyBankingSuccess(`Deposited $${amount.toLocaleString()}`);
    },
    [],
  );

  const withdraw = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      let applied = false;
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (!acc || amount > acc.balance) return s;
        applied = true;
        return {
          ...s,
          cashOnHand: s.cashOnHand + amount,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId ? { ...a, balance: a.balance - amount } : a,
          ),
          transactions: [
            { id: uid(), accountId: s.activeAccountId, type: "withdraw", amount, label: "ATM Withdrawal", counterparty: "Branch", timestamp: Date.now() },
            ...s.transactions,
          ],
        };
      });
      if (!applied) return;
      void fetchNui("withdraw", { amount });
      notifyBankingSuccess(`Withdrew $${amount.toLocaleString()}`);
    },
    [],
  );

  const issueVirtualCard = useCallback((args: { accountId: string; pin: string; design: VirtualCardDesign }) => {
    const pin = args.pin.trim();
    if (!/^\d{4}$/.test(pin)) return;

    setState((s) => {
      const account = s.accounts.find((a) => a.id === args.accountId);
      if (!account) return s;

      const holderName = `${s.character.firstName} ${s.character.lastName}`.trim();
      const last4 = String(Math.floor(Math.random() * 10_000)).padStart(4, "0");
      const expiresAt = "06/30";
      const next: VirtualCard = {
        id: cardUid(),
        accountId: args.accountId,
        holderName,
        maskedPan: `**** **** **** ${last4}`,
        last4,
        expiresAt,
        design: args.design,
        status: "active",
        spendingLimit: 25_000,
        createdAt: Date.now(),
      };

      return { ...s, cards: [next, ...s.cards] };
    });
    void fetchNui("issueVirtualCard", { accountId: args.accountId, pin: args.pin, design: args.design });
    notifyBankingSuccess("Virtual card issued");
  }, []);

  const updateVirtualCard = useCallback(
    (args: { cardId: string; status?: VirtualCardStatus; spendingLimit?: number }) => {
      setState((s) => {
        const card = s.cards.find((c) => c.id === args.cardId);
        if (!card) return s;

        const updated = s.cards.map((c) =>
          c.id === args.cardId
            ? {
                ...c,
                ...(args.status !== undefined ? { status: args.status } : {}),
                ...(args.spendingLimit !== undefined ? { spendingLimit: args.spendingLimit } : {}),
              }
            : c,
        );

        return { ...s, cards: updated };
      });
      void fetchNui("updateCard", args);
      if (args.status === "frozen") {
        notifyBankingSuccess("Card frozen");
      } else if (args.status === "active") {
        notifyBankingSuccess("Card unfrozen");
      }
    },
    [],
  );

  const applyForLoan = useCallback(
    (args: { accountId: string; productId: string; amount: number }) => {
      const { accountId, productId, amount } = args;
      if (amount <= 0) return;

      setState((s) => {
        const account = s.accounts.find((a) => a.id === accountId);
        const product = s.loanProducts.find((p) => p.id === productId);
        if (!account || !product) return s;

        const eligibility = getLoanEligibility(product, s.character, account);
        if (!eligibility.eligible) return s;
        if (amount < product.minAmount || amount > product.maxAmount) return s;

        const loan: ActiveLoan = {
          id: loanUid(),
          accountId,
          productId,
          principal: amount,
          apr: product.apr,
          termDays: product.termDays,
          issuedAt: Date.now(),
          status: "open",
        };

        return {
          ...s,
          activeLoans: [loan, ...s.activeLoans],
          accounts: s.accounts.map((a) =>
            a.id === accountId ? { ...a, balance: a.balance + amount } : a,
          ),
          transactions: [
            {
              id: uid(),
              accountId,
              type: "loan",
              amount,
              label: `${product.name} — Disbursement`,
              counterparty: "Pacific Standard Bank",
              note: `${product.apr}% APR · ${product.termDays}d term`,
              timestamp: Date.now(),
            },
            ...s.transactions,
          ],
        };
      });
      void fetchNui("applyForLoan", { accountId, productId, amount });
      notifyBankingSuccess(`Loan approved — $${amount.toLocaleString()}`);
    },
    [],
  );

  const transfer = useCallback(
    ({
      toIban,
      citizenId,
      amount,
      note,
      contactName,
    }: {
      toIban?: string;
      citizenId?: string;
      amount: number;
      note?: string;
      contactName?: string;
    }) => {
      if (amount <= 0) return;
      if (!toIban && !citizenId) return;
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (!acc || amount > acc.balance) return s;
        const counterparty = contactName ?? (citizenId ? `Citizen ${citizenId}` : toIban);
        const label = contactName
          ? `To ${contactName}`
          : citizenId
            ? `To Citizen ${citizenId}`
            : `To ${toIban}`;
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId ? { ...a, balance: a.balance - amount } : a,
          ),
          transactions: [
            {
              id: uid(),
              accountId: s.activeAccountId,
              type: "transfer_out",
              amount,
              label,
              counterparty,
              note,
              timestamp: Date.now(),
            },
            ...s.transactions,
          ],
        };
      });
      void fetchNui("transfer", { toIban, citizenId, amount, note });
      notifyBankingSuccess(`Transfer sent — $${amount.toLocaleString()}`);
    },
    [],
  );

  const requestPayment = useCallback(
    ({
      toIban,
      citizenId,
      amount,
      reason,
      contactName,
    }: {
      toIban?: string;
      citizenId?: string;
      amount: number;
      reason: string;
      contactName?: string;
    }) => {
      if (amount <= 0 || !reason.trim()) return;
      if (!toIban && !citizenId) return;

      void fetchNui("requestPayment", { toIban, citizenId, amount, reason, contactName });
      const recipient =
        contactName ?? (citizenId ? `Citizen ${citizenId}` : toIban ?? "recipient");
      notifyBankingSuccess(`Payment request sent to ${recipient}`);
    },
    [],
  );

  const payInvoice = useCallback((id: string) => {
    setState((s) => {
      const invoice = s.invoices.find((i) => i.id === id);
      const acc = s.accounts.find((a) => a.id === s.activeAccountId);
      if (!invoice || invoice.status === "paid" || !acc || acc.balance < invoice.amount) return s;
      return {
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === s.activeAccountId ? { ...a, balance: a.balance - invoice.amount } : a,
        ),
        invoices: s.invoices.map((i) => (i.id === id ? { ...i, status: "paid" as const } : i)),
        transactions: [
          {
            id: uid(),
            accountId: s.activeAccountId,
            type: "invoice",
            amount: invoice.amount,
            label: `${invoice.sender} — ${invoice.reason}`,
            counterparty: invoice.sender,
            timestamp: Date.now(),
          },
          ...s.transactions,
        ],
      };
    });
    void fetchNui("payInvoice", { id });
    notifyBankingSuccess("Invoice paid");
  }, []);

  const ensureMobileTestInvoice = useCallback(() => {
    setState((s) => {
      const existing = s.invoices.find((i) => i.id === MOBILE_TEST_INVOICE_ID);
      if (existing && existing.status !== "paid") return s;
      const invoice = createMobileTestInvoice();
      return {
        ...s,
        invoices: [invoice, ...s.invoices.filter((i) => i.id !== MOBILE_TEST_INVOICE_ID)],
      };
    });
  }, []);

  const setTransactionSearch = useCallback((patch: Partial<TransactionSearchState>) => {
    setState((s) => ({
      ...s,
      transactionSearch: { ...s.transactionSearch, ...patch },
    }));
  }, []);

  const clearTransactionSearch = useCallback(() => {
    setState((s) => ({ ...s, transactionSearch: DEFAULT_SEARCH }));
  }, []);

  const saveContact = useCallback((contact: Contact) => {
    setState((s) => {
      const exists = s.contacts.some((c) => c.id === contact.id);
      const contacts = exists
        ? s.contacts.map((c) => (c.id === contact.id ? contact : c))
        : [...s.contacts, contact];
      return { ...s, contacts };
    });
    void fetchNui("saveContact", contact);
  }, []);

  const deleteContact = useCallback((id: string) => {
    setState((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) }));
    void fetchNui("saveContact", { id, deleted: true });
  }, []);

  const toggleContactFavorite = useCallback((id: string) => {
    setState((s) => {
      const contact = s.contacts.find((c) => c.id === id);
      if (!contact) return s;
      const updated = { ...contact, favorite: !contact.favorite };
      void fetchNui("saveContact", updated);
      return {
        ...s,
        contacts: s.contacts.map((c) => (c.id === id ? updated : c)),
      };
    });
  }, []);

  const updateSocietyLimits = useCallback(
    (accountId: string, limits: { withdrawLimit: number; depositLimit: number }) => {
      if (limits.withdrawLimit < 1 || limits.depositLimit < 1) return;
      if (limits.withdrawLimit > SOCIETY_LIMIT_MAX || limits.depositLimit > SOCIETY_LIMIT_MAX) return;

      setState((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === accountId
            ? { ...a, withdrawLimit: limits.withdrawLimit, depositLimit: limits.depositLimit }
            : a,
        ),
      }));
      void fetchNui("updateSocietyLimits", { accountId, ...limits });
    },
    [],
  );

  const addSharedMember = useCallback(
    (accountId: string, args: { citizenId: string; role: SharedMemberRole }) => {
      const citizenId = args.citizenId.trim().toUpperCase();
      if (!citizenId) return;

      setState((s) => {
        const account = s.accounts.find((a) => a.id === accountId);
        if (!account || account.kind !== "shared") return s;

        const roster = account.sharedMembers ?? [];
        if (roster.some((m) => m.citizenId.toUpperCase() === citizenId)) return s;

        const contact = s.contacts.find((c) => c.iban.includes(citizenId));
        const name =
          s.character.citizenId.toUpperCase() === citizenId
            ? `${s.character.firstName} ${s.character.lastName}`.trim()
            : contact?.name ?? "Unknown Citizen";

        const member = {
          id: memberUid(),
          name,
          citizenId,
          role: args.role,
          addedAt: Date.now(),
        };

        const sharedMembers = [...roster, member];
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === accountId ? { ...a, sharedMembers, members: sharedMembers.length } : a,
          ),
        };
      });
      void fetchNui("addSharedMember", { accountId, citizenId, role: args.role });
      notifyBankingSuccess("Member added");
    },
    [],
  );

  const updateSharedMemberRole = useCallback(
    (accountId: string, memberId: string, role: SharedMemberRole) => {
      setState((s) => {
        const account = s.accounts.find((a) => a.id === accountId);
        if (!account || account.kind !== "shared") return s;

        const roster = account.sharedMembers ?? [];
        const target = roster.find((m) => m.id === memberId);
        if (!target || target.role === role) return s;

        if (target.role === "owner" && role !== "owner" && countSharedOwners(account) <= 1) {
          return s;
        }

        const sharedMembers = roster.map((m) => (m.id === memberId ? { ...m, role } : m));
        return {
          ...s,
          accounts: s.accounts.map((a) => (a.id === accountId ? { ...a, sharedMembers } : a)),
        };
      });
      void fetchNui("updateSharedMember", { accountId, memberId, role });
      notifyBankingSuccess("Member role updated");
    },
    [],
  );

  const removeSharedMember = useCallback((accountId: string, memberId: string) => {
    setState((s) => {
      const account = s.accounts.find((a) => a.id === accountId);
      if (!account || account.kind !== "shared") return s;

      const roster = account.sharedMembers ?? [];
      const target = roster.find((m) => m.id === memberId);
      if (!target) return s;

      if (target.role === "owner" && countSharedOwners(account) <= 1) return s;

      const sharedMembers = roster.filter((m) => m.id !== memberId);
      return {
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === accountId ? { ...a, sharedMembers, members: sharedMembers.length } : a,
        ),
      };
    });
    void fetchNui("removeSharedMember", { accountId, memberId });
    notifyBankingSuccess("Member removed");
  }, []);

  const setBankTheme = useCallback((theme: BankTheme) => {
    setState((s) => ({ ...s, bankTheme: theme }));
    localStorage.setItem("banking-theme", theme);
    applyBankTheme(theme);
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
    const activeAccount =
      state.accounts.find((a) => a.id === state.activeAccountId) ?? state.accounts[0];
    return {
      ...state,
      activeAccount,
      setView,
      close,
      switchAccount,
      deposit,
      withdraw,
      issueVirtualCard,
      updateVirtualCard,
      applyForLoan,
      transfer,
      requestPayment,
      payInvoice,
      ensureMobileTestInvoice,
      setTransactionSearch,
      clearTransactionSearch,
      saveContact,
      deleteContact,
      toggleContactFavorite,
      updateSocietyLimits,
      addSharedMember,
      updateSharedMemberRole,
      removeSharedMember,
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
    close,
    switchAccount,
    deposit,
    withdraw,
    issueVirtualCard,
    updateVirtualCard,
    applyForLoan,
    transfer,
    requestPayment,
    payInvoice,
    ensureMobileTestInvoice,
    setTransactionSearch,
    clearTransactionSearch,
    saveContact,
    deleteContact,
    toggleContactFavorite,
    updateSocietyLimits,
    addSharedMember,
    updateSharedMemberRole,
    removeSharedMember,
    setBankTheme,
    transfersPanel,
    transferMode,
    openTransfersHistory,
    openTransfersSend,
  ]);

  if (typeof window !== "undefined") {
    (window as unknown as { __bankingPushTx?: typeof pushTx }).__bankingPushTx = pushTx;
    (window as unknown as { __bankingContactUid?: typeof contactUid }).__bankingContactUid = contactUid;
    (window as unknown as { __bankingEnsureMobileTestInvoice?: typeof ensureMobileTestInvoice }).__bankingEnsureMobileTestInvoice =
      ensureMobileTestInvoice;
  }

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>;
}

export function useBanking() {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error("useBanking must be used within BankingProvider");
  return ctx;
}

export function createContactId(): string {
  return `c_${Math.random().toString(36).slice(2, 10)}`;
}
