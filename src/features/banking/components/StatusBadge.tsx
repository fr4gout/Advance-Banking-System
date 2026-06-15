import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "../types/banking";

const tones: Record<InvoiceStatus, string> = {
  unpaid: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  overdue: "bg-rose-500/15 text-rose-300 border-rose-500/25",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
        tones[status],
      )}
    >
      {status}
    </span>
  );
}
