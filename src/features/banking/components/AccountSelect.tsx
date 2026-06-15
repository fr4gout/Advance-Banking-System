import { Building2, Handshake, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Account } from "../types/banking";

interface AccountSelectProps {
  accounts: Account[];
  activeAccountId: string;
  onSwitch: (id: string) => void;
  className?: string;
}

function accountShortLabel(account: Account | undefined): string {
  if (!account) return "";
  return account.shortLabel ?? account.kind.toUpperCase();
}

function accountIcon(account: Account | undefined) {
  if (!account) return User;
  if (account.kind === "society") return Building2;
  if (account.kind === "shared") return Handshake;
  return User;
}

export function AccountSelect({ accounts, activeAccountId, onSwitch, className }: AccountSelectProps) {
  const activeAccount = accounts.find((a) => a.id === activeAccountId);
  const ActiveIcon = accountIcon(activeAccount);

  return (
    <Select value={activeAccountId} onValueChange={onSwitch}>
      <SelectTrigger
        className={cn(
          "relative radius-control h-11 w-full justify-start gap-2 overflow-hidden border-[var(--bd)] bg-[var(--bg-surface)] px-2.5 py-2 text-[var(--tx)] shadow-none",
          "hover:border-[var(--bd-primary)] focus:ring-0 focus:ring-offset-0",
          "[&>svg]:ml-auto [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0 [&>svg]:text-[var(--tx-2)]",
          className,
        )}
      >
        {/* Radix value for a11y only — not a direct trigger span (avoids shadcn line-clamp duplication) */}
        <div className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0">
          <SelectValue />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center radius-chip border border-primary/40 bg-primary/10 text-primary">
            <ActiveIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold leading-snug text-[var(--tx)]">
              {activeAccount?.name ?? "Select account"}
            </div>
            <div className="text-[9px] font-medium uppercase leading-snug tracking-[0.14em] text-[var(--tx-2)]">
              {accountShortLabel(activeAccount)}
            </div>
          </div>
        </div>
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={4}
        className={cn(
          "radius-card z-[60] border border-[var(--bd)] bg-[var(--bg-panel)] p-1 text-[var(--tx)] shadow-[var(--shadow-glow)]",
          "max-h-[min(240px,var(--radix-select-content-available-height))]",
          "min-w-[var(--radix-select-trigger-width)]",
          "[&_[data-radix-select-viewport]]:h-auto [&_[data-radix-select-viewport]]:min-h-0",
        )}
      >
        {accounts.map((account) => {
          const ItemIcon = accountIcon(account);
          return (
          <SelectItem
            key={account.id}
            value={account.id}
            textValue={account.name}
            title={account.name}
            className={cn(
              "radius-chip cursor-pointer py-2 pl-3 pr-3 outline-none",
              "[&>span:first-child]:hidden",
              "focus:bg-[var(--primary-15)] focus:text-[var(--tx)]",
              "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              "data-[state=checked]:[&_span:last-child]:text-primary-foreground/70",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center radius-chip border border-[var(--bd)] bg-[var(--bg-row)] text-[var(--tx-2)]">
                <ItemIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-xs font-semibold leading-snug">{account.name}</span>
                <span className="text-[9px] uppercase leading-snug tracking-[0.14em] text-[var(--tx-2)]">
                  {accountShortLabel(account)}
                </span>
              </div>
            </div>
          </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
