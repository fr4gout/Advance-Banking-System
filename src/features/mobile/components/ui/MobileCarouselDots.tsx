import { cn } from "@/lib/utils";

interface MobileCarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
  className?: string;
}

const dotClass = (active: boolean) =>
  cn(
    "h-1.5 rounded-full transition-all duration-[var(--mobile-duration-base)]",
    active ? "w-4 bg-primary" : "w-1.5 bg-[var(--bg-row)]",
  );

export function MobileCarouselDots({ count, activeIndex, onSelect, className }: MobileCarouselDotsProps) {
  if (count <= 1) return null;

  return (
    <div
      className={cn("flex items-center justify-center gap-1.5", className)}
      role={onSelect ? "tablist" : undefined}
      aria-label={onSelect ? "Accounts" : undefined}
    >
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;

        if (onSelect) {
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Account ${i + 1} of ${count}`}
              onClick={() => onSelect(i)}
              className={cn("mobile-press flex items-center justify-center p-1.5", dotClass(active))}
              style={{ transitionTimingFunction: "var(--mobile-spring)" }}
            />
          );
        }

        return (
          <span
            key={i}
            className={dotClass(active)}
            style={{ transitionTimingFunction: "var(--mobile-spring)" }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
