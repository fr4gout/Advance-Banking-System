import { Pencil } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { formatMoney } from "../../hooks/useCurrency";
import type { Contact } from "../../types/banking";
import type { TransferMode } from "../../utils/transferLimits";
import { TransferAmountHero } from "./TransferAmountHero";
import { TransferRecipientChips, type RecipientMode } from "./TransferRecipientChips";

interface TransferFormPanelProps {
  mode: TransferMode;
  fromLabel: string;
  fromBalance: number;
  amount: number;
  maxAmount: number;
  note: string;
  contacts: Contact[];
  selectedContact: Contact | null;
  recipientMode: RecipientMode;
  citizenId: string;
  onAmountChange: (amount: number) => void;
  onNoteChange: (note: string) => void;
  onSelectContact: (contact: Contact) => void;
  onSelectCitizenId: () => void;
  onCitizenIdChange: (id: string) => void;
  onAddContact: () => void;
  className?: string;
}

export function TransferFormPanel({
  mode,
  fromLabel,
  fromBalance,
  amount,
  maxAmount,
  note,
  contacts,
  selectedContact,
  recipientMode,
  citizenId,
  onAmountChange,
  onNoteChange,
  onSelectContact,
  onSelectCitizenId,
  onCitizenIdChange,
  onAddContact,
  className,
}: TransferFormPanelProps) {
  return (
    <GlassCard className={className} inset>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--bd)] pb-3">
          <div className="pt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--tx-2)]">From</div>
          <div className="min-w-0 text-right">
            <div className="truncate text-sm font-semibold leading-snug text-[var(--tx)]">{fromLabel}</div>
            <div className="text-sm font-bold leading-snug tabular-nums text-primary">{formatMoney(fromBalance)}</div>
          </div>
        </div>

        <TransferAmountHero amount={amount} onAmountChange={onAmountChange} max={maxAmount} />

        {mode === "transfer" ? (
          <>
            <TransferRecipientChips
              contacts={contacts}
              selectedContact={selectedContact}
              recipientMode={recipientMode}
              citizenId={citizenId}
              onSelectContact={onSelectContact}
              onSelectCitizenId={onSelectCitizenId}
              onCitizenIdChange={onCitizenIdChange}
              onAddContact={onAddContact}
            />

            <div className="shrink-0 space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--tx-2)]">
                Memo (optional)
              </div>
              <div className="flex items-center gap-2 radius-chip border border-[var(--bd)] bg-[var(--bg-surface)] px-3 py-2">
                <Pencil className="h-3.5 w-3.5 shrink-0 text-[var(--tx-2)]" />
                <input
                  value={note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Reference"
                  maxLength={60}
                  className="min-w-0 flex-1 bg-transparent text-xs text-[var(--tx)] outline-none placeholder:text-[var(--tx-3)]"
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </GlassCard>
  );
}
