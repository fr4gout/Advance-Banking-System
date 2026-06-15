import { useEffect, type ReactNode } from "react";
import { CanvasFrame } from "@/features/banking/layout/CanvasFrame";
import { PanelScroll } from "@/features/banking/components/PanelScroll";
import { ATMFooter } from "./components/layout/ATMFooter";
import { ATMHeader } from "./components/layout/ATMHeader";
import { useATM } from "./hooks/useATM";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { CardSelectionView } from "./pages/CardSelectionView";
import { DashboardView } from "./pages/DashboardView";
import { PinEntryView } from "./pages/PinEntryView";
import type { ATMView } from "./types/atm";

function ATMContent() {
  const { currentView } = useATM();

  const views: Record<ATMView, ReactNode> = {
    SELECT_CARD: <CardSelectionView />,
    PIN_ENTRY: <PinEntryView />,
    DASHBOARD: <DashboardView />,
  };

  return <main key={currentView}>{views[currentView]}</main>;
}

function ATMRoot() {
  const { isVisible, closeATM } = useATM();
  useNuiEvent();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeATM();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeATM]);

  if (!isVisible) return null;

  return (
    <CanvasFrame bare>
      <div className="panel-shell flex h-[min(92vh,900px)] w-full max-w-[420px] min-h-0 flex-col overflow-hidden shadow-[var(--shadow-elevated)] animate-modal-in">
        <ATMHeader />
        <PanelScroll>
          <ATMContent />
        </PanelScroll>
        <ATMFooter />
      </div>
    </CanvasFrame>
  );
}

export function ATMApp() {
  return <ATMRoot />;
}
