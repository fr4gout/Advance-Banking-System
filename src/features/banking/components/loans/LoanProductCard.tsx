import { Building2, Calendar, Car, Lock, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "../../hooks/useCurrency";
import type { LoanProduct } from "../../types/banking";
import type { LoanEligibility } from "../../utils/loanEligibility";

const iconFor: Record<LoanProduct["icon"], React.ComponentType<{ className?: string }>> = {
  wallet: Wallet,
  calendar: Calendar,
  car: Car,
  building: Building2,
};

interface LoanProductCardProps {
  product: LoanProduct;
  eligibility: LoanEligibility;
  onApply?: () => void;
}

export function LoanProductCard({ product, eligibility, onApply }: LoanProductCardProps) {
  const locked = !eligibility.eligible;
  const preApproved = eligibility.effectiveStatus === "pre_approved";
  const Icon = iconFor[product.icon];

  return (
    <div
      className={cn(
        "flex h-full min-h-[168px] flex-col radius-control border bg-black/25 p-3.5 transition",
        locked
          ? "border-white/5 opacity-55"
          : preApproved
            ? "border-primary/30 shadow-[0_0_12px_rgba(var(--primary-rgb,99,102,241),0.12)]"
            : "border-white/8 hover:border-primary/25",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center radius-chip",
            locked ? "bg-white/5 text-white/30" : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        {preApproved ? (
          <span className="radius-chip bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground">
            Pre-approved
          </span>
        ) : null}
      </div>

      <h4 className="mt-2 truncate text-sm font-semibold text-white">{product.name}</h4>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/40">{product.description}</p>

      <div className="mt-auto pt-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/50">
          <span>
            {formatMoney(product.minAmount)} – {formatMoney(product.maxAmount)}
          </span>
          <span>{product.apr}% APR</span>
          <span>{product.termDays}d</span>
        </div>

        {locked ? (
          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-rose-300">
            <Lock className="h-3 w-3 shrink-0" />
            <span className="truncate">{eligibility.lockReason ?? "LOCKED"}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onApply}
            className="mt-2 inline-flex h-8 w-full items-center justify-center radius-control border border-primary/40 bg-primary/10 text-[9px] font-bold uppercase tracking-wider text-primary transition hover:bg-primary/20"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
