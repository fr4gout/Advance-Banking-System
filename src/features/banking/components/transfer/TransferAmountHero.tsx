import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatMoney } from "../../hooks/useCurrency";

const QUICK_AMOUNTS = [50, 100, 500, 1000, 5000, 10000];

interface TransferAmountHeroProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  max: number;
}

export function TransferAmountHero({ amount, onAmountChange, max }: TransferAmountHeroProps) {
  const [raw, setRaw] = useState(amount > 0 ? String(amount) : "");
  const [hoveredChip, setHoveredChip] = useState<number | "max" | null>(null);

  useEffect(() => {
    setRaw(amount > 0 ? String(amount) : "");
  }, [amount]);

  const syncAmount = (next: number) => {
    const clamped = Math.min(Math.max(0, next), max);
    onAmountChange(clamped);
    setRaw(clamped > 0 ? String(clamped) : "");
  };

  const handleInput = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");
    setRaw(cleaned);
    const parsed = Number(cleaned) || 0;
    onAmountChange(Math.min(parsed, max));
  };

  const amountMuted = amount <= 0 && raw === "";
  const amountTone = amountMuted ? "text-white/25" : "text-white";

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex justify-center">
        <div className="inline-flex items-center">
          <span className={cn("select-none text-5xl font-semibold leading-none tabular-nums", amountTone)} aria-hidden>
            $
          </span>
          <input
            inputMode="decimal"
            value={raw}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="0"
            size={Math.max(1, raw.length || 1)}
            className={cn(
              "min-w-[1ch] bg-transparent text-5xl font-semibold leading-none tabular-nums outline-none placeholder:text-white/25",
              amountTone,
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q}
            type="button"
            onMouseEnter={() => setHoveredChip(q)}
            onMouseLeave={() => setHoveredChip(null)}
            onClick={() => syncAmount(amount + q)}
            className={cn(
              "radius-chip border px-2.5 py-1 text-[11px] font-medium tabular-nums transition",
              hoveredChip === q
                ? "border-primary bg-primary/10 text-primary"
                : "border-white/10 text-white/60 hover:border-primary/40 hover:text-white",
            )}
          >
            +{q.toLocaleString()}
          </button>
        ))}
        <button
          type="button"
          onMouseEnter={() => setHoveredChip("max")}
          onMouseLeave={() => setHoveredChip(null)}
          onClick={() => syncAmount(max)}
          className={cn(
            "radius-chip border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition",
            hoveredChip === "max"
              ? "border-primary bg-primary/10 text-primary"
              : "border-white/10 text-white/60 hover:border-primary/40 hover:text-white",
          )}
        >
          Max
        </button>
      </div>

      {amount > max && max > 0 ? (
        <p className="text-[10px] text-rose-300">Exceeds limit of {formatMoney(max)}</p>
      ) : null}
    </div>
  );
}
