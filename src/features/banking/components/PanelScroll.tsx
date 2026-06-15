import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface PanelScrollProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PanelScroll({ children, className, ...rest }: PanelScrollProps) {
  return (
    <div className={cn("panel-scroll min-h-0 flex-1", className)} {...rest}>
      {children}
    </div>
  );
}
