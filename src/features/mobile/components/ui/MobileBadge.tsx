import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "paid" | "unpaid" | "frozen" | "active" | "pending" | "default";

interface MobileBadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  pop?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  paid: "bg-[var(--c-green)]/15 text-[var(--c-green)]",
  active: "bg-[var(--c-green)]/15 text-[var(--c-green)]",
  unpaid: "bg-[var(--c-orange)]/15 text-[var(--c-orange)]",
  pending: "bg-[var(--c-orange)]/15 text-[var(--c-orange)]",
  frozen: "bg-[var(--c-red)]/15 text-[var(--c-red)]",
  default: "bg-[var(--bg-row)] text-[var(--tx-2)]",
};

export function MobileBadge({
  variant = "default",
  children,
  className,
  pop = false,
}: MobileBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
        variants[variant],
        pop && "mobile-chip-pop",
        className,
      )}
    >
      {children}
    </span>
  );
}
