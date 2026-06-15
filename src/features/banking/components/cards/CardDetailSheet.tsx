import { Snowflake, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "../../hooks/useCurrency";
import type { VirtualCard } from "../../types/banking";
import { useBanking } from "../../context/BankingContext";
import { BankLogo } from "../BankLogo";
import { getBankThemeConfig } from "../../hooks/useBankTheme";
import { designToCardClassName } from "./cardDesign";

interface CardDetailSheetProps {
  card: VirtualCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (args: { cardId: string; status?: VirtualCard["status"]; spendingLimit?: number }) => void;
}

export function CardDetailSheet({ card, open, onOpenChange, onUpdate }: CardDetailSheetProps) {
  const { bankTheme } = useBanking();
  const themeConfig = getBankThemeConfig(bankTheme);

  if (!card) return null;

  const frozen = card.status === "frozen";

  const toggleFreeze = () => {
    onUpdate({ cardId: card.id, status: frozen ? "active" : "frozen" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="panel-modal w-full border-[var(--bd)] bg-[var(--bg-panel)] text-[var(--tx)] sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle>Card ·••• {card.last4}</SheetTitle>
          <SheetDescription className="text-[var(--tx-2)]">
            Manage limits and security for this virtual card.
          </SheetDescription>
        </SheetHeader>

        <div
          className={cn(
            "mt-4 flex aspect-[1.75/1] flex-col justify-between radius-card border p-4",
            designToCardClassName(card.design),
          )}
        >
          {themeConfig.logoSrc ? (
            <BankLogo variant="card" />
          ) : (
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
              {themeConfig.name} Bank
            </div>
          )}
          <div className="font-mono text-sm tracking-[0.28em] opacity-90">{card.maskedPan}</div>
          <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider opacity-80">
            <span>{card.holderName}</span>
            <span>{card.expiresAt}</span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="radius-control border border-[var(--bd)] bg-[var(--bg-surface)] p-3">
            <div className="text-[9px] font-medium uppercase tracking-widest text-[var(--tx-3)]">Spending limit</div>
            <div className="mt-1 text-lg font-bold tabular-nums text-[var(--tx)]">{formatMoney(card.spendingLimit)}</div>
            <div className="mt-1 text-[11px] text-[var(--tx-2)]">Daily purchase cap for this card</div>
          </div>

          <div className="radius-control border border-[var(--bd)] bg-[var(--bg-surface)] p-3">
            <div className="text-[9px] font-medium uppercase tracking-widest text-[var(--tx-3)]">Status</div>
            <div className={cn("mt-1 text-sm font-semibold", frozen ? "text-sky-300" : "text-emerald-400")}>
              {frozen ? "Frozen" : "Active"}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFreeze}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center gap-2 radius-control text-[10px] font-bold uppercase tracking-wider transition",
              frozen
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
            )}
          >
            {frozen ? (
              <>
                <Unlock className="h-4 w-4" />
                Unfreeze card
              </>
            ) : (
              <>
                <Snowflake className="h-4 w-4" />
                Freeze card
              </>
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
