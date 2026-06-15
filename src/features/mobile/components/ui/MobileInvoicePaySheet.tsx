import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/features/banking/types/banking";
import { formatDueDate, formatMoney } from "@/features/banking/hooks/useCurrency";
import { MobileSheet } from "./MobileSheet";

interface MobileInvoicePaySheetProps {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onPay: () => void;
  payDisabled?: boolean;
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-[var(--tx-2)]">{label}</span>
      <span className={cn("text-right text-sm text-[var(--tx)]", valueClassName)}>{value}</span>
    </div>
  );
}

function statusLabel(status: Invoice["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusColor(status: Invoice["status"]): string {
  if (status === "paid") return "text-[var(--c-green)]";
  return "text-[var(--c-orange)]";
}

export function MobileInvoicePaySheet({
  open,
  invoice,
  onClose,
  onPay,
  payDisabled = false,
}: MobileInvoicePaySheetProps) {
  return (
    <MobileSheet open={open && invoice !== null} onClose={onClose}>
      {invoice ? (
        <div className="relative pb-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mobile-press absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--bd)] text-[var(--tx-2)]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-10">
            <p className="text-[11px] text-[var(--tx-2)]">Amount due</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[var(--tx)]">
              {formatMoney(invoice.amount)}
            </p>
          </div>

          <div className="panel-card mt-5 flex flex-col gap-3 rounded-[var(--mobile-radius-lg)] border border-[var(--bd)] p-4">
            <DetailRow label="Issuer" value={invoice.sender} />
            <DetailRow label="Reason" value={invoice.reason} />
            <DetailRow label="Due" value={formatDueDate(invoice.dueDate)} />
            <DetailRow
              label="Status"
              value={statusLabel(invoice.status)}
              valueClassName={statusColor(invoice.status)}
            />
          </div>

          {invoice.status !== "paid" ? (
            <button
              type="button"
              onClick={onPay}
              disabled={payDisabled}
              className="mobile-press mt-5 mb-1 w-full rounded-full border border-[var(--bd-primary)] py-3.5 text-sm font-semibold text-primary disabled:opacity-40"
            >
              Pay invoice
            </button>
          ) : null}
        </div>
      ) : null}
    </MobileSheet>
  );
}
