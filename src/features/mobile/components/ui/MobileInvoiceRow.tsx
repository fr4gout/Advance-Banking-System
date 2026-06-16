import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileInvoiceRowProps {
  icon: LucideIcon;
  sender: string;
  reason: string;
  amount: string;
  onClick?: () => void;
  className?: string;
  stagger?: 1 | 2 | 3 | 4 | 5;
}

export function MobileInvoiceRow({
  icon: Icon,
  sender,
  reason,
  amount,
  onClick,
  className,
  stagger,
}: MobileInvoiceRowProps) {
  const staggerClass = stagger ? `mobile-stagger-${stagger}` : undefined;

  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-08)] text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--tx)]">
          {sender}
        </p>
        <p className="truncate text-[11px] text-[var(--tx-2)]">{reason}</p>
      </div>
      <p className="shrink-0 text-sm font-bold tabular-nums text-[var(--tx)]">
        {amount}
      </p>
    </>
  );

  const rowClass = cn(
    "panel-card flex w-full items-center gap-3 rounded-[var(--mobile-radius-lg)] border border-[var(--bd)] px-3.5 py-3.5 text-left",
    staggerClass,
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(rowClass, "mobile-press")}
      >
        {content}
      </button>
    );
  }

  return <div className={rowClass}>{content}</div>;
}
