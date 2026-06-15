import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CanvasFrame } from "@/features/banking/layout/CanvasFrame";
import { BottomTabBar } from "./components/BottomTabBar";
import { MobileDevTestBill } from "./components/MobileDevTestBill";
import { PhoneWrapper } from "./components/PhoneWrapper";
import { StatusBar } from "./components/StatusBar";
import { MobileScreenTransition } from "./components/ui/MobileScreenTransition";
import { useMobile } from "./hooks/useMobile";
import { MobileCardsView } from "./pages/MobileCardsView";
import { MobileContactsView } from "./pages/MobileContactsView";
import { MobileDashboard } from "./pages/MobileDashboard";
import { MobileInvoicesView } from "./pages/MobileInvoicesView";
import { MobileLockScreen } from "./pages/MobileLockScreen";
import { MobileTransferView } from "./pages/MobileTransferView";
import type { MobileTab } from "./types/mobile";

function MobileScreen() {
  const { isLocked, isUnlocking, activeTab, tabDirection } = useMobile();

  const screens: Record<MobileTab, ReactNode> = {
    dashboard: <MobileDashboard />,
    transfer: <MobileTransferView />,
    cards: <MobileCardsView />,
    invoices: <MobileInvoicesView />,
    contacts: <MobileContactsView />,
  };

  if (isLocked || isUnlocking) {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col", isUnlocking && "mobile-unlock")}>
        <MobileLockScreen />
      </div>
    );
  }

  return (
    <MobileScreenTransition activeKey={activeTab} direction={tabDirection}>
      {screens[activeTab]}
    </MobileScreenTransition>
  );
}

function MobileRoot() {
  const { isVisible, closeMobile, activeTab } = useMobile();
  const immersive = activeTab === "dashboard";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMobile]);

  if (!isVisible) return null;

  return (
    <CanvasFrame bare>
      <MobileDevTestBill />
      <PhoneWrapper footer={<BottomTabBar />}>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <StatusBar transparent={immersive} />
          <MobileScreen />
        </div>
      </PhoneWrapper>
    </CanvasFrame>
  );
}

export function MobileApp() {
  return <MobileRoot />;
}
