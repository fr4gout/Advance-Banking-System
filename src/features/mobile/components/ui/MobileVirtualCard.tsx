import { useRef, useState, type PointerEvent } from "react";
import { Snowflake } from "lucide-react";
import { designToCardClassName } from "@/features/banking/components/cards/cardDesign";
import { useBanking } from "@/features/banking/context/BankingContext";
import { getBankThemeConfig } from "@/features/banking/hooks/useBankTheme";
import type { VirtualCard } from "@/features/banking/types/banking";
import { cn } from "@/lib/utils";
import { MobileBadge } from "./MobileBadge";

const MOCK_PIN = "4829";

function formatSpacedLast4(last4: string): string {
  return last4.split("").join(" ");
}

interface MobileVirtualCardProps {
  card: VirtualCard;
  pinVisible?: boolean;
  className?: string;
  interactive?: boolean;
}

export function MobileVirtualCard({
  card,
  pinVisible = false,
  className,
  interactive = true,
}: MobileVirtualCardProps) {
  const { bankTheme } = useBanking();
  const bankLabel = getBankThemeConfig(bankTheme).name.toUpperCase();
  const frozen = card.status === "frozen";
  const canTilt = interactive && !frozen;

  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glossOffset, setGlossOffset] = useState(0);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!canTilt) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 14 });
    setGlossOffset(px * 24);
  };

  const onPointerLeave = () => {
    if (!canTilt) return;
    setTilt({ x: 0, y: 0 });
    setGlossOffset(0);
  };

  const transform = canTilt ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined;

  return (
    <div className={cn(canTilt && "[perspective:1200px]", className)}>
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={cn(
          "relative aspect-[1.586/1] w-full overflow-clip radius-debit-card p-4",
          designToCardClassName(card.design),
          canTilt && "transition-transform duration-200 ease-out will-change-transform",
        )}
        style={{
          transform,
          boxShadow: "var(--debit-card-shadow-compact)",
        }}
      >
        <div
          aria-hidden
          className="mobile-card-gloss"
          style={{
            transform: `translateX(${glossOffset}%)`,
            transition: canTilt ? "transform 120ms ease-out" : undefined,
          }}
        />

        <div className="relative flex h-full min-h-0 flex-col justify-between">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">
            {bankLabel}
          </div>

          <div className="text-lg font-medium tabular-nums tracking-[0.22em] opacity-95">
            <span className="opacity-70">•••• •••• ••••</span>{" "}
            <span>{formatSpacedLast4(card.last4)}</span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] capitalize tracking-wide opacity-60">Card holder</div>
              <div className="truncate text-sm font-semibold uppercase tracking-wide opacity-95">
                {card.holderName}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] uppercase tracking-wide opacity-60">PIN</div>
              <div className="font-mono text-sm font-semibold tabular-nums tracking-widest opacity-95">
                {pinVisible ? MOCK_PIN : "••••"}
              </div>
            </div>
          </div>
        </div>

        {frozen ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 radius-debit-card">
            <MobileBadge variant="frozen" className="inline-flex items-center gap-1 px-3 py-1 text-xs">
              <Snowflake className="h-3 w-3" />
              Frozen
            </MobileBadge>
          </div>
        ) : null}
      </div>
    </div>
  );
}
