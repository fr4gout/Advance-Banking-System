import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "../context/BankingContext";
import { TransactionRow } from "./TransactionRow";
import { filterTransactions } from "../utils/transactionFilter";
import type { TxFilterCategory } from "../types/banking";

const FILTER_OPTIONS: { value: TxFilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "salary", label: "Salary" },
  { value: "transfers", label: "Transfers" },
  { value: "purchases", label: "Purchases" },
  { value: "invoices", label: "Invoices" },
  { value: "deposits", label: "Deposits" },
  { value: "withdrawals", label: "Withdrawals" },
];

export function TransactionSearch() {
  const { activeAccount, transactions, transactionSearch, setTransactionSearch, clearTransactionSearch } =
    useBanking();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => filterTransactions(transactions, activeAccount.id, transactionSearch).slice(0, 8),
    [transactions, activeAccount.id, transactionSearch],
  );

  const hasQuery = transactionSearch.query.trim().length > 0 || transactionSearch.category !== "all";

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 radius-control border border-[var(--bd)] bg-[var(--bg-card)] px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-[var(--tx-2)]" />
        <input
          type="search"
          value={transactionSearch.query}
          onChange={(e) => {
            setTransactionSearch({ query: e.target.value });
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search transactions…"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--tx)] outline-none placeholder:text-[var(--tx-2)]"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              clearTransactionSearch();
              setOpen(false);
            }}
            className="text-[var(--tx-2)] transition hover:text-[var(--tx)]"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="panel-modal radius-card absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden shadow-[var(--shadow-glow)]">
          <div className="flex flex-wrap gap-1.5 border-b border-[var(--bd)] p-3">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTransactionSearch({ category: opt.value })}
                className={cn(
                  "radius-chip px-2.5 py-1 text-[11px] font-medium transition",
                  transactionSearch.category === opt.value
                    ? "bg-[var(--primary-15)] text-primary"
                    : "text-[var(--tx-2)] hover:bg-[var(--bg-row)] hover:text-[var(--tx)]",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-[var(--tx-2)]">
                No transactions match your search.
              </div>
            ) : (
              results.map((tx) => <TransactionRow key={tx.id} tx={tx} showNote />)
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
