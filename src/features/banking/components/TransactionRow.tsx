import { ArrowDownLeft, ArrowUpRight, Banknote, Briefcase, FileText, ReceiptText, ShoppingBag, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoneySigned, formatRelative } from "../hooks/useCurrency";
import type { Transaction } from "../types/banking";

const negativeTypes: Transaction["type"][] = ["withdraw", "transfer_out", "invoice", "purchase"];

const iconFor: Record<Transaction["type"], React.ComponentType<{ className?: string }>> = {
  deposit: Wallet,
  withdraw: ArrowUpRight,
  transfer_in: ArrowDownLeft,
  transfer_out: ArrowUpRight,
  invoice: FileText,
  salary: Briefcase,
  purchase: ShoppingBag,
  loan: Banknote,
};

const typeLabel: Record<Transaction["type"], string> = {
  deposit: "DEPOSIT",
  withdraw: "WITHDRAW",
  transfer_in: "TRANSFER IN",
  transfer_out: "TRANSFER OUT",
  invoice: "INVOICE",
  salary: "SALARY",
  purchase: "PURCHASE",
  loan: "LOAN",
};

export function TransactionRow({
  tx,
  showNote = false,
  variant = "default",
  compact = false,
}: {
  tx: Transaction;
  showNote?: boolean;
  variant?: "default" | "dashboard";
  compact?: boolean;
}) {
  const negative = negativeTypes.includes(tx.type);
  const signed = (negative ? -1 : 1) * tx.amount;
  const Icon = iconFor[tx.type] ?? ReceiptText;

  if (variant === "dashboard") {
    return (
      <div
        className={cn(
          "panel-card grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-3",
          compact ? "py-2" : "py-3",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center radius-chip",
            compact ? "h-9 w-9" : "h-11 w-11",
            negative ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300",
          )}
        >
          <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-snug text-[var(--tx)]">{tx.label}</div>
          <div className="truncate text-xs leading-snug text-[var(--tx-2)]">{tx.counterparty ?? "—"}</div>
        </div>
        <span
          className={cn(
            "shrink-0 justify-self-end radius-chip px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
            negative
              ? "bg-rose-500/10 text-rose-300"
              : "bg-emerald-500/10 text-emerald-300",
          )}
        >
          {typeLabel[tx.type]}
        </span>
        <div className="shrink-0 justify-self-end text-right">
          <div
            className={cn(
              "text-sm font-bold tabular-nums",
              negative ? "text-[var(--tx)]" : "text-emerald-400",
            )}
          >
            {formatMoneySigned(signed)}
          </div>
          <div className="text-[10px] tabular-nums text-[var(--tx-3)]">{formatRelative(tx.timestamp)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 radius-control px-3 py-2.5 transition hover:bg-[var(--bg-row)]">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          negative ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-[var(--tx)]">{tx.label}</div>
        <div className="truncate text-xs text-[var(--tx-2)]">
          {tx.counterparty ?? "—"} · {formatRelative(tx.timestamp)}
        </div>
        {showNote && tx.note ? (
          <div className="mt-0.5 truncate text-[11px] italic text-[var(--tx-3)]">{tx.note}</div>
        ) : null}
      </div>
      <div className={cn("text-sm font-semibold tabular-nums", negative ? "text-[var(--tx)]" : "text-emerald-400")}>
        {formatMoneySigned(signed)}
      </div>
    </div>
  );
}
