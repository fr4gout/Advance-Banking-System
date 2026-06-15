import { Building2, Plus, User, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact } from "../../types/banking";
import { isCitizenIdValid } from "../../utils/transferLimits";

export type RecipientMode = "contact" | "citizenId" | null;

interface TransferRecipientChipsProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  recipientMode: RecipientMode;
  citizenId: string;
  onSelectContact: (contact: Contact) => void;
  onSelectCitizenId: () => void;
  onCitizenIdChange: (id: string) => void;
  onAddContact: () => void;
}

export function TransferRecipientChips({
  contacts,
  selectedContact,
  recipientMode,
  citizenId,
  onSelectContact,
  onSelectCitizenId,
  onCitizenIdChange,
  onAddContact,
}: TransferRecipientChipsProps) {
  const favorites = contacts
    .filter((c) => c.favorite)
    .slice(0, 3);
  const displayContacts = favorites.length > 0 ? favorites : contacts.slice(0, 3);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Recipient</div>
        <button
          type="button"
          onClick={onAddContact}
          className="inline-flex items-center gap-1 radius-chip border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {displayContacts.map((c) => {
          const active = recipientMode === "contact" && selectedContact?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectContact(c)}
              className={cn(
                "inline-flex items-center gap-1.5 radius-chip border px-2.5 py-1.5 text-[11px] font-medium transition",
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-white/10 text-white/70 hover:border-primary/30 hover:text-white",
              )}
            >
              <Building2 className="h-3 w-3 shrink-0 opacity-60" />
              <span className="max-w-[120px] truncate">{c.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onSelectCitizenId}
          className={cn(
            "inline-flex items-center gap-1.5 radius-chip border px-2.5 py-1.5 text-[11px] font-medium transition",
            recipientMode === "citizenId"
              ? "border-primary bg-primary/15 text-primary"
              : "border-white/10 text-white/70 hover:border-primary/30 hover:text-white",
          )}
        >
          <User className="h-3 w-3 shrink-0 opacity-60" />
          Citizen ID
        </button>
      </div>

      {recipientMode === "citizenId" ? (
        <div className="flex items-center gap-2 radius-chip border border-white/10 bg-black/30 px-3 py-2">
          <UserRound className="h-3.5 w-3.5 shrink-0 text-white/40" />
          <input
            value={citizenId}
            onChange={(e) => onCitizenIdChange(e.target.value.toUpperCase())}
            placeholder="Enter citizen ID"
            className="min-w-0 flex-1 bg-transparent text-xs font-mono tracking-wider text-white outline-none placeholder:text-white/30"
          />
        </div>
      ) : null}

      {recipientMode === "citizenId" && citizenId && !isCitizenIdValid(citizenId) ? (
        <p className="text-[10px] text-rose-300">Citizen ID: 4–12 letters or numbers</p>
      ) : null}
    </div>
  );
}
