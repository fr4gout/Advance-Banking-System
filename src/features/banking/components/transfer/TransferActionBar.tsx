import { ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "../../hooks/useCurrency";
import type { TransferMode } from "../../utils/transferLimits";

interface TransferActionBarProps {
  mode: TransferMode;
  amount: number;
  toLabel: string;
  valid: boolean;
  onSubmit: () => void;
  className?: string;
}

export function TransferActionBar({ mode, amount, toLabel, valid, onSubmit, className }: TransferActionBarProps) {
  const Icon = mode === "deposit" ? ArrowDownToLine : mode === "withdraw" ? ArrowUpFromLine : Send;

  const label = (() => {
    const money = formatMoney(amount);
    switch (mode) {
      case "deposit":
        return `Deposit ${money} to ${toLabel}`;
      case "withdraw":
        return `Withdraw ${money} to cash`;
      case "transfer":
        return `Send ${money} to ${toLabel}`;
      default: {
        const _exhaustive: never = mode;
        return _exhaustive;
      }
    }
  })();

  return (
    <button
      type="button"
      disabled={!valid}
      onClick={onSubmit}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 radius-control border text-sm font-semibold transition",
        valid
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
          : "cursor-not-allowed border-white/10 bg-black/40 text-white/40",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
