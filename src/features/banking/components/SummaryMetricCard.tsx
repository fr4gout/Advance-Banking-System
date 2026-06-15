import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface SummaryMetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  subtitleTone?: "up" | "down" | "neutral";
  icon?: ReactNode;
  className?: string;
  variant?: "panel" | "plain";
}

function MetricContent({
  label,
  value,
  subtitle,
  subtitleTone,
  icon,
}: Pick<SummaryMetricCardProps, "label" | "value" | "subtitle" | "subtitleTone" | "icon">) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--tx-2)]">{label}</div>
        {icon ? <div className="text-primary/70">{icon}</div> : null}
      </div>
      <div className="text-lg font-bold tracking-tight text-[var(--tx)]">{value}</div>
      {subtitle ? (
        <div
          className={cn(
            "text-[10px] font-medium",
            subtitleTone === "up" && "text-[var(--c-green)]",
            subtitleTone === "down" && "text-[var(--c-red)]",
            subtitleTone === "neutral" && "text-[var(--tx-2)]",
          )}
        >
          {subtitle}
        </div>
      ) : null}
    </>
  );
}

export function SummaryMetricCard({
  label,
  value,
  subtitle,
  subtitleTone = "neutral",
  icon,
  className,
  variant = "panel",
}: SummaryMetricCardProps) {
  if (variant === "plain") {
    return (
      <div
        className={cn(
          "flex flex-col gap-1 radius-control border border-[var(--bd)] bg-[var(--bg-row)] p-2.5",
          className,
        )}
      >
        <MetricContent
          label={label}
          value={value}
          subtitle={subtitle}
          subtitleTone={subtitleTone}
          icon={icon}
        />
      </div>
    );
  }

  return (
    <GlassCard inset className={cn("flex flex-col gap-1 p-3", className)}>
      <MetricContent
        label={label}
        value={value}
        subtitle={subtitle}
        subtitleTone={subtitleTone}
        icon={icon}
      />
    </GlassCard>
  );
}
