import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  action,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", compact ? "mb-2" : "mb-4")}>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--tx)]">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-[var(--tx-2)]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
