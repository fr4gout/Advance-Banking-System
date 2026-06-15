import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Account } from "@/features/banking/types/banking";
import { useBanking } from "@/features/banking/context/BankingContext";
import { formatMoney } from "@/features/banking/hooks/useCurrency";
import { MobileCarouselDots } from "./MobileCarouselDots";
import { MobileHeroCard } from "./MobileHeroCard";

const SWIPE_THRESHOLD = 40;
const DIRECTION_LOCK_THRESHOLD = 10;
const BALANCE_LABEL = "Available Balance";

function BalanceSlide({
  account,
  active,
  className,
}: {
  account: Account;
  active: boolean;
  className?: string;
}) {
  const balanceLabel = formatMoney(account.balance);

  return (
    <div aria-label={`${account.name}, ${balanceLabel}`}>
      <MobileHeroCard
        title={account.name}
        label={BALANCE_LABEL}
        value={balanceLabel}
        active={active}
        className={className}
      />
    </div>
  );
}

export function MobileBalanceCarousel() {
  const { accounts, activeAccount, switchAccount } = useBanking();
  const viewportRef = useRef<HTMLDivElement>(null);
  const gestureStartX = useRef<number | null>(null);
  const gestureStartY = useRef<number | null>(null);
  const isHorizontalGesture = useRef(false);
  const [slideWidth, setSlideWidth] = useState(0);

  const activeIndex = Math.max(
    0,
    accounts.findIndex((account) => account.id === activeAccount.id),
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setSlideWidth(viewport.clientWidth);
  }, []);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const goToIndex = useCallback(
    (index: number) => {
      if (accounts.length <= 1) return;
      const wrapped = ((index % accounts.length) + accounts.length) % accounts.length;
      const account = accounts[wrapped];
      if (account && account.id !== activeAccount.id) {
        switchAccount(account.id);
      }
    },
    [accounts, activeAccount.id, switchAccount],
  );

  const goNext = useCallback(() => goToIndex(activeIndex + 1), [activeIndex, goToIndex]);
  const goPrev = useCallback(() => goToIndex(activeIndex - 1), [activeIndex, goToIndex]);

  const resetGesture = useCallback(() => {
    gestureStartX.current = null;
    gestureStartY.current = null;
    isHorizontalGesture.current = false;
  }, []);

  const applySwipe = useCallback(
    (deltaX: number) => {
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
      if (deltaX < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || accounts.length <= 1) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      gestureStartX.current = touch.clientX;
      gestureStartY.current = touch.clientY;
      isHorizontalGesture.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (gestureStartX.current === null || gestureStartY.current === null) return;
      const touch = e.touches[0];
      if (!touch) return;

      const dx = touch.clientX - gestureStartX.current;
      const dy = touch.clientY - gestureStartY.current;

      if (!isHorizontalGesture.current) {
        if (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
          isHorizontalGesture.current = true;
        } else if (Math.abs(dy) > DIRECTION_LOCK_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
          resetGesture();
          return;
        }
      }

      if (isHorizontalGesture.current) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isHorizontalGesture.current || gestureStartX.current === null) {
        resetGesture();
        return;
      }
      const touch = e.changedTouches[0];
      const endX = touch?.clientX ?? gestureStartX.current;
      const delta = endX - gestureStartX.current;
      resetGesture();
      applySwipe(delta);
    };

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", resetGesture, { passive: true });

    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", resetGesture);
    };
  }, [accounts.length, applySwipe, resetGesture]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (accounts.length <= 1 || e.button !== 0) return;
    gestureStartX.current = e.clientX;
    gestureStartY.current = e.clientY;
    isHorizontalGesture.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (gestureStartX.current === null || gestureStartY.current === null) return;

    const dx = e.clientX - gestureStartX.current;
    const dy = e.clientY - gestureStartY.current;

    if (!isHorizontalGesture.current) {
      if (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        isHorizontalGesture.current = true;
      } else if (Math.abs(dy) > DIRECTION_LOCK_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        resetGesture();
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (gestureStartX.current === null) return;

    if (isHorizontalGesture.current) {
      const delta = e.clientX - gestureStartX.current;
      applySwipe(delta);
    }

    resetGesture();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerCancel = () => {
    resetGesture();
  };

  if (accounts.length <= 1) {
    return <BalanceSlide account={activeAccount} active />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={viewportRef}
        className="overflow-hidden select-none"
        role="region"
        aria-label="Account balances"
        aria-live="polite"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className="mobile-balance-track flex"
          style={{
            width: slideWidth > 0 ? slideWidth * accounts.length : "100%",
            transform: slideWidth > 0 ? `translateX(-${activeIndex * slideWidth}px)` : undefined,
          }}
        >
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className="shrink-0"
              style={{ width: slideWidth > 0 ? slideWidth : "100%" }}
            >
              <BalanceSlide account={account} active={index === activeIndex} />
            </div>
          ))}
        </div>
      </div>
      <MobileCarouselDots count={accounts.length} activeIndex={activeIndex} onSelect={goToIndex} />
    </div>
  );
}
