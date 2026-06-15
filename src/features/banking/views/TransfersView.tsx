import { useEffect, useMemo, useState } from "react";
import { ContactFormModal } from "../components/ContactFormModal";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { TransferActionBar } from "../components/transfer/TransferActionBar";
import { TransferFormPanel } from "../components/transfer/TransferFormPanel";
import { TransferModeTabs } from "../components/transfer/TransferModeTabs";
import { TransferSummaryPanel } from "../components/transfer/TransferSummaryPanel";
import type { RecipientMode } from "../components/transfer/TransferRecipientChips";
import { HistorySummaryStrip } from "../components/history/HistorySummaryStrip";
import { HistoryTable } from "../components/history/HistoryTable";
import { HistoryToolbar } from "../components/history/HistoryToolbar";
import type { HistoryTypeFilter } from "../components/history/historyTypes";
import { useBanking } from "../context/BankingContext";
import type { Contact } from "../types/banking";
import { formatMoneySigned } from "../hooks/useCurrency";
import {
  getLimitForMode,
  isCitizenIdValid,
  TRANSFER_LIMIT,
  type TransferMode,
} from "../utils/transferLimits";

export function TransfersView() {
  const {
    contacts,
    activeAccount,
    cashOnHand,
    deposit,
    withdraw,
    transfer,
    transactions,
    transfersPanel,
    transferMode,
  } = useBanking();

  const [mode, setMode] = useState<TransferMode>(transferMode);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>(null);
  const [citizenId, setCitizenId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const [historyQuery, setHistoryQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState<HistoryTypeFilter>("all");

  useEffect(() => {
    if (transfersPanel !== "send") return;
    setMode(transferMode);
    setAmount(0);
    setNote("");
    if (transferMode !== "transfer") {
      setRecipientMode(null);
      setSelectedContact(null);
      setCitizenId("");
    }
  }, [transferMode, transfersPanel]);

  const accountHistory = useMemo(
    () => transactions.filter((t) => t.accountId === activeAccount.id),
    [transactions, activeAccount.id],
  );

  const baseHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return accountHistory;
    return accountHistory.filter((tx) => {
      const haystack = [tx.label, tx.counterparty, tx.note].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [accountHistory, historyQuery]);

  const historyRows = useMemo(() => {
    if (historyFilter === "all") return baseHistory;
    if (historyFilter === "deposit") return baseHistory.filter((tx) => tx.type === "deposit");
    if (historyFilter === "withdraw") return baseHistory.filter((tx) => tx.type === "withdraw");
    if (historyFilter === "transfer_in") return baseHistory.filter((tx) => tx.type === "transfer_in");
    if (historyFilter === "transfer_out") return baseHistory.filter((tx) => tx.type === "transfer_out");
    return baseHistory;
  }, [baseHistory, historyFilter]);

  const totalIn = useMemo(
    () => baseHistory.filter((t) => t.type === "transfer_in" || t.type === "deposit").reduce((s, t) => s + t.amount, 0),
    [baseHistory],
  );
  const totalOut = useMemo(
    () =>
      baseHistory
        .filter((t) => t.type === "transfer_out" || t.type === "withdraw" || t.type === "invoice" || t.type === "purchase")
        .reduce((s, t) => s + t.amount, 0),
    [baseHistory],
  );

  const limit = getLimitForMode(mode, cashOnHand, activeAccount.balance);

  const fromLabel = mode === "deposit" ? "Cash on Hand" : activeAccount.name;
  const fromBalance = mode === "deposit" ? cashOnHand : activeAccount.balance;

  const toLabel = useMemo(() => {
    if (mode === "deposit") return activeAccount.name;
    if (mode === "withdraw") return "Cash";
    if (recipientMode === "contact" && selectedContact) return selectedContact.name;
    if (recipientMode === "citizenId" && citizenId.trim()) return citizenId.trim();
    return "—";
  }, [mode, activeAccount.name, recipientMode, selectedContact, citizenId]);

  const formValid = useMemo(() => {
    if (amount <= 0 || amount > limit) return false;
    if (mode === "deposit") return amount <= cashOnHand;
    if (mode === "withdraw") return amount <= activeAccount.balance;
    if (amount > activeAccount.balance || amount > TRANSFER_LIMIT) return false;
    if (recipientMode === "contact" && selectedContact) return true;
    if (recipientMode === "citizenId" && isCitizenIdValid(citizenId)) return true;
    return false;
  }, [amount, limit, mode, cashOnHand, activeAccount.balance, recipientMode, selectedContact, citizenId]);

  const pickContact = (c: Contact) => {
    setSelectedContact(c);
    setRecipientMode("contact");
    setCitizenId("");
  };

  const pickCitizenId = () => {
    setRecipientMode("citizenId");
    setSelectedContact(null);
  };

  const handleModeChange = (next: TransferMode) => {
    setMode(next);
    setAmount(0);
    setNote("");
    if (next !== "transfer") {
      setRecipientMode(null);
      setSelectedContact(null);
      setCitizenId("");
    }
  };

  const submit = () => {
    if (!formValid) return;
    if (mode === "deposit") {
      deposit(amount);
    } else if (mode === "withdraw") {
      withdraw(amount);
    } else if (recipientMode === "contact" && selectedContact) {
      transfer({
        toIban: selectedContact.iban,
        amount,
        note: note || undefined,
        contactName: selectedContact.name,
      });
    } else if (recipientMode === "citizenId" && isCitizenIdValid(citizenId)) {
      transfer({
        citizenId: citizenId.trim(),
        amount,
        note: note || undefined,
      });
    } else {
      return;
    }
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2200);
    setAmount(0);
    setNote("");
  };

  if (transfersPanel === "history") {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3">
        <GlassCard className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          <div className="shrink-0 space-y-3">
            <SectionHeader
              title="History"
              subtitle={`${historyRows.length} matching transactions`}
              action={
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Net{" "}
                  <span className="font-mono tabular-nums text-white/70">
                    {formatMoneySigned(totalIn - totalOut)}
                  </span>
                </div>
              }
            />

            <HistoryToolbar
              query={historyQuery}
              onQueryChange={setHistoryQuery}
              filter={historyFilter}
              onFilterChange={setHistoryFilter}
            />

            <HistorySummaryStrip
              showing={historyRows.length}
              total={accountHistory.length}
              totalIn={totalIn}
              totalOut={totalOut}
            />
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-hidden">
            {historyRows.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-white/40">
                No transactions match your filters.
              </div>
            ) : (
              <HistoryTable rows={historyRows} className="h-full min-h-0" />
            )}
          </div>
        </GlassCard>
        <ContactFormModal open={contactModalOpen} onOpenChange={setContactModalOpen} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <TransferModeTabs mode={mode} onModeChange={handleModeChange} className="shrink-0" />

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(220px,280px)] gap-3">
        <TransferFormPanel
          className="min-h-0"
          mode={mode}
          fromLabel={fromLabel}
          fromBalance={fromBalance}
          amount={amount}
          maxAmount={limit}
          note={note}
          contacts={contacts}
          selectedContact={selectedContact}
          recipientMode={recipientMode}
          citizenId={citizenId}
          onAmountChange={setAmount}
          onNoteChange={setNote}
          onSelectContact={pickContact}
          onSelectCitizenId={pickCitizenId}
          onCitizenIdChange={setCitizenId}
          onAddContact={() => setContactModalOpen(true)}
        />
        <TransferSummaryPanel
          className="min-h-0"
          mode={mode}
          toLabel={toLabel}
          amount={amount}
          limit={limit}
        />
      </div>

      <TransferActionBar
        className="shrink-0"
        mode={mode}
        amount={amount}
        toLabel={toLabel}
        valid={formValid}
        onSubmit={submit}
      />

      {confirmed ? (
        <div className="shrink-0 radius-control bg-emerald-500/10 px-3 py-1.5 text-center text-[10px] text-emerald-300">
          {mode === "deposit"
            ? "Deposit successful."
            : mode === "withdraw"
              ? "Withdrawal successful."
              : "Transfer sent successfully."}
        </div>
      ) : null}

      <ContactFormModal open={contactModalOpen} onOpenChange={setContactModalOpen} />
    </div>
  );
}
