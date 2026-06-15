import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "../context/BankingContext";
import type { BankTheme } from "../types/banking";
import { getBankThemeConfig } from "../hooks/useBankTheme";

type BankLogoVariant = "sidebar" | "card" | "picker";

interface BankLogoProps {
  theme?: BankTheme;
  variant: BankLogoVariant;
  compact?: boolean;
  className?: string;
}

const variantClasses: Record<BankLogoVariant, string> = {
  sidebar: "max-h-8 max-w-[52px]",
  card: "max-h-6 max-w-[120px]",
  picker: "max-h-10 max-w-[140px]",
};

export function BankLogo({ theme, variant, compact = false, className }: BankLogoProps) {
  const { bankTheme } = useBanking();
  const resolvedTheme = theme ?? bankTheme;
  const config = getBankThemeConfig(resolvedTheme);

  if (config.logoSrc) {
    return (
      <img
        src={config.logoSrc}
        alt={config.name}
        className={cn(
          "h-auto w-auto object-contain object-left",
          variant === "card" && compact && "max-h-5 max-w-[100px]",
          variantClasses[variant],
          className,
        )}
        draggable={false}
      />
    );
  }

  if (variant === "sidebar") {
    return <Landmark className={cn("h-5 w-5 shrink-0", className)} aria-hidden />;
  }

  if (variant === "picker") {
    return (
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center radius-chip border border-[var(--bd)] bg-[var(--bg-surface)]",
          className,
        )}
      >
        <Landmark className="h-5 w-5 text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "truncate font-semibold text-white",
        compact ? "text-[11px]" : "text-xs",
        className,
      )}
    >
      {config.name} Bank
    </span>
  );
}
