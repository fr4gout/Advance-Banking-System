import { cn } from "@/lib/utils";
import { useBanking } from "@/features/banking/context/BankingContext";
import { useATMContext } from "@/features/atm/store/atmStore";
import { useMobileContext } from "@/features/mobile/store/mobileStore";

type ActiveApp = "banking" | "atm" | "mobile";

interface AppViewToggleProps {
  activeApp: ActiveApp;
  onChange: (app: ActiveApp) => void;
}

export function AppViewToggle({ activeApp, onChange }: AppViewToggleProps) {
  const { openBanking } = useBanking();
  const { openATM, closeATM } = useATMContext();
  const { openMobile, closeMobile } = useMobileContext();
  const tabs: Array<{ app: ActiveApp; label: string }> = [
    { app: "banking", label: "Banking" },
    { app: "atm", label: "ATM" },
    { app: "mobile", label: "Mobile" },
  ];

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
      openBanking();
    }
    onChange(app);
  };

  const btn = (app: ActiveApp, label: string) => (
    <button
      type="button"
      onClick={() => select(app)}
      aria-pressed={activeApp === app}
      className={cn(
        "motion-interactive radius-chip flex-1 px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em]",
        activeApp === app
          ? "border border-[var(--bd-primary)] bg-[var(--primary)] text-primary-foreground shadow-[0_8px_20px_-12px_var(--primary)]"
          : "border border-transparent text-[var(--tx-2)] hover:border-[var(--bd)] hover:bg-[var(--bg-row)] hover:text-[var(--tx)]",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-x-0 bottom-3 z-[100] flex justify-center px-3">
      <div className="flex w-full max-w-[340px] items-center gap-1.5 rounded-full border border-[var(--bd)] bg-[rgba(8,10,16,0.96)] p-1.5 shadow-[var(--shadow-elevated)]">
        {tabs.map(({ app, label }) => (
          <div key={app} className="flex flex-1">
            {btn(app, label)}
          </div>
        ))}
      </div>
    </div>
  );
}
