import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface MobileTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  error?: string;
  onClear?: () => void;
  className?: string;
}

export function MobileTextField({
  label,
  error,
  onClear,
  className,
  value,
  ...props
}: MobileTextFieldProps) {
  const showClear = onClear && value && String(value).length > 0;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-[11px] font-medium text-[var(--tx-2)]">{label}</label>
      ) : null}
      <div className="relative">
        <input
          value={value}
          className={cn(
            "w-full radius-control border bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--tx)] outline-none transition-colors",
            error
              ? "border-[var(--c-red)] focus:border-[var(--c-red)]"
              : "border-[var(--bd)] focus:border-[var(--bd-primary)]",
          )}
          {...props}
        />
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="mobile-press absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--tx-3)]"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      {error ? <p className="text-[11px] text-[var(--c-red)]">{error}</p> : null}
    </div>
  );
}
