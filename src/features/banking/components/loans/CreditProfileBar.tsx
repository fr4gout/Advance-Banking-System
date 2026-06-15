import { useId } from "react";
import { cn } from "@/lib/utils";
import type { CreditProfile } from "../../types/banking";
import { tierLabel } from "../../utils/loanEligibility";

interface CreditProfileBarProps {
  profile: CreditProfile;
}

function ScoreGauge({ score, min, max }: { score: number; min: number; max: number }) {
  const filterId = useId().replace(/:/g, "");
  const pct = Math.min(1, Math.max(0, (score - min) / (max - min)));
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  return (
    <div className="relative size-16 shrink-0 bg-transparent">
      <svg
        className="size-16 -rotate-90 overflow-visible"
        viewBox="0 0 64 64"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="var(--primary)" floodOpacity="0.85" />
          </filter>
        </defs>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          filter={`url(#${filterId})`}
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-white">
        {score}
      </span>
    </div>
  );
}

export function CreditProfileBar({ profile }: CreditProfileBarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-4 radius-control border border-white/8 bg-black/25 px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <ScoreGauge score={profile.score} min={profile.rangeMin} max={profile.rangeMax} />
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">Credit Score</div>
          <div className="text-sm font-semibold text-white">
            {tierLabel(profile.tier)} Tier · {profile.rangeMin}–{profile.rangeMax}
          </div>
          <div className="truncate text-xs text-white/45">{profile.holderName}</div>
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 radius-chip px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
          profile.tier === "gold"
            ? "bg-primary/20 text-primary ring-1 ring-primary/40"
            : "bg-white/5 text-white/70 ring-1 ring-white/10",
        )}
      >
        {tierLabel(profile.tier)}
      </span>
    </div>
  );
}
