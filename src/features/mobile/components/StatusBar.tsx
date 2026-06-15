import { cn } from "@/lib/utils";
import { Battery, Signal, Wifi } from "lucide-react";
import { useMobileClock } from "../hooks/useMobileClock";

interface StatusBarProps {
  transparent?: boolean;
}

export function StatusBar({ transparent = false }: StatusBarProps) {
  const { time } = useMobileClock();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 pb-1 pt-1 text-[11px] font-medium",
        transparent
          ? "pointer-events-none absolute inset-x-0 top-0 z-30 text-[var(--tx)]"
          : "relative z-20 shrink-0 text-[var(--tx)]",
      )}
    >
      <span className="tabular-nums">{time}</span>
      <div
        className={cn(
          "flex items-center gap-1.5",
          transparent ? "text-[var(--tx)]" : "text-[var(--tx-2)]",
        )}
      >
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <Battery className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
