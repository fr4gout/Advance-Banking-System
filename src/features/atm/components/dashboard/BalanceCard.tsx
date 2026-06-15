import { AnimatedCounter } from "../shared/AnimatedCounter";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="panel-card p-4">
      <p className="text-xs uppercase tracking-wider text-[var(--tx-2)]">Available Balance</p>
      <p className="mt-2 text-3xl font-bold text-[var(--tx)]">
        <AnimatedCounter value={balance} />
      </p>
    </div>
  );
}
