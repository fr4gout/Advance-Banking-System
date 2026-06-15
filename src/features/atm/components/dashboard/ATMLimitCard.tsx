import { GlassCard } from "@/features/banking/components/GlassCard";
import { formatCurrency } from "../../utils/currency";

interface ATMLimitCardProps {
  atmLimit: number;
}

export function ATMLimitCard({ atmLimit }: ATMLimitCardProps) {
  return (
    <GlassCard inset>
      <p className="text-xs uppercase tracking-wider text-[var(--tx-2)]">
        ATM Limit
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">
        {formatCurrency(atmLimit)}
      </p>
    </GlassCard>
  );
}
