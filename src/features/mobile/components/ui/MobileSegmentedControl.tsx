import { cn } from "@/lib/utils";

interface SegmentOption {
  id: string;
  label: string;
}

interface MobileSegmentedControlProps {
  value: string;
  onChange: (id: string) => void;
  options: SegmentOption[];
  className?: string;
}

export function MobileSegmentedControl({
  value,
  onChange,
  options,
  className,
}: MobileSegmentedControlProps) {
  return (
    <div
      className={cn(
        "grid rounded-full border border-[var(--bd)] bg-[var(--bg-surface)] p-1",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      role="tablist"
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "mobile-press rounded-full py-2 text-xs font-medium transition-colors",
              active
                ? "bg-[var(--primary-08)] font-semibold text-primary"
                : "text-[var(--tx-2)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
