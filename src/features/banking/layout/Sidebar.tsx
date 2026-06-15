import { useState } from "react";
import {
  ArrowLeftRight,
  Banknote,
  CreditCard,
  Landmark,
  LayoutDashboard,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "../context/BankingContext";
import { ThemeSettingsModal } from "../components/ThemeSettingsModal";
import { BankLogo } from "../components/BankLogo";
import { getBankThemeConfig } from "../hooks/useBankTheme";
import type { ViewKey } from "../types/banking";

const items: { key: ViewKey; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "transfers", label: "Transfers", icon: ArrowLeftRight },
  { key: "loans", label: "Loans", icon: Banknote },
  { key: "accounts", label: "Accounts", icon: Landmark },
  { key: "cards", label: "Cards", icon: CreditCard },
];

export function Sidebar() {
  const { view, setView, character, setTransfersPanel, bankTheme } =
    useBanking();
  const [themeOpen, setThemeOpen] = useState(false);
  const initials = `${character.firstName[0]}${character.lastName[0]}`;
  const bankConfig = getBankThemeConfig(bankTheme);
  const bankName = bankConfig.name;
  const hasBankLogo = Boolean(bankConfig.logoSrc);

  return (
    <>
      <aside className="flex w-[72px] shrink-0 flex-col items-center border-r border-[var(--bd)] bg-[var(--bg-surface)] py-4">
        <button
          type="button"
          onClick={() => setView("dashboard")}
          className={cn(
            "motion-interactive flex h-10 w-10 items-center justify-center radius-chip hover:opacity-90",
            hasBankLogo
              ? "border-transparent bg-transparent"
              : "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]",
          )}
          title={bankName}
        >
          <BankLogo variant="sidebar" />
        </button>

        <div className="my-3 h-px w-8 bg-[var(--bd)]" aria-hidden />

        <nav className="flex w-full flex-1 flex-col items-center gap-2 px-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = it.key === view;
            return (
              <button
                key={it.key}
                type="button"
                title={it.label}
                onClick={() => {
                  if (it.key === "transfers") setTransfersPanel("send");
                  setView(it.key);
                }}
                className="group relative flex h-11 w-full items-center justify-center"
              >
                {active ? (
                  <span
                    aria-hidden
                    className="motion-nav-indicator absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_var(--primary)]"
                  />
                ) : null}

                <span
                  className={cn(
                    "motion-interactive flex h-10 w-10 items-center justify-center radius-chip border",
                    active
                      ? "border-[var(--bd-primary)] bg-[var(--primary-15)] text-primary"
                      : "border-transparent text-[var(--tx-3)] group-hover:border-[var(--bd)] group-hover:bg-[var(--bg-row)] group-hover:text-[var(--tx-2)]",
                  )}
                >
                  <Icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                </span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setThemeOpen(true)}
          title="Theme & profile"
          className="motion-interactive mt-2 flex h-10 w-10 items-center justify-center radius-chip text-xs font-semibold text-[var(--tx)] ring-2 ring-[var(--primary-30)] hover:ring-[var(--bd-primary)]"
          style={{
            background:
              "linear-gradient(to bottom right, var(--primary), color-mix(in oklch, var(--primary) 60%, oklch(0.45 0.2 270)))",
          }}
        >
          {initials}
        </button>
      </aside>

      <ThemeSettingsModal open={themeOpen} onOpenChange={setThemeOpen} />
    </>
  );
}
