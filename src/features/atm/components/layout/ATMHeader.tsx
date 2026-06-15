import { X } from "lucide-react";
import { BankLogo } from "@/features/banking/components/BankLogo";
import { useATM } from "../../hooks/useATM";
import { Button } from "../shared/Button";
import { ATMStepIndicator } from "./ATMStepIndicator";

export function ATMHeader() {
  const { currentView, closeATM, goBack } = useATM();

  const titles: Record<string, string> = {
    SELECT_CARD: "Insert Card",
    PIN_ENTRY: "PIN Verification",
    DASHBOARD: "ATM Dashboard",
  };

  return (
    <header className="shrink-0 border-b border-[var(--bd)] px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <BankLogo variant="sidebar" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--tx-2)]">
              Secure Terminal
            </p>
            <h1 className="truncate text-base font-semibold text-[var(--tx)]">
              {titles[currentView]}
            </h1>
            <ATMStepIndicator currentView={currentView} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {currentView !== "SELECT_CARD" ? (
            <Button variant="ghost" size="sm" onClick={goBack}>
              Back
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={closeATM} aria-label="Close ATM">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
