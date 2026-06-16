import { cn } from "@/lib/utils";

interface MobileStepProgressProps {
  current: number;
  total: number;
}

export function MobileStepProgress({
  current,
  total,
}: MobileStepProgressProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-row)]">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-[var(--mobile-duration-base)]"
        style={{
          width: `${pct}%`,
          transitionTimingFunction: "var(--mobile-ease-out)",
        }}
      />
    </div>
  );
}

export function MobileStepDots({ current, total }: MobileStepProgressProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors duration-[var(--mobile-duration-base)]",
            i < current ? "bg-primary" : "bg-[var(--bg-row)]",
          )}
        />
      ))}
    </div>
  );
}
