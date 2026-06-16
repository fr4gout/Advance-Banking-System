import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobilePressable } from "./MobilePressable";

interface MobileEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function MobileEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: MobileEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--mobile-radius-lg)] border border-[var(--bd)] bg-[var(--bg-surface)] px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-08)] text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-[var(--tx)]">{title}</p>
      {description ? (
        <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-[var(--tx-2)]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <MobilePressable
          variant="primary"
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs"
        >
          {actionLabel}
        </MobilePressable>
      ) : null}
    </div>
  );
}
