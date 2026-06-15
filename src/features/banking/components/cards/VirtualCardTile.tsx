import { CreditCard, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VirtualCard } from "../../types/banking";
import { useBanking } from "../../context/BankingContext";
import { BankLogo } from "../BankLogo";
import { getBankThemeConfig } from "../../hooks/useBankTheme";
import { designToCardClassName } from "./cardDesign";

export function VirtualCardTile({
  card,
  active = false,
  onSelect,
  className,
}: {
  card: VirtualCard;
  active?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  const { bankTheme } = useBanking();
  const themeConfig = getBankThemeConfig(bankTheme);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex aspect-[1.586/1] w-[200px] max-w-[200px] flex-[0_0_200px] flex-col justify-between overflow-hidden radius-debit-card border p-3 text-left transition",
        active ? "border-primary/60 shadow-[var(--shadow-glow)]" : "border-white/10 hover:border-primary/30",
        designToCardClassName(card.design),
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {themeConfig.logoSrc ? (
              <BankLogo variant="card" compact />
            ) : (
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] opacity-80">
                {themeConfig.name} Bank
              </div>
            )}
          <div className="mt-0.5 truncate text-xs font-semibold leading-snug opacity-95">{card.holderName}</div>
        </div>
        <div className="flex items-center gap-1 opacity-90">
          {card.status === "frozen" ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-1.5 py-0.5 text-[9px] font-semibold">
              <Snowflake className="h-2.5 w-2.5" />
              Frozen
            </span>
          ) : null}
          <CreditCard className="h-4 w-4 opacity-80" />
        </div>
      </div>

      <div>
        <div className="text-[11px] font-medium tabular-nums tracking-[0.18em] opacity-90">{card.maskedPan}</div>
        <div className="mt-1 flex items-end justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] opacity-80">
          <span className="truncate">Virtual</span>
          <span className="shrink-0">{card.expiresAt}</span>
        </div>
      </div>
    </button>
  );
}

