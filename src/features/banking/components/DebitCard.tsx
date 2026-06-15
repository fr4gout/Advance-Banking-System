import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "../context/BankingContext";
import { BankLogo } from "./BankLogo";
import { getBankThemeConfig } from "../hooks/useBankTheme";
import { maskIban } from "../hooks/useCurrency";

interface DebitCardProps {
  holderName: string;
  iban: string;
  balance: string;
  server?: string;
  bankName?: string;
  compact?: boolean;
  interactive?: boolean;
  className?: string;
}

export function DebitCard({
  holderName,
  iban,
  balance,
  server = "LIBERTY ROLEPLAY",
  bankName,
  compact = false,
  interactive = true,
  className,
}: DebitCardProps) {
  const { bankTheme } = useBanking();
  const themeConfig = getBankThemeConfig(bankTheme);
  const resolvedBankName =
    bankName ?? (themeConfig.logoSrc ? themeConfig.name : `${themeConfig.name} Bank`);

  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 14 });
  };
  const onLeave = () => {
    if (!interactive) return;
    setTilt({ x: 0, y: 0 });
  };

  const transform = interactive ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined;

  return (
    <div className={cn(interactive && "[perspective:1200px]", className)}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn(
          "relative aspect-[1.586/1] w-full overflow-clip radius-debit-card text-white",
          interactive && "transition-transform duration-200 ease-out will-change-transform",
          compact ? "p-3.5" : "p-6",
        )}
        style={{
          transform,
          background: "var(--debit-card-gradient)",
          boxShadow: compact ? "var(--debit-card-shadow-compact)" : "var(--debit-card-shadow)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 radius-debit-card opacity-70 mix-blend-screen"
          style={{ background: "var(--debit-card-highlight)" }}
        />
        <div
          className={cn(
            "relative flex h-full min-h-0 flex-col",
            compact ? "justify-between gap-2" : "gap-3",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                className={cn(
                  "uppercase tracking-[0.18em] text-white/70",
                  compact ? "text-[9px]" : "text-[10px]",
                )}
              >
                {server}
              </div>
              <div
                className={cn(
                  "mt-0.5 truncate font-semibold text-white",
                  compact ? "text-[11px]" : "text-xs",
                )}
              >
                {themeConfig.logoSrc ? (
                  <BankLogo variant="card" compact={compact} />
                ) : (
                  resolvedBankName
                )}
              </div>
            </div>
            <Wifi className={cn("shrink-0 -rotate-90 text-white/80", compact ? "h-4 w-4" : "h-5 w-5")} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn("shrink-0 rounded-[4px]", compact ? "h-7 w-9" : "h-8 w-10")}
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #f6e6a8 50%, #b88a1a 100%)",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.2)",
                }}
              />
              <span
                className={cn(
                  "rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-semibold uppercase tracking-[0.16em] text-white/85",
                  compact ? "text-[8px]" : "text-[9px]",
                )}
              >
                Debit
              </span>
            </div>
            <div
              className={cn(
                "font-medium tabular-nums text-white/95",
                compact ? "truncate text-xs tracking-[0.14em]" : "text-lg tracking-[0.18em]",
              )}
            >
              {maskIban(iban)}
            </div>
          </div>

          <div className={cn("flex items-end justify-between gap-3", !compact && "mt-auto")}>
            <div className="min-w-0">
              <div
                className={cn(
                  "uppercase tracking-[0.14em] text-white/65",
                  compact ? "text-[9px]" : "text-[10px]",
                )}
              >
                Card Holder
              </div>
              <div
                className={cn(
                  "truncate font-semibold uppercase tracking-wide text-white",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {holderName}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div
                className={cn(
                  "uppercase tracking-[0.14em] text-white/65",
                  compact ? "text-[9px]" : "text-[10px]",
                )}
              >
                Balance
              </div>
              <div
                className={cn(
                  "font-bold tabular-nums text-white",
                  compact ? "text-sm" : "text-lg",
                )}
              >
                {balance}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
