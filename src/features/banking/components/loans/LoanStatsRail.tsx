import { formatMoney } from "../../hooks/useCurrency";
import type { LoanTier } from "../../types/banking";
import { tierLabel } from "../../utils/loanEligibility";

interface LoanStatsRailProps {
  outstandingTotal: number;
  availableProductCount: number;
  tier: LoanTier;
}

export function LoanStatsRail({ outstandingTotal, availableProductCount, tier }: LoanStatsRailProps) {
  return (
    <div className="flex min-h-0 flex-col gap-2">
      <StatTile label="Outstanding" value={formatMoney(outstandingTotal)} />
      <StatTile label="Available Products" value={String(availableProductCount)} />
      <StatTile label="Tier" value={tierLabel(tier)} highlight />
    </div>
  );
}

function StatTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center radius-control border border-white/8 bg-black/30 px-3 py-3">
      <div className="text-[9px] font-medium uppercase tracking-widest text-white/35">{label}</div>
      <div
        className={
          highlight
            ? "mt-1 text-base font-bold uppercase tracking-wide text-primary"
            : "mt-1 text-base font-bold tabular-nums text-white"
        }
      >
        {value}
      </div>
    </div>
  );
}
