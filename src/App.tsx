/**
 * App.tsx — State-based NUI router (replaces TanStack Start file-based routing).
 *
 * View switching is driven entirely by NUI messages from client.lua:
 *   { action: "openDesktop" }  → desktop banking app
 *   { action: "openATM" }      → ATM terminal
 *   { action: "openMobile" }   → mobile banking (also triggered by YSeries phone)
 *
 * All three providers are mounted unconditionally so that Zustand/context state
 * is never torn down when the player switches between views.
 *
 * In browser dev mode (non-NUI), the AppViewToggle debug bar appears so you
 * can switch surfaces without a game client.
 */

import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BankingProvider } from "@/features/banking/context/BankingContext";
import { ATMProvider } from "@/features/atm/store/atmStore";
import { MobileProvider } from "@/features/mobile/store/mobileStore";
import { BankingApp } from "@/features/banking/BankingApp";
import { ATMApp } from "@/features/atm/ATMApp";
import { MobileApp } from "@/features/mobile/MobileApp";
import { AppViewToggle } from "@/features/banking/components/AppViewToggle";
import { Toaster } from "@/components/ui/sonner";
import { isNuiEnvironment, useNuiEvent } from "@/features/banking/nui/bridge";

// ── types ────────────────────────────────────────────────────────────────────

type ActiveApp = "banking" | "atm" | "mobile";

// ── singleton QueryClient ─────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // NUI doesn't have network access to external APIs — keep stale data
      staleTime: Infinity,
      retry: false,
    },
  },
});

// ── AppShell — renders the active surface ────────────────────────────────────

function AppShell({ activeApp }: { activeApp: ActiveApp }) {
  return (
    <>
      {/* Always mounted; visibility controlled by each app's own isVisible state */}
      <div className={activeApp === "banking" ? "contents" : "hidden"}>
        <BankingApp />
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

// ── NuiRouter — listens for NUI view-switch events ───────────────────────────

function NuiRouter({
  activeApp,
  setActiveApp,
}: {
  activeApp: ActiveApp;
  setActiveApp: (app: ActiveApp) => void;
}) {
  // Desktop banking surface (standard bank terminal)
  const onOpenDesktop = useCallback(() => setActiveApp("banking"), [setActiveApp]);
  useNuiEvent("openDesktop", onOpenDesktop);

  // ATM surface
  const onOpenATM = useCallback(() => setActiveApp("atm"), [setActiveApp]);
  useNuiEvent("openATM", onOpenATM);
  // Also handle legacy uppercase event name for backward compatibility
  useNuiEvent("OpenATM", onOpenATM);

  // Mobile banking surface — triggered by YSeries phone custom app iframe
  const onOpenMobile = useCallback(() => setActiveApp("mobile"), [setActiveApp]);
  useNuiEvent("openMobile", onOpenMobile);

  // setVisible without context switches back to desktop banking
  const onSetVisible = useCallback(
    (visible: boolean) => {
      if (visible) setActiveApp("banking");
    },
    [setActiveApp],
  );
  useNuiEvent<boolean>("setVisible", onSetVisible);

  return null;
}

// ── App — root component ─────────────────────────────────────────────────────

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveApp>("banking");

  return (
    <QueryClientProvider client={queryClient}>
      <BankingProvider>
        <ATMProvider>
          <MobileProvider>
            {/* NUI event listener — no DOM output */}
            <NuiRouter activeApp={activeApp} setActiveApp={setActiveApp} />

            {/* Active surface */}
            <AppShell activeApp={activeApp} />

            {/* Dev-mode surface switcher — hidden inside FiveM */}
            {!isNuiEnvironment() && (
              <AppViewToggle activeApp={activeApp} onChange={setActiveApp} />
            )}
          </MobileProvider>
        </ATMProvider>
      </BankingProvider>

      {/* Toast notifications — rendered outside providers so they survive view switches */}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
