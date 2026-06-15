import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface MobileTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label?: string;
  error?: string;
  className?: string;
}

export function MobileTextArea({ label, error, className, ...props }: MobileTextAreaProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-[11px] font-medium text-[var(--tx-2)]">{label}</label>
      ) : null}
      <textarea
        className={cn(
          "w-full resize-none radius-control border bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--tx)] outline-none transition-colors",
          error
            ? "border-[var(--c-red)] focus:border-[var(--c-red)]"
            : "border-[var(--bd)] focus:border-[var(--bd-primary)]",
        )}
        {...props}
      />
      {error ? <p className="text-[11px] text-[var(--c-red)]">{error}</p> : null}
    </div>
  );
}
