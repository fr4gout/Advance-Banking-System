import { CreditCard, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VirtualCard } from "../../types/banking";
import { useBanking } from "../../context/BankingContext";
import { BankLogo } from "../BankLogo";
import { getBankThemeConfig } from "../../hooks/useBankTheme";
import { designToCardClassName } from "../cards/cardDesign";

interface DashboardVirtualCardProps {
  card: VirtualCard;
  className?: string;
}

export function DashboardVirtualCard({ card, className }: DashboardVirtualCardProps) {
  const { bankTheme } = useBanking();
  const themeConfig = getBankThemeConfig(bankTheme);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative aspect-[1.586/1] w-full overflow-clip radius-debit-card border border-white/10 p-3.5",
          designToCardClassName(card.design),
        )}
        style={{ boxShadow: "var(--debit-card-shadow-compact)" }}
      >
        <div className="relative flex h-full min-h-0 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {themeConfig.logoSrc ? (
                <BankLogo variant="card" compact />
              ) : (
                <div className="text-[9px] font-semibold uppercase tracking-[0.16em] opacity-80">
                  {themeConfig.name} Bank
                </div>
              )}
              <div className="mt-0.5 truncate text-xs font-semibold leading-snug opacity-95">
                {card.holderName}
              </div>
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

          <div className="text-[11px] font-medium tabular-nums tracking-[0.18em] opacity-90">
            {card.maskedPan}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.14em] opacity-65">Type</div>
              <div className="truncate text-xs font-semibold uppercase tracking-wide opacity-95">
                Virtual
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[9px] uppercase tracking-[0.14em] opacity-65">Expires</div>
              <div className="text-sm font-bold tabular-nums opacity-95">{card.expiresAt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
