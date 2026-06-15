import { CardStatus } from "../components/cards/CardStatus";
import { BalanceCard } from "../components/dashboard/BalanceCard";
import { WithdrawalPanel } from "../components/dashboard/WithdrawalPanel";
import { notifyBankingError, notifyBankingSuccess } from "@/features/banking/utils/bankingNotify";
import { formatCurrency } from "../utils/currency";
import { useATM } from "../hooks/useATM";

export function DashboardView() {
  const {
    balance,
    atmLimit,
    withdrawAmount,
    accountType,
    lastAccessTime,
    isLoading,
    addQuickAmount,
    setMaxWithdraw,
    clearWithdrawAmount,
    withdraw,
  } = useATM();

  const handleWithdraw = async () => {
    if (withdrawAmount <= 0) return;
    if (withdrawAmount > balance) {
      notifyBankingError("Insufficient balance");
      return;
    }
    if (withdrawAmount > atmLimit) {
      notifyBankingError("Amount exceeds ATM limit");
      return;
    }

    const amount = withdrawAmount;
    await withdraw();
    notifyBankingSuccess(`Successfully withdrew ${formatCurrency(amount)}`);
  };

  return (
    <div className="view-transition flex flex-col gap-4 p-4">
      <WithdrawalPanel
        amount={withdrawAmount}
        balance={balance}
        atmLimit={atmLimit}
        isLoading={isLoading}
        onQuickAmount={addQuickAmount}
        onMax={setMaxWithdraw}
        onClear={clearWithdrawAmount}
        onWithdraw={() => void handleWithdraw()}
      />

      <BalanceCard balance={balance} />

      <div className="panel-card flex flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-[var(--tx-2)]">Account Type</span>
          <span className="font-medium text-[var(--tx)]">{accountType}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-[var(--tx-2)]">ATM Limit</span>
          <span className="font-medium text-primary">{formatCurrency(atmLimit)}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-[var(--tx-2)]">Card Status</span>
          <CardStatus unlocked />
        </div>
        {lastAccessTime ? (
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-[var(--tx-2)]">Last Access</span>
            <span className="text-[var(--tx)]">{lastAccessTime}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
