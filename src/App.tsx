/**
 * App.tsx — State-based NUI router.
 *
 * View switching is driven by NUI messages from client.lua:
 *   { action: "openDesktop" }  → desktop banking app
 *   { action: "openATM" }      → ATM terminal
 *   { action: "openMobile" }   → mobile banking (YSeries phone)
 *
 * All three providers stay mounted so context state survives surface switches.
 */

import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BankingProvider,
  useBanking,
} from "@/features/banking/context/BankingContext";
import { ATMProvider, useATMContext } from "@/features/atm/store/atmStore";
import {
  MobileProvider,
  useMobileContext,
} from "@/features/mobile/store/mobileStore";
import { BankingApp } from "@/features/banking/BankingApp";
import { ATMApp } from "@/features/atm/ATMApp";
import { MobileApp } from "@/features/mobile/MobileApp";
import { AppViewToggle } from "@/features/banking/components/AppViewToggle";
import { Toaster } from "@/components/ui/sonner";
import { isNuiEnvironment, useNuiEvent } from "@/features/banking/nui/bridge";

type ActiveApp = "banking" | "atm" | "mobile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
});

function AppShell({ activeApp }: { activeApp: ActiveApp }) {
  return (
    <>
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

function NuiRouter({
  activeApp,
  setActiveApp,
}: {
  activeApp: ActiveApp;
  setActiveApp: (app: ActiveApp) => void;
}) {
  const { openBanking } = useBanking();
  const { openATM, closeATM } = useATMContext();
  const { openMobile } = useMobileContext();

  const onOpenDesktop = useCallback(() => {
    setActiveApp("banking");
    openBanking();
  }, [openBanking, setActiveApp]);
  useNuiEvent("openDesktop", onOpenDesktop);

  const onOpenATM = useCallback(
    (data?: { balance?: number; atmLimit?: number }) => {
      setActiveApp("atm");
      openATM(data);
    },
    [openATM, setActiveApp],
  );
  useNuiEvent("openATM", onOpenATM);
  useNuiEvent("OpenATM", onOpenATM);

  const onOpenMobile = useCallback(() => {
    setActiveApp("mobile");
    openMobile();
  }, [openMobile, setActiveApp]);
  useNuiEvent("openMobile", onOpenMobile);

  const onSetVisible = useCallback(
    (visible: boolean) => {
      if (visible) {
        setActiveApp("banking");
        openBanking();
      }
    },
    [openBanking, setActiveApp],
  );
  useNuiEvent<boolean>("setVisible", onSetVisible);

  useNuiEvent("CloseATM", () => {
    if (activeApp === "atm") closeATM();
  });

  return null;
}

function AppContent() {
  const [activeApp, setActiveApp] = useState<ActiveApp>(
    isNuiEnvironment() ? "banking" : "banking",
  );

  return (
    <>
      <NuiRouter activeApp={activeApp} setActiveApp={setActiveApp} />
      <AppShell activeApp={activeApp} />
      {!isNuiEnvironment() && (
        <AppViewToggle activeApp={activeApp} onChange={setActiveApp} />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BankingProvider>
        <ATMProvider>
          <MobileProvider>
            <AppContent />
          </MobileProvider>
        </ATMProvider>
      </BankingProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
