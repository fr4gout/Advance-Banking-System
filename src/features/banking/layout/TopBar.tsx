import { Activity, ArrowLeftRight, X } from "lucide-react";
import { AccountSelect } from "../components/AccountSelect";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";

const secondaryBtn =
  "motion-interactive inline-flex h-10 items-center gap-1.5 radius-control border border-[var(--bd)] bg-[var(--bg-surface)] px-4 text-[10px] font-bold uppercase tracking-wider text-[var(--tx-2)] hover:border-[var(--bd-strong)] hover:text-[var(--tx)]";

export function TopBar() {
  const { accounts, activeAccount, switchAccount, close, openTransfersHistory, openTransfersSend } =
    useBanking();

  return (
    <header className="flex shrink-0 items-stretch gap-0 border-b border-[var(--bd)] px-4 py-3">
      <div className="flex w-[240px] shrink-0 items-center">
        <AccountSelect
          accounts={accounts}
          activeAccountId={activeAccount.id}
          onSwitch={switchAccount}
          className="w-full"
        />
      </div>

      <div className="mx-4 w-px shrink-0 self-stretch bg-[var(--bd)]" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--tx-2)]">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
            aria-hidden
          />
          Available Balance
        </div>
        <div className="text-2xl font-bold tracking-tight text-[var(--tx)]">
          {formatMoney(activeAccount.balance)}
          <span className="ml-1.5 text-xs font-normal text-[var(--tx-2)]">USD</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-4">
        <button
          type="button"
          onClick={openTransfersSend}
          className="motion-interactive inline-flex h-10 items-center gap-1.5 radius-control bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Transfer
        </button>
        <button type="button" onClick={openTransfersHistory} className={secondaryBtn}>
          <Activity className="h-3.5 w-3.5" />
          History
        </button>
        <button type="button" onClick={close} className={secondaryBtn}>
          <X className="h-3.5 w-3.5" />
          Close
        </button>
      </div>
    </header>
  );
}
