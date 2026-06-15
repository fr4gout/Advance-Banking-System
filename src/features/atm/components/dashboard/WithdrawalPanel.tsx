import { AmountDisplay } from "./AmountDisplay";
import { QuickAmountGrid } from "./QuickAmountGrid";
import { WithdrawButton } from "./WithdrawButton";

interface WithdrawalPanelProps {
  amount: number;
  balance: number;
  atmLimit: number;
  isLoading: boolean;
  onQuickAmount: (amount: number) => void;
  onMax: () => void;
  onClear: () => void;
  onWithdraw: () => void;
}

export function WithdrawalPanel({
  amount,
  balance,
  atmLimit,
  isLoading,
  onQuickAmount,
  onMax,
  onClear,
  onWithdraw,
}: WithdrawalPanelProps) {
  const isValid =
    amount > 0 && amount <= balance && amount <= atmLimit;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--tx-2)]">
        Withdrawal Center
      </h2>
      <AmountDisplay amount={amount} />
      <QuickAmountGrid
        onSelect={onQuickAmount}
        onMax={onMax}
        onClear={onClear}
      />
      {amount > balance && (
        <p className="text-sm text-[var(--c-red)]">Insufficient balance</p>
      )}
      {amount > atmLimit && (
        <p className="text-sm text-[var(--c-red)]">Exceeds ATM limit</p>
      )}
      <WithdrawButton
        onClick={onWithdraw}
        disabled={!isValid}
        loading={isLoading}
      />
    </div>
  );
}
