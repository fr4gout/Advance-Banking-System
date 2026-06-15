import {
  CreditCard,
  FileText,
  Home,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "../hooks/useMobile";
import type { MobileTab } from "../types/mobile";

const tabs: { id: MobileTab; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "transfer", label: "Send", icon: Send },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "invoices", label: "Bills", icon: FileText },
  { id: "contacts", label: "People", icon: Users },
];

export function BottomTabBar() {
  const { activeTab, setTab, isLocked } = useMobile();

  if (isLocked) return null;

  return (
    <nav className="relative shrink-0 px-4 pb-2 pt-1">
      <div className="relative grid grid-cols-5 rounded-full border border-[var(--bd)] bg-[var(--bg-card)] px-1 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={cn(
                "mobile-press flex min-h-[44px] flex-col items-center justify-center gap-0.5 px-1 py-1.5",
                active
                  ? "rounded-2xl bg-[var(--bg-row-alt)] text-primary"
                  : "text-[var(--tx-3)]",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-transform duration-[var(--mobile-duration-base)]",
                  active && "scale-[1.12]",
                )}
                style={
                  active
                    ? { transitionTimingFunction: "var(--mobile-spring)" }
                    : undefined
                }
              />
              <span className="text-[9px] font-medium tracking-wide">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
