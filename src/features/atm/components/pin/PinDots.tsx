import { cn } from "@/lib/utils";

interface PinDotsProps {
  length: number;
  filled: number;
  error?: boolean;
  shake?: boolean;
}

export function PinDots({ length, filled, error = false, shake = false }: PinDotsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4", shake && "animate-shake")}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = index < filled;
        const isError = error && !isFilled && index === 0;

        return (
          <div
            key={index}
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200",
              error && isFilled && "border-[var(--c-red)] bg-[var(--c-red)] text-[var(--c-red)]",
              !error && isFilled && "border-primary bg-primary",
              isError && "border-[var(--c-red)] bg-[var(--c-red)]/20",
              !isFilled && !isError && !(error && isFilled) && "border-[var(--tx-3)] bg-transparent",
            )}
          >
            {error && isFilled && (
              <span className="text-[8px] font-bold text-white">✕</span>
            )}
            {!error && isFilled && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            )}
          </div>
        );
      })}
    </div>
  );
}
