import { cn } from "@/lib/utils";
import { useATMContext } from "@/features/atm/store/atmStore";
import { useMobileContext } from "@/features/mobile/store/mobileStore";

type ActiveApp = "banking" | "atm" | "mobile";

interface AppViewToggleProps {
  activeApp: ActiveApp;
  onChange: (app: ActiveApp) => void;
}

export function AppViewToggle({ activeApp, onChange }: AppViewToggleProps) {
  const { openATM, closeATM } = useATMContext();
  const { openMobile, closeMobile } = useMobileContext();

  const select = (app: ActiveApp) => {
    if (app === activeApp) return;
    if (app === "atm") {
      closeMobile();
      openATM();
    } else if (app === "mobile") {
      closeATM();
      openMobile();
    } else {
      closeATM();
      closeMobile();
    }
    onChange(app);
  };

  const btn = (app: ActiveApp, label: string) => (
    <button
      type="button"
      onClick={() => select(app)}
      className={cn(
        "motion-interactive radius-chip px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition",
        activeApp === app
          ? "bg-primary text-primary-foreground"
          : "text-[var(--tx-2)] hover:text-[var(--tx)]",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-full border border-[var(--bd)] bg-[var(--bg-panel)] p-1 shadow-[var(--shadow-elevated)]">
      {btn("banking", "Banking")}
      {btn("atm", "ATM")}
      {btn("mobile", "Mobile")}
    </div>
  );
}
