import { cn } from "@/lib/utils";

interface MobileHeroCardProps {
  title?: string;
  label: string;
  value: string;
  hint?: string;
  active?: boolean;
  className?: string;
}

export function MobileHeroCard({
  title,
  label,
  value,
  hint,
  active = false,
  className,
}: MobileHeroCardProps) {
  return (
    <div
      className={cn(
        "mobile-hero-shimmer relative overflow-hidden rounded-[var(--mobile-radius-lg)] border border-[var(--bd)] p-4",
        className,
      )}
      style={{
        background:
          "linear-gradient(145deg, var(--primary-15) 0%, var(--bg-surface) 55%, var(--bg-card) 100%)",
      }}
    >
      <div
        aria-hidden
        className="mobile-hero-glow pointer-events-none absolute inset-0"
      />
      <div className="relative">
        {title ? (
          <p className="truncate text-sm font-semibold text-[var(--tx)]">
            {title}
          </p>
        ) : null}
        <p
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tx-2)]",
            title && "mt-1",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "mt-1 font-bold tabular-nums tracking-tight",
            active ? "text-primary" : "text-[var(--tx)]",
          )}
          style={{ fontSize: "clamp(1.5rem, 6vw, 1.875rem)" }}
        >
          {value}
        </p>
        {hint ? (
          <p className="mt-1 text-[11px] text-[var(--tx-2)]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
