import { AlertTriangle, FileText, Landmark, Zap } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { PanelScroll } from "../components/PanelScroll";
import { StatusBadge } from "../components/StatusBadge";
import { useBanking } from "../context/BankingContext";
import { formatMoney, formatRelative } from "../hooks/useCurrency";
import type { Invoice } from "../types/banking";

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

export function InvoicesView() {
  const { invoices, activeAccount, payInvoice } = useBanking();
  const outstanding = invoices.filter((i) => i.status !== "paid");
  const totalDue = outstanding.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-3">
      <GlassCard className="col-span-8 flex min-h-0 flex-col p-4">
        <div className="shrink-0">
          <SectionHeader title="Invoices & Bills" subtitle="Outstanding charges" />
        </div>
        <PanelScroll className="mt-1 flex flex-col gap-1.5">
          {invoices.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/40">No invoices on file.</div>
          ) : (
            invoices.map((inv) => {
              const Icon = iconFor(inv.category);
              const canPay = inv.status !== "paid" && activeAccount.balance >= inv.amount;
              return (
                <div
                  key={inv.id}
                  className="panel-card flex shrink-0 items-center gap-3 px-3 py-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center radius-chip bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-xs font-medium text-white">{inv.reason}</div>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="truncate text-[10px] text-white/40">
                      {inv.sender} · {inv.status === "paid" ? "Paid" : `Due ${formatRelative(inv.dueDate)}`}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-semibold tabular-nums text-white">{formatMoney(inv.amount)}</div>
                    <button
                      type="button"
                      onClick={() => payInvoice(inv.id)}
                      disabled={!canPay}
                      className="mt-0.5 radius-chip bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                    >
                      {inv.status === "paid" ? "Paid" : "Pay"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </PanelScroll>
      </GlassCard>

      <GlassCard className="col-span-4 flex h-full min-h-0 shrink-0 flex-col justify-between p-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">Total Outstanding</div>
          <div className="mt-1 text-2xl font-bold text-white">{formatMoney(totalDue)}</div>
          <div className="mt-0.5 text-[10px] text-white/40">
            {outstanding.length} unpaid · {activeAccount.name}
          </div>
        </div>
        <button
          type="button"
          disabled={outstanding.length === 0 || activeAccount.balance < totalDue}
          onClick={() => outstanding.forEach((i) => payInvoice(i.id))}
          className="mt-4 h-9 w-full radius-control bg-primary text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
        >
          Pay All
        </button>
      </GlassCard>
    </div>
  );
}
