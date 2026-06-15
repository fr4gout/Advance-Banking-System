import { formatMoney } from "../../hooks/useCurrency";
import type { LoanProduct } from "../../types/banking";

interface FeaturedLoanPanelProps {
  product: LoanProduct;
  onApply: () => void;
}

export function FeaturedLoanPanel({ product, onApply }: FeaturedLoanPanelProps) {
  return (
    <div className="flex min-h-[180px] flex-col justify-between radius-control border border-[var(--bd-primary)] border-l-[3px] border-l-primary bg-[var(--bg-surface)] p-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="radius-chip bg-primary px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
            Pre-approved
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-[var(--tx)]">{product.name}</h3>
        <p className="mt-1 text-xs leading-snug text-[var(--tx-2)]">{product.description}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-5">
          <Stat label="Up to" value={formatMoney(product.maxAmount)} />
          <Stat label="APR" value={`${product.apr}%`} />
          <Stat label="Term" value={`${product.termDays}d`} />
        </div>

        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-9 shrink-0 items-center radius-control bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-medium uppercase tracking-widest text-[var(--tx-3)]">{label}</div>
      <div className="text-sm font-bold tabular-nums text-[var(--tx)]">{value}</div>
    </div>
  );
}
