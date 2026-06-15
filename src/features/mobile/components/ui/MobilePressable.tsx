import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface MobilePressableProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "surface" | "primary" | "ghost";
}

const variants = {
  surface: "panel-card text-[var(--tx)] hover:bg-[var(--bg-row)]",
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  ghost: "text-[var(--tx-2)] hover:bg-[var(--bg-row)]",
};

export function MobilePressable({
  children,
  variant = "surface",
  className,
  type = "button",
  ...props
}: MobilePressableProps) {
  return (
    <button
      type={type}
      className={cn("mobile-press radius-control transition-colors", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
