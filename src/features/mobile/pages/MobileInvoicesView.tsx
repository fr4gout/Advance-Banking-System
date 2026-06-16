import { useMemo, useState } from "react";
import { AlertTriangle, FileText, Landmark, Receipt, Zap } from "lucide-react";
import { useBanking } from "@/features/banking/context/BankingContext";
import { formatMoney } from "@/features/banking/hooks/useCurrency";
import {
  notifyBankingError,
  notifyBankingSuccess,
} from "@/features/banking/utils/bankingNotify";
import type { Invoice } from "@/features/banking/types/banking";
import { MobileEmptyState } from "../components/ui/MobileEmptyState";
import { MobileInvoicePaySheet } from "../components/ui/MobileInvoicePaySheet";
import { MobileInvoiceRow } from "../components/ui/MobileInvoiceRow";
import { MobileScreen } from "../components/ui/MobileScreen";
import { MobileSegmentedControl } from "../components/ui/MobileSegmentedControl";
import { useMobile } from "../hooks/useMobile";

type InvoiceFilter = "unpaid" | "paid";

const iconFor = (cat: Invoice["category"]) => {
  switch (cat) {
    case "fine":
      return AlertTriangle;
    case "utility":
      return Zap;
    case "tax":
      return Landmark;
    default:
      return FileText;
  }
};

export function MobileInvoicesView() {
  const { invoices, activeAccount, payInvoice } = useBanking();
  const { selectedInvoiceId, setSelectedInvoiceId } = useMobile();
  const [filter, setFilter] = useState<InvoiceFilter>("unpaid");

  const selected = invoices.find((i) => i.id === selectedInvoiceId) ?? null;

  const filtered = useMemo(
    () =>
      invoices.filter((inv) =>
        filter === "paid" ? inv.status === "paid" : inv.status !== "paid",
      ),
    [invoices, filter],
  );

  const handlePay = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    if (activeAccount.balance < inv.amount) {
      notifyBankingError("Insufficient balance");
      return;
    }
    payInvoice(id);
    notifyBankingSuccess(`Paid ${formatMoney(inv.amount)}`);
    setSelectedInvoiceId(null);
  };

  return (
    <>
      <MobileScreen
        stickyHeader={
          <div className="shrink-0 px-4 pb-3 pt-1">
            <h2 className="text-xl font-semibold tracking-tight text-[var(--tx)]">
              Invoices
            </h2>
            <MobileSegmentedControl
              className="mt-3"
              value={filter}
              onChange={(id) => setFilter(id as InvoiceFilter)}
              options={[
                { id: "unpaid", label: "Unpaid" },
                { id: "paid", label: "Paid" },
              ]}
            />
          </div>
        }
        scrollClassName="gap-2.5"
      >
        {filtered.length === 0 ? (
          <MobileEmptyState
            icon={Receipt}
            title={filter === "paid" ? "No paid bills" : "No unpaid bills"}
            description={
              filter === "paid"
                ? "Paid invoices will appear here."
                : "You're all caught up."
            }
          />
        ) : (
          filtered.map((inv, i) => {
            const Icon = iconFor(inv.category);
            return (
              <MobileInvoiceRow
                key={inv.id}
                icon={Icon}
                sender={inv.sender}
                reason={inv.reason}
                amount={formatMoney(inv.amount)}
                stagger={(Math.min(i, 4) + 1) as 1 | 2 | 3 | 4 | 5}
                onClick={() => setSelectedInvoiceId(inv.id)}
              />
            );
          })
        )}
      </MobileScreen>

      <MobileInvoicePaySheet
        open={selected !== null}
        invoice={selected}
        onClose={() => setSelectedInvoiceId(null)}
        onPay={() => selected && handlePay(selected.id)}
        payDisabled={selected ? activeAccount.balance < selected.amount : false}
      />
    </>
  );
}
