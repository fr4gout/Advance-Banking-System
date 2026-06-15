import { cn } from "@/lib/utils";
import { formatMoneySigned } from "../../hooks/useCurrency";

interface HistorySummaryStripProps {
  showing: number;
  total: number;
  totalIn: number;
  totalOut: number;
  className?: string;
}

export function HistorySummaryStrip({
  showing,
  total,
  totalIn,
  totalOut,
  className,
}: HistorySummaryStripProps) {
  return (
    <div className={cn("grid grid-cols-12 gap-3", className)}>
      <div className="col-span-4">
        <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">Showing</div>
        <div className="mt-1 text-sm font-semibold text-white">
          {showing} <span className="text-white/40">of</span> {total}
        </div>
      </div>

      <div className="col-span-4">
        <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">Total In</div>
        <div className="mt-1 font-mono text-sm font-semibold text-emerald-300">
          {formatMoneySigned(Math.abs(totalIn))}
          <span className="ml-1 text-[10px] font-sans font-medium text-white/35">USD</span>
        </div>
      </div>

      <div className="col-span-4 text-right">
        <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">Total Out</div>
        <div className="mt-1 font-mono text-sm font-semibold text-rose-300">
          {formatMoneySigned(-Math.abs(totalOut))}
          <span className="ml-1 text-[10px] font-sans font-medium text-white/35">USD</span>
        </div>
      </div>
    </div>
  );
}

