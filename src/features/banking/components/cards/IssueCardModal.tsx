import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { VirtualCardDesign } from "../../types/banking";
import { CARD_DESIGNS } from "./cardDesign";

interface IssueCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssue: (args: { pin: string; design: VirtualCardDesign }) => void;
}

export function IssueCardModal({ open, onOpenChange, onIssue }: IssueCardModalProps) {
  const [design, setDesign] = useState<VirtualCardDesign>("midnight");
  const [pin, setPin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setPin("");
      setDesign("midnight");
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  const cleaned = useMemo(() => pin.replace(/\D/g, "").slice(0, 4), [pin]);
  const isValid = cleaned.length === 4;

  const submit = () => {
    if (!isValid) return;
    onIssue({ pin: cleaned, design });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="panel-modal border-[var(--bd)] bg-[var(--bg-panel)] text-[var(--tx)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Issue new card</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[var(--tx-2)]">Design</div>
            <div className="flex flex-wrap gap-2">
              {CARD_DESIGNS.map((d) => {
                const active = d.id === design;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDesign(d.id)}
                    className={cn(
                      "relative h-10 w-14 radius-chip border transition",
                      active ? "border-primary/70 ring-1 ring-primary/30" : "border-[var(--bd)] hover:border-primary/30",
                    )}
                    title={d.label}
                    aria-label={d.label}
                  >
                    <span className={cn("absolute inset-0 radius-chip", d.swatchClassName)} aria-hidden />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-[var(--tx-3)]">{CARD_DESIGNS.find((d) => d.id === design)?.label}</div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[var(--tx-2)]">PIN (4 digits)</div>
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="flex h-12 w-full items-center justify-center radius-control border border-[var(--bd-primary)] bg-[var(--bg-surface)] px-4 text-[var(--tx)] outline-none transition focus-within:border-[var(--bd-primary)]"
            >
              <input
                ref={inputRef}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="absolute h-px w-px opacity-0"
                aria-label="Card PIN"
              />
              <div className="flex items-center gap-3">
                {Array.from({ length: 4 }).map((_, i) => {
                  const filled = i < cleaned.length;
                  return (
                    <span
                      key={i}
                      className={cn(
                        "h-2 w-2 rounded-full transition",
                        filled ? "bg-[var(--tx)]" : "bg-[var(--tx-3)]",
                      )}
                      aria-hidden
                    />
                  );
                })}
              </div>
            </button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="radius-control border border-[var(--bd)] px-4 py-2 text-sm text-[var(--tx-2)] transition hover:bg-[var(--bg-row)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={submit}
            className="radius-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Issue
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

