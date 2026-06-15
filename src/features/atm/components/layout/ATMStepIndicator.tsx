import { cn } from "@/lib/utils";
import type { ATMView } from "../../types/atm";

const STEPS: { view: ATMView; label: string }[] = [
  { view: "SELECT_CARD", label: "Card" },
  { view: "PIN_ENTRY", label: "PIN" },
  { view: "DASHBOARD", label: "Withdraw" },
];

interface ATMStepIndicatorProps {
  currentView: ATMView;
}

export function ATMStepIndicator({ currentView }: ATMStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.view === currentView);

  return (
    <div className="mt-2 flex items-center gap-1.5" aria-label="ATM progress">
      {STEPS.map((step, index) => {
        const active = step.view === currentView;
        const complete = index < currentIndex;

        return (
          <div key={step.view} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span
                className={cn(
                  "h-px w-4",
                  complete || active ? "bg-[var(--bd-primary)]" : "bg-[var(--bd)]",
                )}
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "radius-chip px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                active
                  ? "bg-primary text-primary-foreground"
                  : complete
                    ? "border border-[var(--bd-primary)] text-primary"
                    : "border border-[var(--bd)] text-[var(--tx-3)]",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
