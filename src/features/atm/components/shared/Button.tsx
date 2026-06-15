import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:
    "bg-primary text-primary-foreground border border-[var(--bd-primary)] hover:opacity-90",
  secondary:
    "bg-[var(--bg-surface)] text-[var(--tx)] border border-[var(--bd)] hover:border-[var(--bd-strong)] hover:bg-[var(--primary-15)]",
  ghost:
    "bg-transparent text-[var(--tx-2)] border border-transparent hover:text-[var(--tx)] hover:bg-[var(--bg-row)]",
  danger:
    "bg-[var(--c-red)]/10 text-[var(--c-red)] border border-[var(--c-red)]/30 hover:bg-[var(--c-red)]/20",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "motion-interactive inline-flex items-center justify-center radius-control font-medium active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
