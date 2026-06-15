import { useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Handshake,
  PiggyBank,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "../GlassCard";
import { SectionHeader } from "../SectionHeader";
import { PanelScroll } from "../PanelScroll";
import { SummaryMetricCard } from "../SummaryMetricCard";
import { TransactionRow } from "../TransactionRow";
import { SocietyAdminPanel } from "../SocietyAdminPanel";
import { SharedMembersPanel } from "../shared/SharedMembersPanel";
import { useBanking } from "../../context/BankingContext";
import { formatMoney, maskIban } from "../../hooks/useCurrency";
import type { Account } from "../../types/banking";
import { computeDashboardMetrics } from "../../utils/dashboardMetrics";
import { formatSharedRoleLabel, getSharedMemberForCharacter } from "../../utils/sharedAccount";
import { isSocietyAdmin } from "../../utils/society";

interface AccountDetailPanelProps {
  account: Account | null;
  className?: string;
}

export function AccountDetailPanel({ account, className }: AccountDetailPanelProps) {
  const { character, transactions, openTransfersHistory } = useBanking();

  const metrics = useMemo(
    () => (account ? computeDashboardMetrics(transactions, account.id, 30) : null),
    [transactions, account],
  );

  const activity = useMemo(
    () =>
      account
        ? transactions.filter((t) => t.accountId === account.id).slice(0, 10)
        : [],
    [transactions, account],
  );

  if (!account) {
    return (
      <GlassCard className={cn("flex min-h-0 flex-col items-center justify-center p-4", className)}>
        <div className="text-sm text-white/40">Select an account to view details.</div>
      </GlassCard>
    );
  }

  const showSocietyAdmin = account.kind === "society" && isSocietyAdmin(account);

  if (account.kind === "shared") {
    const myMembership = getSharedMemberForCharacter(account, character);

    return (
      <GlassCard className={cn("flex h-full min-h-0 flex-col overflow-hidden p-4", className)}>
        <div className="shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-[var(--tx)]">{account.name}</h2>
              {account.shortLabel ? (
                <span className="radius-chip border border-[var(--bd)] bg-[var(--bg-surface)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--tx-2)]">
                  {account.shortLabel}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 radius-chip border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                <Handshake className="h-3 w-3" />
                shared
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px] tracking-wider text-[var(--tx-2)]">{maskIban(account.iban)}</div>
          </div>

          <div className="mt-4 radius-card border border-[var(--bd)] bg-[var(--bg-surface)] px-4 py-3">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--tx-2)]">
              Available Balance
            </div>
            <div className="mt-0.5 text-3xl font-bold tabular-nums tracking-tight text-[var(--tx)]">
              {formatMoney(account.balance)}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <InfoCell label="IBAN" value={maskIban(account.iban)} mono />
            <InfoCell label="Account Type" value={account.shortLabel ?? "SHARED"} />
            <InfoCell
              label="Your Role"
              value={myMembership ? formatSharedRoleLabel(myMembership.role) : "—"}
            />
            <InfoCell
              label="Members"
              value={`${account.members ?? account.sharedMembers?.length ?? 0}`}
              icon={<Users className="h-3 w-3" />}
            />
          </div>
        </div>

        <SharedMembersPanel account={account} className="mt-4" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className={cn("flex h-full min-h-0 flex-col overflow-hidden p-4", className)}>
      <div className="shrink-0">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-white">{account.name}</h2>
            {account.shortLabel ? (
              <span className="radius-chip border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                {account.shortLabel}
              </span>
            ) : null}
            <span
              className={cn(
                "inline-flex items-center gap-1 radius-chip px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                account.kind === "society"
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/5 text-white/50",
              )}
            >
              {account.kind === "society" ? (
                <Building2 className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
              {account.kind}
            </span>
          </div>
          <div className="mt-1 font-mono text-[11px] tracking-wider text-white/40">{maskIban(account.iban)}</div>
        </div>

        <div className="mt-4 radius-card border border-white/5 bg-black/20 px-4 py-3">
          <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">Available Balance</div>
          <div className="mt-0.5 text-3xl font-bold tabular-nums tracking-tight text-white">
            {formatMoney(account.balance)}
          </div>
        </div>
      </div>

      <PanelScroll className="mt-4 min-h-0 flex-1">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <InfoCell label="IBAN" value={maskIban(account.iban)} mono />
          <InfoCell label="Account Type" value={account.shortLabel ?? account.kind.toUpperCase()} />
          {account.kind === "society" ? (
            <>
              <InfoCell label="Your Role" value={account.role ?? "—"} />
              <InfoCell label="Members" value={`${account.members ?? 0}`} icon={<Users className="h-3 w-3" />} />
              <InfoCell label="Withdraw Limit" value={formatMoney(account.withdrawLimit ?? 0)} mono />
              <InfoCell label="Deposit Limit" value={formatMoney(account.depositLimit ?? 0)} mono />
            </>
          ) : null}
        </div>

        {metrics ? (
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
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
            <SummaryMetricCard
              label="Net Flow"
              value={formatMoney(metrics.netFlow)}
              subtitle={metrics.netFlow >= 0 ? "+ profit" : "− loss"}
              subtitleTone={metrics.netFlow >= 0 ? "up" : "down"}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
            />
            <SummaryMetricCard
              label="Avg / Tx"
              value={formatMoney(metrics.avgTx)}
              subtitle="rolling average"
              icon={<PiggyBank className="h-3.5 w-3.5" />}
            />
          </div>
        ) : null}

        <div className="mt-4 border-t border-white/5 pt-4">
          <SectionHeader
            title="Recent Activity"
            subtitle="Latest transactions on this account"
            action={
              <button
                type="button"
                onClick={openTransfersHistory}
                className="text-[10px] font-bold uppercase tracking-widest text-primary transition hover:text-white"
              >
                View All
              </button>
            }
          />

          {activity.length === 0 ? (
            <div className="py-6 text-center text-sm text-white/40">No recent transactions.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {activity.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} variant="dashboard" compact />
              ))}
            </div>
          )}

          {showSocietyAdmin ? (
            <div className="mt-4 border-t border-white/5 pt-4">
              <SocietyAdminPanel account={account} />
            </div>
          ) : null}
        </div>
      </PanelScroll>
    </GlassCard>
  );
}

function InfoCell({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="panel-card px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-white/40">
        {icon}
        {label}
      </div>
      <div className={cn("mt-0.5 truncate text-sm font-medium leading-snug text-white", mono && "font-mono text-xs")}>
        {value}
      </div>
    </div>
  );
}
