import { useMemo, useState } from "react";
import { Plus, Star, Trash2, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { createContactId, useBanking } from "@/features/banking/context/BankingContext";
import { MobileEmptyState } from "../components/ui/MobileEmptyState";
import { MobileListRow } from "../components/ui/MobileListRow";
import { MobilePageHeader } from "../components/ui/MobilePageHeader";
import { MobilePressable } from "../components/ui/MobilePressable";
import { MobileScreen } from "../components/ui/MobileScreen";
import { MobileSheet } from "../components/ui/MobileSheet";
import { MobileTextField } from "../components/ui/MobileTextField";
import { useMobile } from "../hooks/useMobile";

const IBAN_RE = /^LS\d{2}(?:\s?\d{4}){3}$/i;

const HUE_PRESETS = [200, 160, 280, 40, 320];

export function MobileContactsView() {
  const { contacts, saveContact, deleteContact, toggleContactFavorite } = useBanking();
  const { prefillTransferContact, addContactOpen, setAddContactOpen } = useMobile();
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [iban, setIban] = useState("");
  const [hue, setHue] = useState(200);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.iban.toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const c of filtered) {
      const letter = c.name[0]?.toUpperCase() ?? "#";
      const arr = map.get(letter) ?? [];
      arr.push(c);
      map.set(letter, arr);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const nameValid = name.trim().length >= 2;
  const ibanValid = IBAN_RE.test(iban.trim());
  const formValid = nameValid && ibanValid;

  const initials = name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const submitContact = () => {
    if (!formValid) return;
    saveContact({
      id: createContactId(),
      name: name.trim(),
      iban: iban.trim(),
      avatarHue: hue,
      favorite: false,
    });
    setName("");
    setIban("");
    setHue(200);
    setAddContactOpen(false);
  };

  let staggerIndex = 0;

  return (
    <>
      <MobileScreen
        stickyHeader={
          <MobilePageHeader
            title="Contacts"
            trailing={
              <button
                type="button"
                onClick={() => setAddContactOpen(true)}
                className="mobile-press flex h-9 w-9 items-center justify-center radius-chip bg-primary text-primary-foreground"
                aria-label="Add contact"
              >
                <Plus className="h-4 w-4" />
              </button>
            }
          />
        }
        scrollClassName="gap-3 pt-2"
      >
        <MobileTextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts…"
          onClear={() => setQuery("")}
        />

        {filtered.length === 0 ? (
          <MobileEmptyState icon={Users} title="No contacts found" description="Try a different search or add someone new." />
        ) : (
          grouped.map(([letter, items]) => (
            <div key={letter}>
              <p className="sticky top-0 z-[1] mb-1 bg-[var(--bg-panel)] py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--tx-3)]">
                {letter}
              </p>
              <div className="flex flex-col gap-2">
                {items.map((contact) => {
                  staggerIndex += 1;
                  const stagger = (Math.min((staggerIndex - 1) % 5, 4) + 1) as
                    | 1
                    | 2
                    | 3
                    | 4
                    | 5;
                  return (
                    <MobileListRow
                      key={contact.id}
                      icon={User}
                      title={contact.name}
                      subtitle={contact.iban}
                      stagger={stagger}
                      onClick={() => prefillTransferContact(contact)}
                      trailing={
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleContactFavorite(contact.id);
                            }}
                            className={cn(
                              "mobile-press flex h-11 w-11 items-center justify-center rounded-full",
                              contact.favorite ? "text-primary" : "text-[var(--tx-3)]",
                            )}
                            aria-label="Toggle favorite"
                          >
                            <Star className={cn("h-4 w-4", contact.favorite && "fill-current")} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContact(contact.id);
                            }}
                            className="mobile-press flex h-11 w-11 items-center justify-center rounded-full text-[var(--c-red)]"
                            aria-label="Delete contact"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </MobileScreen>

      <MobileSheet open={addContactOpen} onClose={() => setAddContactOpen(false)} title="Add Contact">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: `hsl(${hue} 55% 45%)` }}
            >
              {initials || "?"}
            </div>
            <p className="text-[11px] text-[var(--tx-2)]">Avatar preview updates as you type.</p>
          </div>

          <MobileTextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
          <MobileTextField
            label="IBAN"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder="LS00 0000 0000 0000"
            className="font-mono"
          />

          <div>
            <p className="mb-2 text-[11px] font-medium text-[var(--tx-2)]">Avatar color</p>
            <div className="flex flex-wrap gap-2">
              {HUE_PRESETS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHue(h)}
                  className={cn(
                    "mobile-press h-8 w-8 rounded-full border-2",
                    hue === h ? "border-primary" : "border-transparent",
                  )}
                  style={{ background: `hsl(${h} 55% 45%)` }}
                  aria-label={`Hue ${h}`}
                />
              ))}
            </div>
          </div>

          <MobilePressable
            variant="primary"
            disabled={!formValid}
            onClick={submitContact}
            className="py-2.5 text-sm font-semibold disabled:opacity-40"
          >
            Save Contact
          </MobilePressable>
          <MobilePressable variant="ghost" onClick={() => setAddContactOpen(false)} className="py-2 text-sm">
            Cancel
          </MobilePressable>
        </div>
      </MobileSheet>
    </>
  );
}
