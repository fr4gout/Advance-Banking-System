import { useCallback } from "react";
import type {
  BankingState,
  Contact,
  SharedMemberRole,
  VirtualCardDesign,
  VirtualCardStatus,
} from "../types/banking";
import { fetchNui, isNuiFailureResult } from "../nui/bridge";
import { getLoanEligibility } from "../utils/loanEligibility";
import { notifyBankingSuccess } from "../utils/bankingNotify";
import { countSharedOwners } from "../utils/sharedAccount";
import { formatMoney } from "@/lib/currency";

const uid = () => `tx_${Math.random().toString(36).slice(2, 10)}`;
const cardUid = () => `card_${Math.random().toString(36).slice(2, 10)}`;
const loanUid = () => `loan_${Math.random().toString(36).slice(2, 10)}`;
const memberUid = () => `sm_${Math.random().toString(36).slice(2, 10)}`;
const SOCIETY_LIMIT_MAX = 10_000_000;

export function useBankingMutations(
  setState: React.Dispatch<React.SetStateAction<BankingState>>,
) {
  const switchAccount = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, activeAccountId: id }));
      void fetchNui("switchAccount", { id });
    },
    [setState],
  );

  const deposit = useCallback(
    async (amount: number) => {
      if (amount <= 0) return;
      let snapshot: BankingState | null = null;
      setState((s) => {
        if (amount > s.cashOnHand) return s;
        snapshot = s;
        return {
          ...s,
          cashOnHand: s.cashOnHand - amount,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId
              ? { ...a, balance: a.balance + amount }
              : a,
          ),
          transactions: [
            {
              id: uid(),
              accountId: s.activeAccountId,
              type: "deposit",
              amount,
              label: "Cash Deposit",
              counterparty: "Branch",
              timestamp: Date.now(),
            },
            ...s.transactions,
          ],
        };
      });
      if (!snapshot) return;
      const result = await fetchNui("deposit", { amount });
      if (isNuiFailureResult(result)) {
        setState(snapshot);
        return;
      }
      notifyBankingSuccess(`Deposited ${formatMoney(amount)}`);
    },
    [setState],
  );

  const withdraw = useCallback(
    async (amount: number) => {
      if (amount <= 0) return;
      let snapshot: BankingState | null = null;
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (!acc || amount > acc.balance) return s;
        snapshot = s;
        return {
          ...s,
          cashOnHand: s.cashOnHand + amount,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId
              ? { ...a, balance: a.balance - amount }
              : a,
          ),
          transactions: [
            {
              id: uid(),
              accountId: s.activeAccountId,
              type: "withdraw",
              amount,
              label: "ATM Withdrawal",
              counterparty: "Branch",
              timestamp: Date.now(),
            },
            ...s.transactions,
          ],
        };
      });
      if (!snapshot) return;
      const result = await fetchNui("withdraw", { amount });
      if (isNuiFailureResult(result)) {
        setState(snapshot);
        return;
      }
      notifyBankingSuccess(`Withdrew ${formatMoney(amount)}`);
    },
    [setState],
  );

  const transfer = useCallback(
    async ({
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
      if (amount <= 0 || (!toIban && !citizenId)) return;
      let snapshot: BankingState | null = null;
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (!acc || amount > acc.balance) return s;
        snapshot = s;
        const counterparty =
          contactName ?? (citizenId ? `Citizen ${citizenId}` : toIban);
        const label = contactName
          ? `To ${contactName}`
          : citizenId
            ? `To Citizen ${citizenId}`
            : `To ${toIban}`;
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId
              ? { ...a, balance: a.balance - amount }
              : a,
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
      if (!snapshot) return;
      const result = await fetchNui("transfer", {
        toIban,
        citizenId,
        amount,
        note,
      });
      if (isNuiFailureResult(result)) {
        setState(snapshot);
        return;
      }
      notifyBankingSuccess(`Transfer sent — ${formatMoney(amount)}`);
    },
    [setState],
  );

  const payInvoice = useCallback(
    async (id: string) => {
      let snapshot: BankingState | null = null;
      setState((s) => {
        const invoice = s.invoices.find((i) => i.id === id);
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (
          !invoice ||
          invoice.status === "paid" ||
          !acc ||
          acc.balance < invoice.amount
        )
          return s;
        snapshot = s;
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId
              ? { ...a, balance: a.balance - invoice.amount }
              : a,
          ),
          invoices: s.invoices.map((i) =>
            i.id === id ? { ...i, status: "paid" as const } : i,
          ),
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
      if (!snapshot) return;
      const result = await fetchNui("payInvoice", { id });
      if (isNuiFailureResult(result)) {
        setState(snapshot);
        return;
      }
      notifyBankingSuccess("Invoice paid");
    },
    [setState],
  );

  const issueVirtualCard = useCallback(
    (args: { accountId: string; pin: string; design: VirtualCardDesign }) => {
      const pin = args.pin.trim();
      if (!/^\d{4}$/.test(pin)) return;

      setState((s) => {
        const account = s.accounts.find((a) => a.id === args.accountId);
        if (!account) return s;

        const holderName =
          `${s.character.firstName} ${s.character.lastName}`.trim();
        const last4 = String(Math.floor(Math.random() * 10_000)).padStart(
          4,
          "0",
        );
        const next = {
          id: cardUid(),
          accountId: args.accountId,
          holderName,
          maskedPan: `**** **** **** ${last4}`,
          last4,
          expiresAt: "06/30",
          design: args.design,
          status: "active" as const,
          spendingLimit: 25_000,
          createdAt: Date.now(),
        };

        return { ...s, cards: [next, ...s.cards] };
      });
      void fetchNui("issueVirtualCard", {
        accountId: args.accountId,
        pin: args.pin,
        design: args.design,
      });
      notifyBankingSuccess("Virtual card issued");
    },
    [setState],
  );

  const updateVirtualCard = useCallback(
    (args: {
      cardId: string;
      status?: VirtualCardStatus;
      spendingLimit?: number;
    }) => {
      setState((s) => {
        const card = s.cards.find((c) => c.id === args.cardId);
        if (!card) return s;
        const updated = s.cards.map((c) =>
          c.id === args.cardId
            ? {
                ...c,
                ...(args.status !== undefined ? { status: args.status } : {}),
                ...(args.spendingLimit !== undefined
                  ? { spendingLimit: args.spendingLimit }
                  : {}),
              }
            : c,
        );
        return { ...s, cards: updated };
      });
      void fetchNui("updateCard", args);
      if (args.status === "frozen") notifyBankingSuccess("Card frozen");
      else if (args.status === "active") notifyBankingSuccess("Card unfrozen");
    },
    [setState],
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

        return {
          ...s,
          activeLoans: [
            {
              id: loanUid(),
              accountId,
              productId,
              principal: amount,
              apr: product.apr,
              termDays: product.termDays,
              issuedAt: Date.now(),
              status: "open" as const,
            },
            ...s.activeLoans,
          ],
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
      notifyBankingSuccess(`Loan approved — ${formatMoney(amount)}`);
    },
    [setState],
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
      if (amount <= 0 || !reason.trim() || (!toIban && !citizenId)) return;
      void fetchNui("requestPayment", {
        toIban,
        citizenId,
        amount,
        reason,
        contactName,
      });
      const recipient =
        contactName ??
        (citizenId ? `Citizen ${citizenId}` : (toIban ?? "recipient"));
      notifyBankingSuccess(`Payment request sent to ${recipient}`);
    },
    [],
  );

  const saveContact = useCallback(
    (contact: Contact) => {
      setState((s) => {
        const exists = s.contacts.some((c) => c.id === contact.id);
        const contacts = exists
          ? s.contacts.map((c) => (c.id === contact.id ? contact : c))
          : [...s.contacts, contact];
        return { ...s, contacts };
      });
      void fetchNui("saveContact", contact);
    },
    [setState],
  );

  const deleteContact = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        contacts: s.contacts.filter((c) => c.id !== id),
      }));
      void fetchNui("saveContact", { id, deleted: true });
    },
    [setState],
  );

  const toggleContactFavorite = useCallback(
    (id: string) => {
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
    },
    [setState],
  );

  const updateSocietyLimits = useCallback(
    (
      accountId: string,
      limits: { withdrawLimit: number; depositLimit: number },
    ) => {
      if (limits.withdrawLimit < 1 || limits.depositLimit < 1) return;
      if (
        limits.withdrawLimit > SOCIETY_LIMIT_MAX ||
        limits.depositLimit > SOCIETY_LIMIT_MAX
      )
        return;

      setState((s) => ({
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === accountId
            ? {
                ...a,
                withdrawLimit: limits.withdrawLimit,
                depositLimit: limits.depositLimit,
              }
            : a,
        ),
      }));
      void fetchNui("updateSocietyLimits", { accountId, ...limits });
    },
    [setState],
  );

  const addSharedMember = useCallback(
    (
      accountId: string,
      args: { citizenId: string; role: SharedMemberRole },
    ) => {
      const citizenId = args.citizenId.trim().toUpperCase();
      if (!citizenId) return;

      setState((s) => {
        const account = s.accounts.find((a) => a.id === accountId);
        if (!account || account.kind !== "shared") return s;

        const roster = account.sharedMembers ?? [];
        if (roster.some((m) => m.citizenId.toUpperCase() === citizenId))
          return s;

        const contact = s.contacts.find((c) => c.iban.includes(citizenId));
        const name =
          s.character.citizenId.toUpperCase() === citizenId
            ? `${s.character.firstName} ${s.character.lastName}`.trim()
            : (contact?.name ?? "Unknown Citizen");

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
            a.id === accountId
              ? { ...a, sharedMembers, members: sharedMembers.length }
              : a,
          ),
        };
      });
      void fetchNui("addSharedMember", {
        accountId,
        citizenId,
        role: args.role,
      });
      notifyBankingSuccess("Member added");
    },
    [setState],
  );

  const updateSharedMemberRole = useCallback(
    (accountId: string, memberId: string, role: SharedMemberRole) => {
      setState((s) => {
        const account = s.accounts.find((a) => a.id === accountId);
        if (!account || account.kind !== "shared") return s;

        const roster = account.sharedMembers ?? [];
        const target = roster.find((m) => m.id === memberId);
        if (!target || target.role === role) return s;
        if (
          target.role === "owner" &&
          role !== "owner" &&
          countSharedOwners(account) <= 1
        )
          return s;

        const sharedMembers = roster.map((m) =>
          m.id === memberId ? { ...m, role } : m,
        );
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === accountId ? { ...a, sharedMembers } : a,
          ),
        };
      });
      void fetchNui("updateSharedMember", { accountId, memberId, role });
      notifyBankingSuccess("Member role updated");
    },
    [setState],
  );

  const removeSharedMember = useCallback(
    (accountId: string, memberId: string) => {
      setState((s) => {
        const account = s.accounts.find((a) => a.id === accountId);
        if (!account || account.kind !== "shared") return s;

        const roster = account.sharedMembers ?? [];
        const target = roster.find((m) => m.id === memberId);
        if (!target) return s;
        if (target.role === "owner" && countSharedOwners(account) <= 1)
          return s;

        const sharedMembers = roster.filter((m) => m.id !== memberId);
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === accountId
              ? { ...a, sharedMembers, members: sharedMembers.length }
              : a,
          ),
        };
      });
      void fetchNui("removeSharedMember", { accountId, memberId });
      notifyBankingSuccess("Member removed");
    },
    [setState],
  );

  return {
    switchAccount,
    deposit,
    withdraw,
    transfer,
    payInvoice,
    issueVirtualCard,
    updateVirtualCard,
    applyForLoan,
    requestPayment,
    saveContact,
    deleteContact,
    toggleContactFavorite,
    updateSocietyLimits,
    addSharedMember,
    updateSharedMemberRole,
    removeSharedMember,
  };
}
