import { ArrowDownLeft, ArrowUpRight, Banknote, Briefcase, FileText, ReceiptText, ShoppingBag, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoneySigned, formatRelative } from "../../hooks/useCurrency";
import type { Transaction } from "../../types/banking";

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

const negativeTypes: Transaction["type"][] = ["withdraw", "transfer_out", "invoice", "purchase"];

export function HistoryRow({ tx }: { tx: Transaction }) {
  const negative = negativeTypes.includes(tx.type);
  const signed = (negative ? -1 : 1) * tx.amount;
  const Icon = iconFor[tx.type] ?? ReceiptText;

  return (
    <div className="panel-card grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_100px_72px] items-center gap-4 px-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center radius-chip",
            negative ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[var(--tx)]">{tx.label}</div>
          <div className="truncate text-[11px] text-[var(--tx-3)]">{tx.note ?? "—"}</div>
        </div>
      </div>

      <div className="truncate text-sm text-[var(--tx-2)]">{tx.counterparty ?? "—"}</div>

      <div className="justify-self-start">
        <span
          className={cn(
            "inline-flex items-center radius-chip px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
            negative ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300",
          )}
        >
          {typeLabel[tx.type]}
        </span>
      </div>

      <div className={cn("text-right font-mono text-sm font-semibold tabular-nums", negative ? "text-rose-200" : "text-emerald-200")}>
        {formatMoneySigned(signed)}
      </div>

      <div className="text-right text-[11px] text-[var(--tx-3)]">{formatRelative(tx.timestamp)}</div>
    </div>
  );
}

