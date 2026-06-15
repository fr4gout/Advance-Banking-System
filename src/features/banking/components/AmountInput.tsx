import { useState } from "react";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  max?: number;
  onSubmit: (amount: number) => void;
  cta: string;
  tone?: "accent" | "danger";
  quick?: number[];
  placeholder?: string;
}

export function AmountInput({
  max,
  onSubmit,
  cta,
  tone = "accent",
  quick = [100, 500, 1000, 5000],
  placeholder = "0",
}: AmountInputProps) {
  const [raw, setRaw] = useState("");

  const value = Number(raw.replace(/[^\d.]/g, "")) || 0;
  const invalid = value <= 0 || (max !== undefined && value > max);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--bd-primary)] bg-[var(--bg-surface)] px-4 py-3">
        <span className="text-[var(--tx-2)]">$</span>
        <input
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xl font-semibold text-[var(--tx)] outline-none placeholder:text-[var(--tx-3)]"
        />
        {max !== undefined ? (
          <button
            type="button"
            onClick={() => setRaw(String(max))}
            className="radius-chip px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary hover:bg-[var(--primary-15)]"
          >
            Max
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {quick.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setRaw(String(q))}
            className="radius-chip border border-[var(--bd)] px-3 py-1 text-xs text-[var(--tx-2)] transition hover:border-[var(--bd-primary)] hover:text-[var(--tx)]"
          >
            ${q.toLocaleString()}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={invalid}
        onClick={() => {
          onSubmit(value);
          setRaw("");
        }}
        className={cn(
          "group relative h-11 overflow-hidden radius-control text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40",
          tone === "accent" && "bg-primary text-primary-foreground hover:opacity-90",
          tone === "danger" && "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
        )}
      >
        {cta}
      </button>
    </div>
  );
}
