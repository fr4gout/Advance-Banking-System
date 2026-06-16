import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MobileListRowProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  stagger?: 1 | 2 | 3 | 4 | 5;
}

export function MobileListRow({
  icon: Icon,
  title,
  subtitle,
  trailing,
  selected,
  onClick,
  className,
  stagger,
}: MobileListRowProps) {
  const staggerClass = stagger ? `mobile-stagger-${stagger}` : undefined;

  const content = (
    <>
      {Icon ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-08)] text-primary">
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--tx)]">{title}</p>
        {subtitle ? (
          <p className="truncate text-[11px] text-[var(--tx-2)]">{subtitle}</p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0 text-right">{trailing}</div> : null}
    </>
  );

  const rowClass = cn(
    "panel-card flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
    selected && "border-[var(--bd-primary)] ring-1 ring-primary/20",
    staggerClass,
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(rowClass, "mobile-press w-full")}
      >
        {content}
      </button>
    );
  }

  return <div className={rowClass}>{content}</div>;
}
