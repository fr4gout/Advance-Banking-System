import { formatCurrency } from "../../utils/currency";

interface AmountDisplayProps {
  amount: number;
}

export function AmountDisplay({ amount }: AmountDisplayProps) {
  return (
    <div className="radius-card border border-[var(--bd)] bg-[var(--bg-surface)] px-4 py-5 text-center">
      <p className="text-xs uppercase tracking-wider text-[var(--tx-2)]">Withdrawal Amount</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--tx)]">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
