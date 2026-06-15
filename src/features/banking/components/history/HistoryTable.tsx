import { cn } from "@/lib/utils";
import { PanelScroll } from "../PanelScroll";
import type { Transaction } from "../../types/banking";
import { HistoryRow } from "./HistoryRow";

interface HistoryTableProps {
  rows: Transaction[];
  className?: string;
}

export function HistoryTable({ rows, className }: HistoryTableProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      <div className="sticky top-0 z-10 grid shrink-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_100px_72px] gap-4 border-b border-[var(--bd)] bg-[var(--bg-panel)] px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--tx-3)]">
        <div>Description</div>
        <div>Party</div>
        <div>Type</div>
        <div className="text-right">Amount</div>
        <div className="text-right">When</div>
      </div>

      <PanelScroll className="min-h-0 flex-1">
        <div className="flex flex-col gap-1.5 p-0.5">
          {rows.map((tx) => (
            <HistoryRow key={tx.id} tx={tx} />
          ))}
        </div>
      </PanelScroll>
    </div>
  );
}

