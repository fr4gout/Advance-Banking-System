import { useEffect } from "react";
import {
  ArrowLeftRight,
  Banknote,
  CreditCard,
  History,
  Landmark,
  LayoutDashboard,
  Receipt,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useBanking } from "../context/BankingContext";
import type { Contact, ViewKey } from "../types/banking";

const VIEW_ITEMS: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "transfers", label: "Transfers", icon: ArrowLeftRight },
  { key: "loans", label: "Loans", icon: Banknote },
  { key: "accounts", label: "Accounts", icon: Landmark },
  { key: "cards", label: "Cards", icon: CreditCard },
];

interface BankingCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BankingCommandPalette({ open, onOpenChange }: BankingCommandPaletteProps) {
  const {
    contacts,
    accounts,
    switchAccount,
    setView,
    setTransfersPanel,
    openTransfersSend,
    openTransfersHistory,
    close,
  } = useBanking();

  const run = (fn: () => void) => {
    fn();
    onOpenChange(false);
  };

  const goToView = (key: ViewKey) => {
    if (key === "transfers") setTransfersPanel("send");
    setView(key);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search views, actions, contacts…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {VIEW_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.key} onSelect={() => run(() => goToView(item.key))}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => run(openTransfersSend)}>
            <ArrowLeftRight className="h-4 w-4" />
            <span>New transfer</span>
            <CommandShortcut>T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(openTransfersHistory)}>
            <History className="h-4 w-4" />
            <span>Transaction history</span>
            <CommandShortcut>H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(close)}>
            <span>Close banking</span>
            <CommandShortcut>Esc</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {contacts.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Contacts">
              {contacts.map((contact: Contact) => (
                <CommandItem
                  key={contact.id}
                  onSelect={() =>
                    run(() => {
                      openTransfersSend();
                      switchAccount(accounts[0]?.id ?? "");
                    })
                  }
                >
                  <User className="h-4 w-4" />
                  <span>{contact.name}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">{contact.iban}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
