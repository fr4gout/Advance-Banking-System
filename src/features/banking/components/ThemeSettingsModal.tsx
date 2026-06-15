import { Palette } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBanking } from "../context/BankingContext";
import { BankLogo } from "./BankLogo";
import { BANK_THEMES } from "../hooks/useBankTheme";

interface ThemeSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeSettingsModal({ open, onOpenChange }: ThemeSettingsModalProps) {
  const { bankTheme, setBankTheme } = useBanking();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="panel-modal border-[var(--bd)] bg-[var(--bg-panel)] text-[var(--tx)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            Bank Theme
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-[var(--tx-2)]">
          Choose a branch style. Your preference is saved locally.
        </p>

        <div className="mt-2 flex flex-col gap-3">
          {BANK_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setBankTheme(theme.id)}
              className={cn(
                "motion-interactive flex items-center gap-4 radius-card border p-4 text-left transition",
                bankTheme === theme.id
                  ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
                  : "border-[var(--bd)] bg-[var(--bg-surface)] hover:border-primary/30 hover:bg-[var(--bg-row)]",
              )}
            >
              {theme.logoSrc ? (
                <BankLogo theme={theme.id} variant="picker" />
              ) : (
                <div
                  className="h-10 w-10 shrink-0 rounded-full shadow-[var(--shadow-glow)]"
                  style={{ background: theme.swatch }}
                />
              )}
              <div>
                <div className="text-sm font-semibold text-[var(--tx)]">{theme.name}</div>
                <div className="text-xs text-[var(--tx-2)]">{theme.description}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
