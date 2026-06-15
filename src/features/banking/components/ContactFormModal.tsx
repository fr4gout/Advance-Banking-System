import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { createContactId, useBanking } from "../context/BankingContext";
import type { Contact } from "../types/banking";

const IBAN_RE = /^LS\d{2}(?:\s?\d{4}){3}$/i;

interface ContactFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactFormModal({ open, onOpenChange }: ContactFormModalProps) {
  const { saveContact } = useBanking();
  const [name, setName] = useState("");
  const [iban, setIban] = useState("");
  const [hue, setHue] = useState(200);

  const ibanValid = IBAN_RE.test(iban.trim());
  const nameValid = name.trim().length >= 2;
  const formValid = nameValid && ibanValid;

  const reset = () => {
    setName("");
    setIban("");
    setHue(200);
  };

  const submit = () => {
    if (!formValid) return;
    const contact: Contact = {
      id: createContactId(),
      name: name.trim(),
      iban: iban.trim(),
      avatarHue: hue,
      favorite: false,
    };
    saveContact(contact);
    reset();
    onOpenChange(false);
  };

  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="panel-modal border-[var(--bd)] bg-[var(--bg-panel)] text-[var(--tx)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 40) % 360} 60% 30%))`,
              }}
            >
              {initials || "?"}
            </div>
            <div className="text-xs text-[var(--tx-2)]">Avatar preview updates with hue</div>
          </div>

          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full radius-control border border-[var(--bd)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--tx)] outline-none transition focus:border-[var(--bd-primary)]"
            />
            {name && !nameValid ? <Hint tone="danger">Name must be at least 2 characters</Hint> : null}
          </Field>

          <Field label="IBAN">
            <input
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="LS00 0000 0000 0000"
              className="w-full radius-control border border-[var(--bd)] bg-[var(--bg-surface)] px-4 py-3 font-mono text-sm tracking-wider text-[var(--tx)] outline-none transition focus:border-[var(--bd-primary)]"
            />
            {iban && !ibanValid ? <Hint tone="danger">IBAN format: LS## #### #### ####</Hint> : null}
          </Field>

          <Field label={`Avatar Hue — ${hue}°`}>
            <Slider
              value={[hue]}
              onValueChange={([v]) => setHue(v)}
              min={0}
              max={360}
              step={1}
              className="py-2"
            />
          </Field>
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
            disabled={!formValid}
            onClick={submit}
            className="radius-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Contact
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-[var(--tx-2)]">{label}</div>
      {children}
    </div>
  );
}

function Hint({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "danger" }) {
  return (
    <div className={tone === "danger" ? "mt-1.5 text-xs text-rose-300" : "mt-1.5 text-xs text-[var(--tx-3)]"}>
      {children}
    </div>
  );
}
