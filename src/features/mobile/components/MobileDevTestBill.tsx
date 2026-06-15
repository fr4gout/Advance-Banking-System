import { useEffect } from "react";
import { useBanking } from "@/features/banking/context/BankingContext";
import { isNuiEnvironment } from "@/features/banking/nui/bridge";
import { useMobile } from "../hooks/useMobile";

/** Dev-only: keep a test unpaid bill available when the mobile app is open. */
export function MobileDevTestBill() {
  const { ensureMobileTestInvoice } = useBanking();
  const { isVisible } = useMobile();

  useEffect(() => {
    if (isNuiEnvironment() || !isVisible) return;
    ensureMobileTestInvoice();
  }, [ensureMobileTestInvoice, isVisible]);

  return null;
}
