import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricTileProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon?: ReactNode;
  className?: string;
}

export function MetricTile({ label, value, delta, deltaTone = "neutral", icon, className }: MetricTileProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
      {delta ? (
        <div
          className={cn(
            "text-xs font-medium",
            deltaTone === "up" && "text-emerald-400",
            deltaTone === "down" && "text-rose-400",
            deltaTone === "neutral" && "text-white/50",
          )}
        >
          {delta}
        </div>
      ) : null}
    </div>
  );
}
