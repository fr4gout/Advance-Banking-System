import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AccountSelect } from "../AccountSelect";
import { formatMoney } from "../../hooks/useCurrency";
import type { Account, LoanProduct } from "../../types/banking";

interface ApplyLoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: LoanProduct | null;
  accounts: Account[];
  activeAccountId: string;
  onSwitchAccount: (id: string) => void;
  onApply: (args: { accountId: string; productId: string; amount: number }) => void;
}

function estimateTotal(principal: number, apr: number, termDays: number): number {
  const interest = principal * (apr / 100) * (termDays / 365);
  return Math.round(principal + interest);
}

export function ApplyLoanModal({
  open,
  onOpenChange,
  product,
  accounts,
  activeAccountId,
  onSwitchAccount,
  onApply,
}: ApplyLoanModalProps) {
  const [amountRaw, setAmountRaw] = useState("");

  useEffect(() => {
    if (!open) {
      setAmountRaw("");
      return;
    }
    if (product) {
      setAmountRaw(String(product.maxAmount));
    }
  }, [open, product]);

  const amount = useMemo(() => {
    const n = Number(amountRaw.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [amountRaw]);

  const validation = useMemo(() => {
    if (!product) return { valid: false, message: "" };
    if (amount <= 0) return { valid: false, message: "Enter a loan amount" };
    if (amount < product.minAmount) {
      return { valid: false, message: `Minimum ${formatMoney(product.minAmount)}` };
    }
    if (amount > product.maxAmount) {
      return { valid: false, message: `Maximum ${formatMoney(product.maxAmount)}` };
    }
    return { valid: true, message: "" };
  }, [amount, product]);

  const totalDue = product ? estimateTotal(amount, product.apr, product.termDays) : 0;

  const submit = () => {
    if (!product || !validation.valid) return;
    onApply({ accountId: activeAccountId, productId: product.id, amount });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="panel-modal border-[var(--bd)] bg-[var(--bg-panel)] text-[var(--tx)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? `Apply — ${product.name}` : "Apply for loan"}</DialogTitle>
        </DialogHeader>

        {product ? (
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[var(--tx-2)]">
                Deposit to account
              </div>
              <AccountSelect
                accounts={accounts}
                activeAccountId={activeAccountId}
                onSwitch={onSwitchAccount}
              />
            </div>

            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[var(--tx-2)]">
                Loan amount
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-[var(--tx-2)]">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountRaw}
                  onChange={(e) => setAmountRaw(e.target.value.replace(/[^\d]/g, ""))}
                  className="h-12 w-full radius-control border border-[var(--bd)] bg-[var(--bg-surface)] pl-8 pr-3 text-lg font-bold tabular-nums text-[var(--tx)] outline-none focus:border-[var(--bd-primary)]"
                  placeholder="0"
                />
              </div>
              <div className="mt-1 text-[11px] text-[var(--tx-3)]">
                {formatMoney(product.minAmount)} – {formatMoney(product.maxAmount)}
              </div>
              {!validation.valid && amount > 0 ? (
                <div className="mt-1 text-xs text-rose-300">{validation.message}</div>
              ) : null}
            </div>

            <div className="radius-control border border-[var(--bd)] bg-[var(--bg-surface)] p-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <SummaryRow label="APR" value={`${product.apr}%`} />
                <SummaryRow label="Term" value={`${product.termDays} days`} />
                <SummaryRow label="Principal" value={formatMoney(amount)} />
                <SummaryRow label="Est. total" value={formatMoney(totalDue)} highlight />
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 items-center radius-control border border-[var(--bd)] px-4 text-[10px] font-bold uppercase tracking-wider text-[var(--tx-2)] transition hover:bg-[var(--bg-row)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!validation.valid || !product}
            onClick={submit}
            className={cn(
              "inline-flex h-9 items-center radius-control bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground transition",
              validation.valid ? "hover:opacity-90" : "cursor-not-allowed opacity-40",
            )}
          >
            Apply
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-[9px] font-medium uppercase tracking-widest text-[var(--tx-3)]">{label}</div>
      <div className={cn("font-semibold tabular-nums", highlight ? "text-primary" : "text-[var(--tx)]")}>
        {value}
      </div>
    </div>
  );
}
