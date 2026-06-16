import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileQuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export function MobileQuickAction({
  icon: Icon,
  label,
  onClick,
  className,
}: MobileQuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mobile-press flex flex-1 flex-col items-center gap-1.5 rounded-[var(--mobile-radius-lg)] border border-[var(--bd)] bg-[var(--bg-surface)] p-2.5",
        className,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-08)] text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[9px] font-semibold text-[var(--tx)]">{label}</span>
    </button>
  );
}
