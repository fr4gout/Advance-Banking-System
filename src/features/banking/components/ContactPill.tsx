import { Star, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Contact } from "../types/banking";
import { maskIban } from "../hooks/useCurrency";

interface ContactPillProps {
  contact: Contact;
  active?: boolean;
  onSelect: (c: Contact) => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function ContactPill({ contact, active, onSelect, onToggleFavorite, onDelete }: ContactPillProps) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 radius-control border px-2 py-2 transition",
        active
          ? "border-primary/50 bg-primary/10"
          : "border-[var(--bd)] hover:border-primary/30 hover:bg-[var(--bg-row)]",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(contact)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, hsl(${contact.avatarHue} 70% 45%), hsl(${(contact.avatarHue + 40) % 360} 60% 30%))`,
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate text-sm font-medium text-[var(--tx)]">
            {contact.name}
            {contact.favorite ? <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> : null}
          </div>
          <div className="truncate font-mono text-[10px] uppercase tracking-wider text-[var(--tx-2)]">
            {maskIban(contact.iban)}
          </div>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        {onToggleFavorite ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="flex h-8 w-8 items-center justify-center radius-chip text-[var(--tx-2)] transition hover:bg-[var(--bg-row)] hover:text-amber-300"
            aria-label={contact.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={cn("h-3.5 w-3.5", contact.favorite && "fill-amber-300 text-amber-300")} />
          </button>
        ) : null}

        {onDelete ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center radius-chip text-[var(--tx-2)] transition hover:bg-rose-500/10 hover:text-rose-300"
                aria-label="Delete contact"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="panel-modal border-[var(--bd)] bg-[var(--bg-panel)] text-[var(--tx)]">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete contact?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--tx-2)]">
                  Remove {contact.name} from your contact list. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--bd)] bg-transparent text-[var(--tx-2)] hover:bg-[var(--bg-row)]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
}
