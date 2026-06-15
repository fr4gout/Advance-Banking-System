import { ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransferMode } from "../../utils/transferLimits";

const MODES: {
  id: TransferMode;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "deposit", label: "Deposit", subtitle: "Cash to bank", icon: ArrowDownToLine },
  { id: "withdraw", label: "Withdraw", subtitle: "Bank to cash", icon: ArrowUpFromLine },
  { id: "transfer", label: "Transfer", subtitle: "Send to someone", icon: Send },
];

interface TransferModeTabsProps {
  mode: TransferMode;
  onModeChange: (mode: TransferMode) => void;
  className?: string;
}

export function TransferModeTabs({ mode, onModeChange, className }: TransferModeTabsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={cn(
              "flex items-center gap-3 radius-control border px-4 py-3 text-left transition",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "panel-card text-[var(--tx)] hover:border-[var(--bd-primary)] hover:bg-[var(--primary-08)]",
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary-foreground" : "text-white/50")} />
            <div className="min-w-0">
              <div className="text-sm font-semibold">{m.label}</div>
              <div className={cn("text-[10px]", active ? "text-primary-foreground/70" : "text-white/40")}>
                {m.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
