import { GlassCard } from "../GlassCard";
import { formatMoney } from "../../hooks/useCurrency";
import type { TransferMode } from "../../utils/transferLimits";
import { TRANSFER_LIMIT } from "../../utils/transferLimits";

interface TransferSummaryPanelProps {
  mode: TransferMode;
  toLabel: string;
  amount: number;
  limit: number;
  className?: string;
}

const MODE_LABELS: Record<TransferMode, string> = {
  deposit: "Deposit",
  withdraw: "Withdraw",
  transfer: "Transfer",
};

export function TransferSummaryPanel({ mode, toLabel, amount, limit, className }: TransferSummaryPanelProps) {
  const limitDisplay = mode === "transfer" ? Math.min(limit, TRANSFER_LIMIT) : limit;

  return (
    <GlassCard className={className} inset>
      <div className="flex h-full min-h-0 flex-col">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Summary</div>

        <div className="mt-4 flex flex-1 flex-col gap-3 text-xs">
          <SummaryRow label="Mode" value={MODE_LABELS[mode]} />
          <SummaryRow label="To" value={toLabel} />
          <SummaryRow label="Subtotal" value={formatMoney(amount)} mono />
          <SummaryRow label="Limit" value={formatMoney(limitDisplay)} mono />
        </div>

        <div className="mt-auto radius-card border border-white/10 bg-black/30 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Total</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-white">{formatMoney(amount)}</div>
        </div>
      </div>
    </GlassCard>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</span>
      <span className={mono ? "font-mono font-medium text-white" : "font-medium text-white"}>{value}</span>
    </div>
  );
}
