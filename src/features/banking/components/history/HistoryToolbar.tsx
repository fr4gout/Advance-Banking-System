import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HISTORY_FILTERS, type HistoryTypeFilter } from "./historyTypes";

interface HistoryToolbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  filter: HistoryTypeFilter;
  onFilterChange: (f: HistoryTypeFilter) => void;
  className?: string;
}

export function HistoryToolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  className,
}: HistoryToolbarProps) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex min-w-0 flex-1 items-center gap-2 radius-control border border-[var(--bd)] bg-[var(--bg-card)] px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-[var(--tx-2)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search title, memo, party…"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--tx)] outline-none placeholder:text-[var(--tx-2)]"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="text-[var(--tx-2)] transition hover:text-[var(--tx)]"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {HISTORY_FILTERS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onFilterChange(opt.id)}
            className={cn(
              "radius-chip px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition",
              filter === opt.id ? "bg-primary text-primary-foreground" : "text-[var(--tx-2)] hover:bg-[var(--bg-row)] hover:text-[var(--tx)]",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

