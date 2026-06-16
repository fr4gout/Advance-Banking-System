/**
 * BankingApp.tsx
 *
 * Renders the desktop banking surface (sidebar + top bar + view panels).
 * Providers (BankingProvider, ATMProvider, MobileProvider, QueryClientProvider)
 * are now owned by App.tsx at the root level — do NOT re-add them here.
 *
 * The NUI event routing (openDesktop / openATM / openMobile) is also handled
 * by App.tsx. BankingApp only concerns itself with the internal banking view
 * (dashboard, transfers, accounts, etc.) and its own keyboard shortcut.
 */

import { useEffect, useState } from "react";
import { useBanking } from "./context/BankingContext";
import { CanvasFrame } from "./layout/CanvasFrame";
import { Sidebar } from "./layout/Sidebar";
import { TopBar } from "./layout/TopBar";
import { BankingCommandPalette } from "./components/BankingCommandPalette";
import { DashboardView } from "./views/DashboardView";
import { TransfersView } from "./views/TransfersView";
import { AccountsView } from "./views/AccountsView";
import { InvoicesView } from "./views/InvoicesView";
import { CardsView } from "./views/CardsView";
import { LoansView } from "./views/LoansView";

export function BankingApp() {
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
