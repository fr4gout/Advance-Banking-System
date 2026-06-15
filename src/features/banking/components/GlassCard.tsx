import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  inset?: boolean;
}

export function GlassCard({ children, className, inset = false, ...rest }: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "panel-surface relative overflow-hidden border-[var(--bd)]",
        "shadow-[var(--shadow-elevated)]",
        inset ? "p-4" : "p-5",
        className,
      )}
    >
      <div className="relative flex h-full min-h-0 min-w-0 flex-col">{children}</div>
    </div>
  );
}
