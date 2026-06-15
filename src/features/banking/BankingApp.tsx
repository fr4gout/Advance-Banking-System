import { useEffect, useState } from "react";
import { BankingProvider, useBanking } from "./context/BankingContext";
import { CanvasFrame } from "./layout/CanvasFrame";
import { Sidebar } from "./layout/Sidebar";
import { TopBar } from "./layout/TopBar";
import { BankingCommandPalette } from "./components/BankingCommandPalette";
import { AppViewToggle } from "./components/AppViewToggle";
import { DashboardView } from "./views/DashboardView";
import { TransfersView } from "./views/TransfersView";
import { AccountsView } from "./views/AccountsView";
import { InvoicesView } from "./views/InvoicesView";
import { CardsView } from "./views/CardsView";
import { LoansView } from "./views/LoansView";
import { ATMApp } from "@/features/atm/ATMApp";
import { ATMProvider } from "@/features/atm/store/atmStore";
import { MobileApp } from "@/features/mobile/MobileApp";
import { MobileProvider } from "@/features/mobile/store/mobileStore";
import { isNuiEnvironment, useNuiEvent } from "./nui/bridge";
import { Toaster } from "@/components/ui/sonner";

type ActiveApp = "banking" | "atm" | "mobile";

function Inner() {
  const { view, isVisible } = useBanking();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <CanvasFrame>
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-hidden p-4">
          {view === "dashboard" && <DashboardView />}
          {view === "transfers" && <TransfersView />}
          {view === "accounts" && <AccountsView />}
          {view === "cards" && <CardsView />}
          {view === "loans" && <LoansView />}
          {view === "invoices" && <InvoicesView />}
        </main>
      </div>
      <BankingCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </CanvasFrame>
  );
}

function AppShell({ activeApp }: { activeApp: ActiveApp }) {
  return (
    <>
      <div className={activeApp === "banking" ? "contents" : "hidden"}>
        <Inner />
      </div>
      <div className={activeApp === "atm" ? "contents" : "hidden"}>
        <ATMApp />
      </div>
      <div className={activeApp === "mobile" ? "contents" : "hidden"}>
        <MobileApp />
      </div>
    </>
  );
}

export function BankingApp() {
  const [activeApp, setActiveApp] = useState<ActiveApp>("banking");

  useNuiEvent<boolean>("setVisible", (visible) => {
    if (visible) setActiveApp("banking");
  });

  useNuiEvent("OpenATM", () => {
    setActiveApp("atm");
  });

  return (
    <>
      <BankingProvider>
        <ATMProvider>
          <MobileProvider>
            <AppShell activeApp={activeApp} />
            {!isNuiEnvironment() ? (
              <AppViewToggle activeApp={activeApp} onChange={setActiveApp} />
            ) : null}
          </MobileProvider>
        </ATMProvider>
      </BankingProvider>
      <Toaster position="top-right" richColors />
    </>
  );
}
