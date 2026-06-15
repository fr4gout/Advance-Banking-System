import { useCallback, useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import type { VirtualCard } from "../../types/banking";
import { useBanking } from "../../context/BankingContext";
import { GlassCard } from "../GlassCard";
import {
  DashboardCardCarousel,
  getDashboardCardSlideLabel,
} from "./DashboardCardCarousel";

interface DashboardCardPanelProps {
  accountId: string;
  holderName: string;
  iban: string;
  balance: number;
  virtualCards: VirtualCard[];
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function DashboardCardPanel({
  accountId,
  holderName,
  iban,
  balance,
  virtualCards,
  onDeposit,
  onWithdraw,
}: DashboardCardPanelProps) {
  const { bankTheme } = useBanking();
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 1 + virtualCards.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [accountId]);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const subtitle = getDashboardCardSlideLabel(activeIndex, virtualCards, bankTheme);

  return (
    <GlassCard className="col-span-4 flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="relative z-10 flex shrink-0 flex-wrap items-start justify-between gap-x-2 gap-y-2 pb-1">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--tx)]">Your Card</h2>
          <p className="mt-0.5 text-xs leading-snug text-[var(--tx-2)]">
            {subtitle}
            {totalSlides > 1 ? (
              <span className="text-[var(--tx-3)]"> · {activeIndex + 1} of {totalSlides}</span>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={onDeposit}
            title="Deposit"
            className="motion-interactive inline-flex h-9 items-center gap-1.5 radius-control bg-primary px-3 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Deposit
          </button>
          <button
            type="button"
            onClick={onWithdraw}
            title="Withdraw"
            className="motion-interactive inline-flex h-9 items-center gap-1.5 radius-control border border-[var(--bd)] bg-[var(--bg-surface)] px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--tx-2)] hover:border-[var(--bd-primary)] hover:text-[var(--tx)]"
          >
            <ArrowUpFromLine className="h-3.5 w-3.5" />
            Withdraw
          </button>
        </div>
      </div>

      <DashboardCardCarousel
        key={accountId}
        holderName={holderName}
        iban={iban}
        balance={balance}
        virtualCards={virtualCards}
        onActiveIndexChange={handleActiveIndexChange}
      />
    </GlassCard>
  );
}
