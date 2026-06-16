import { cn } from "@/lib/utils";
import { PanelScroll } from "@/features/banking/components/PanelScroll";
import type { ReactNode } from "react";

interface MobileScreenProps {
  title?: string;
  subtitle?: string;
  stickyHeader?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  scrollClassName?: string;
  immersive?: boolean;
  scrollable?: boolean;
}

export function MobileScreen({
  title,
  subtitle,
  stickyHeader,
  footer,
  children,
  className,
  scrollClassName,
  immersive = false,
  scrollable = true,
}: MobileScreenProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {stickyHeader}
      {title ? (
        <div className={cn("shrink-0 px-4 pb-2", immersive && "-mt-2")}>
          <h2 className="text-base font-semibold tracking-tight text-[var(--tx)]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] text-[var(--tx-2)]">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
      <PanelScroll
        className={cn(
          "flex flex-col px-4",
          scrollable
            ? "panel-scroll mobile-scrollbar-hide overflow-x-hidden gap-3 pb-[var(--mobile-tab-clearance)]"
            : "min-h-0 flex-1 flex-col overflow-hidden pb-2",
          scrollClassName,
        )}
      >
        {children}
      </PanelScroll>
      {footer ? (
        <div className="shrink-0 border-t border-[var(--bd)] px-4 py-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
