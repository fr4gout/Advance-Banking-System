import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  className?: string;
}

export function MobilePageHeader({ title, subtitle, trailing, className }: MobilePageHeaderProps) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-[var(--bd)] bg-[var(--bg-panel)] px-4 py-2.5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-[var(--tx)]">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-[11px] text-[var(--tx-2)]">{subtitle}</p> : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );
}
