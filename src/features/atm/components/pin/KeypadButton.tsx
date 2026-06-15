import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface KeypadButtonProps {
  children: ReactNode;
  onClick: () => void;
  wide?: boolean;
  variant?: "default" | "action";
}

export function KeypadButton({
  children,
  onClick,
  wide = false,
  variant = "default",
}: KeypadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 items-center justify-center radius-control border text-lg font-medium transition-all duration-150 active:scale-95",
        wide && "col-span-2",
        variant === "action"
          ? "border-[var(--bd)] bg-[var(--bg-row)] text-[var(--tx-2)] hover:border-[var(--bd-primary)] hover:bg-[var(--primary-15)] hover:text-primary"
          : "border-[var(--bd)] bg-[var(--bg-row)] text-[var(--tx)] hover:border-[var(--bd-primary)] hover:bg-[var(--primary-15)]",
      )}
    >
      {children}
    </button>
  );
}
