import { useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import { DashboardCardPanel } from "../components/dashboard/DashboardCardPanel";
import { GlassCard } from "../components/GlassCard";
import { SummaryMetricCard } from "../components/SummaryMetricCard";
import { TransactionRow } from "../components/TransactionRow";
import { SectionHeader } from "../components/SectionHeader";
import { TransactionChart } from "../components/TransactionChart";
import { AccountDistributionChart } from "../components/AccountDistributionChart";
import { PanelScroll } from "../components/PanelScroll";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";
import { computeDashboardMetrics } from "../utils/dashboardMetrics";

export function DashboardView() {
  const {
    activeAccount,
    accounts,
    cards,
    cashOnHand,
    character,
    transactions,
    openTransfersHistory,
    openTransfersSend,
  } = useBanking();

  const metrics = useMemo(
    () => computeDashboardMetrics(transactions, activeAccount.id, 30),
    [transactions, activeAccount.id],
  );

  const totalWealth = useMemo(
    () => accounts.reduce((sum, a) => sum + a.balance, 0) + cashOnHand,
    [accounts, cashOnHand],
  );

  const holderName = `${character.firstName} ${character.lastName}`.trim();

  const accountVirtualCards = useMemo(
    () => cards.filter((c) => c.accountId === activeAccount.id),
    [cards, activeAccount.id],
  );

  const activity = useMemo(
    () => transactions.filter((t) => t.accountId === activeAccount.id).slice(0, 50),
    [transactions, activeAccount.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="grid shrink-0 grid-cols-4 gap-3">
        <SummaryMetricCard
          label="Total Wealth"
          value={formatMoney(totalWealth)}
          subtitle={`${accounts.length} accounts + cash`}
          icon={<Wallet className="h-3.5 w-3.5" />}
        />
        <SummaryMetricCard
          label="Cash on Hand"
          value={formatMoney(cashOnHand)}
          subtitle="Wallet balance"
          icon={<PiggyBank className="h-3.5 w-3.5" />}
        />
        <SummaryMetricCard
          label="Incoming"
          value={formatMoney(metrics.incoming)}
          subtitle="30d window"
          subtitleTone="up"
          icon={<ArrowDownLeft className="h-3.5 w-3.5" />}
        />
        <SummaryMetricCard
          label="Outgoing"
          value={formatMoney(metrics.outgoing)}
          subtitle={`${metrics.txCount} transactions`}
          subtitleTone="down"
          icon={<ArrowUpRight className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-12 gap-3">
          <DashboardCardPanel
            accountId={activeAccount.id}
            holderName={holderName}
            iban={activeAccount.iban}
            balance={activeAccount.balance}
            virtualCards={accountVirtualCards}
            onDeposit={() => openTransfersSend("deposit")}
            onWithdraw={() => openTransfersSend("withdraw")}
          />

          <GlassCard className="col-span-5 flex h-full min-h-0 flex-col overflow-hidden p-4">
            <TransactionChart />
          </GlassCard>
          <GlassCard className="col-span-3 flex h-full min-h-0 flex-col overflow-hidden p-4">
            <AccountDistributionChart />
          </GlassCard>
        </div>
      </div>

      <GlassCard className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="shrink-0">
          <SectionHeader
            compact
            title="Recent Transactions"
            subtitle="Latest activity on this account"
            action={
              <button
                type="button"
                onClick={openTransfersHistory}
                className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:text-white"
              >
                View All
              </button>
            }
          />
        </div>
        <PanelScroll className="min-h-0 flex-1">
          {activity.length === 0 ? (
            <div className="py-4 text-center text-sm text-white/40">No transactions yet.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {activity.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} variant="dashboard" compact />
              ))}
            </div>
          )}
        </PanelScroll>
      </GlassCard>
    </div>
  );
}
