import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { BankLogo } from "@/features/banking/components/BankLogo";
import { useBanking } from "@/features/banking/context/BankingContext";
import { getBankThemeConfig } from "@/features/banking/hooks/useBankTheme";
import type { BankCard } from "../../types/bankCard";
import { maskCardNumber } from "../../utils/cardFormatter";
import { CardChip } from "./CardChip";

interface BankCardProps {
  card: BankCard;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function BankCard({
  card,
  selected = false,
  onClick,
  compact = false,
}: BankCardProps) {
  const { bankTheme } = useBanking();
  const themeConfig = getBankThemeConfig(bankTheme);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full text-left transition-all duration-300",
        !compact && "hover:-translate-y-1 hover:scale-[1.02]",
        onClick ? "cursor-pointer" : "cursor-default",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden radius-debit-card border p-5 text-white transition-all duration-300",
          selected
            ? "border-[var(--bd-primary)]"
            : "border-[var(--bd)] group-hover:border-[var(--bd-primary)]",
          compact ? "p-4" : "min-h-[180px]",
        )}
        style={{
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
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--primary-08)]"
        />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              {themeConfig.logoSrc ? (
                <BankLogo variant="card" compact />
              ) : (
                <p className="text-xs font-bold tracking-[0.2em] text-primary">
                  {card.bankName}
                </p>
              )}
            </div>
            <Wifi className="h-4 w-4 shrink-0 rotate-90 text-white/60" />
          </div>

          <div className="flex items-center gap-3">
            <CardChip />
            <span className="text-xs text-white/60">{card.cardType}</span>
          </div>

          <p className="font-mono text-lg tracking-widest text-white/95">
            {maskCardNumber(card.cardNumber)}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Cardholder
              </p>
              <p className="text-sm font-medium text-white/95">
                {card.holderName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Expires
              </p>
              <p className="text-sm text-white/95">{card.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
