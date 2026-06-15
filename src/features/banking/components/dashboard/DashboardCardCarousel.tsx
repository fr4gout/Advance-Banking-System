import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BankTheme, VirtualCard } from "../../types/banking";
import { getBankThemeConfig } from "../../hooks/useBankTheme";
import { DebitCard } from "../DebitCard";
import { DashboardVirtualCard } from "./DashboardVirtualCard";
import { formatMoney } from "../../hooks/useCurrency";

interface DashboardCardCarouselProps {
  holderName: string;
  iban: string;
  balance: number;
  virtualCards: VirtualCard[];
  onActiveIndexChange?: (index: number) => void;
  variant?: "desktop" | "mobile";
}

type SlideDirection = "prev" | "next";

const SWIPE_THRESHOLD = 40;

function NavButton({
  direction,
  disabled,
  onClick,
  mobile,
}: {
  direction: SlideDirection;
  disabled: boolean;
  onClick: () => void;
  mobile?: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Previous card" : "Next card";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        mobile ? "mobile-press" : "motion-interactive",
        "inline-flex shrink-0 items-center justify-center radius-control border border-[var(--bd)] bg-[var(--bg-surface)] text-[var(--tx-2)]",
        mobile ? "h-8 w-8" : "h-9 w-9",
        !mobile && "hover:border-[var(--bd-primary)] hover:text-[var(--tx)] active:scale-95",
        "disabled:pointer-events-none disabled:opacity-30",
      )}
    >
      <Icon className={mobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
    </button>
  );
}

export function DashboardCardCarousel({
  holderName,
  iban,
  balance,
  virtualCards,
  onActiveIndexChange,
  variant = "desktop",
}: DashboardCardCarouselProps) {
  const isMobile = variant === "mobile";
  const totalSlides = 1 + virtualCards.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>("next");
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (activeIndex >= totalSlides) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  const goTo = useCallback(
    (index: number, slideDirection: SlideDirection) => {
      if (totalSlides <= 1) return;
      const wrapped = ((index % totalSlides) + totalSlides) % totalSlides;
      if (wrapped === activeIndex) return;
      setDirection(slideDirection);
      setActiveIndex(wrapped);
    },
    [activeIndex, totalSlides],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1, "prev"), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1, "next"), [activeIndex, goTo]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      goTo(index, index > activeIndex ? "next" : "prev");
    },
    [activeIndex, goTo],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || totalSlides <= 1) return;
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || totalSlides <= 1 || touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const navDisabled = totalSlides <= 1;
  const virtualCard = activeIndex > 0 ? virtualCards[activeIndex - 1] : null;

  const slideContent =
    activeIndex === 0 ? (
      <DebitCard
        compact
        interactive={false}
        holderName={holderName}
        iban={iban}
        balance={formatMoney(balance)}
      />
    ) : virtualCard ? (
      <DashboardVirtualCard card={virtualCard} />
    ) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 items-center gap-1.5">
        <NavButton direction="prev" disabled={navDisabled} onClick={goPrev} mobile={isMobile} />
        <div
          className="min-w-0 flex-1 touch-pan-y px-0.5"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            key={activeIndex}
            className={cn(
              "motion-card-enter",
              direction === "next" ? "motion-card-from-right" : "motion-card-from-left",
            )}
          >
            {slideContent}
          </div>
        </div>
        <NavButton direction="next" disabled={navDisabled} onClick={goNext} mobile={isMobile} />
      </div>

      {totalSlides > 1 ? (
        <div className="mt-auto flex justify-center gap-1.5 pt-2" role="tablist" aria-label="Card slides">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-label={`Card ${index + 1} of ${totalSlides}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goToIndex(index)}
              className={cn(
                "motion-dot h-1.5 rounded-full",
                index === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-[var(--tx-3)] hover:bg-[var(--tx-2)]",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function getDashboardCardSlideLabel(
  activeIndex: number,
  virtualCards: VirtualCard[],
  bankTheme: BankTheme,
): string {
  if (activeIndex === 0) return `${getBankThemeConfig(bankTheme).name} Debit`;
  const card = virtualCards[activeIndex - 1];
  if (!card) return "Virtual Card";
  const frozen = card.status === "frozen" ? " · Frozen" : "";
  return `Virtual Card · ${card.last4}${frozen}`;
}
