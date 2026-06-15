import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, Eye, Snowflake } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useBanking } from "@/features/banking/context/BankingContext";
import { formatMoney } from "@/features/banking/hooks/useCurrency";
import type { VirtualCard } from "@/features/banking/types/banking";
import { MobileCarouselDots } from "../components/ui/MobileCarouselDots";
import { MobileEmptyState } from "../components/ui/MobileEmptyState";
import { MobilePressable } from "../components/ui/MobilePressable";
import { MobileScreen } from "../components/ui/MobileScreen";
import { MobileVirtualCard } from "../components/ui/MobileVirtualCard";

const SPENDING_LIMIT_MIN = 0;
const SPENDING_LIMIT_MAX = 25_000;

export function MobileCardsView() {
  const { cards, activeAccount, updateVirtualCard } = useBanking();
  const [limitDraft, setLimitDraft] = useState<number | null>(null);
  const [pinVisible, setPinVisible] = useState(false);
  const [freezeFlash, setFreezeFlash] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const list = useMemo(
    () => cards.filter((c) => c.accountId === activeAccount.id),
    [cards, activeAccount.id],
  );

  const selected = list[activeIndex] ?? list[0] ?? null;

  const scrollToIndex = useCallback(
    (idx: number) => {
      const el = carouselRef.current;
      if (!el || list.length === 0) return;
      const clamped = Math.max(0, Math.min(idx, list.length - 1));
      el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
      setActiveIndex(clamped);
      setLimitDraft(null);
      setPinVisible(false);
    },
    [list.length],
  );

  const onCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el || list.length === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(idx, list.length - 1));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
      setLimitDraft(null);
      setPinVisible(false);
    }
  }, [activeIndex, list.length]);

  useEffect(() => {
    if (activeIndex >= list.length) {
      setActiveIndex(Math.max(0, list.length - 1));
    }
  }, [activeIndex, list.length]);

  const toggleFreeze = (card: VirtualCard) => {
    const frozen = card.status === "frozen";
    updateVirtualCard({ cardId: card.id, status: frozen ? "active" : "frozen" });
    setFreezeFlash(true);
    window.setTimeout(() => setFreezeFlash(false), 400);
  };

  const commitLimit = (value: number) => {
    if (!selected) return;
    updateVirtualCard({ cardId: selected.id, spendingLimit: value });
    setLimitDraft(null);
  };

  const revealPin = () => {
    setPinVisible(true);
    window.setTimeout(() => setPinVisible(false), 3000);
  };

  const currentLimit = limitDraft ?? selected?.spendingLimit ?? 0;
  const frozen = selected?.status === "frozen";

  return (
    <MobileScreen
      title="Your cards"
      subtitle="Manage spending and security"
      scrollClassName="gap-4"
    >
      {list.length === 0 ? (
        <MobileEmptyState
          icon={CreditCard}
          title="No virtual cards"
          description="Issue a card from desktop banking to manage it here."
        />
      ) : (
        <>
          <div className="-mx-4 overflow-x-hidden">
            <div
              ref={carouselRef}
              onScroll={onCarouselScroll}
              className="mobile-scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
            >
              {list.map((card, index) => (
                <div key={card.id} className="w-full shrink-0 snap-center px-4">
                  <MobileVirtualCard
                    card={card}
                    pinVisible={index === activeIndex && pinVisible}
                  />
                </div>
              ))}
            </div>
          </div>

          <MobileCarouselDots
            count={list.length}
            activeIndex={activeIndex}
            onSelect={scrollToIndex}
          />

          {selected ? (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <MobilePressable
                  onClick={() => toggleFreeze(selected)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 text-[11px] font-semibold transition-colors",
                    freezeFlash && !frozen && "bg-[var(--c-red)]/20",
                    freezeFlash && frozen && "bg-[var(--c-green)]/20",
                    frozen
                      ? "bg-[var(--c-green)]/15 text-[var(--c-green)]"
                      : "border border-[var(--c-red)]/40 bg-[var(--c-red)]/10 text-[var(--c-red)]",
                  )}
                >
                  <Snowflake className="h-4 w-4" />
                  {frozen ? "Unfreeze" : "Freeze card"}
                </MobilePressable>

                <MobilePressable
                  onClick={revealPin}
                  className="flex items-center justify-center gap-2 border border-primary/40 bg-primary/10 py-2.5 text-[11px] font-semibold text-primary"
                >
                  <Eye className="h-4 w-4" />
                  Reveal PIN
                </MobilePressable>
              </div>

              <div className="panel-card p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] text-[var(--tx-2)]">Spending limit</span>
                  <span className="text-[10px] text-[var(--tx-3)]">
                    {formatMoney(SPENDING_LIMIT_MIN)} — {formatMoney(SPENDING_LIMIT_MAX)}
                  </span>
                </div>
                <div className="mt-1 text-xl font-bold tabular-nums text-[var(--tx)]">
                  {formatMoney(currentLimit)}
                </div>
                <Slider
                  className="mt-4 [&>span:first-child]:bg-[var(--bg-row)] [&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary"
                  min={SPENDING_LIMIT_MIN}
                  max={SPENDING_LIMIT_MAX}
                  step={100}
                  value={[currentLimit]}
                  onValueChange={([value]) => setLimitDraft(value ?? SPENDING_LIMIT_MIN)}
                  onValueCommit={([value]) => commitLimit(value ?? SPENDING_LIMIT_MIN)}
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </MobileScreen>
  );
}
