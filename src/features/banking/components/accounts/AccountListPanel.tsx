import { Building2, Handshake, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "../GlassCard";
import { SectionHeader } from "../SectionHeader";
import { PanelScroll } from "../PanelScroll";
import { formatMoney, maskIban } from "../../hooks/useCurrency";
import { useBanking } from "../../context/BankingContext";
import type { Account, AccountKind } from "../../types/banking";
import { formatSharedRoleLabel } from "../../utils/sharedAccount";

interface AccountListPanelProps {
  accounts: Account[];
  tab: AccountKind;
  selectedId: string;
  onTabChange: (tab: AccountKind) => void;
  onSelect: (id: string) => void;
  className?: string;
}

export function AccountListPanel({
  accounts,
  tab,
  selectedId,
  onTabChange,
  onSelect,
  className,
}: AccountListPanelProps) {
  const { character } = useBanking();
  const list = accounts.filter((a) => a.kind === tab);
  const tabLabel =
    tab === "personal" ? "personal" : tab === "society" ? "society" : "shared";

  return (
    <GlassCard className={cn("flex h-full min-h-0 flex-col p-4", className)}>
      <div className="shrink-0">
        <SectionHeader
          title="Accounts"
          subtitle={`${list.length} ${tabLabel} account${list.length === 1 ? "" : "s"}`}
          action={
            <div className="flex radius-chip border border-white/5 bg-black/30 p-0.5">
              <TabBtn active={tab === "personal"} onClick={() => onTabChange("personal")}>
                <User className="h-3 w-3" /> Personal
              </TabBtn>
              <TabBtn active={tab === "society"} onClick={() => onTabChange("society")}>
                <Building2 className="h-3 w-3" /> Society
              </TabBtn>
              <TabBtn active={tab === "shared"} onClick={() => onTabChange("shared")}>
                <Handshake className="h-3 w-3" /> Shared
              </TabBtn>
            </div>
          }
        />
      </div>

      <PanelScroll className="mt-2 flex flex-col gap-1.5">
        {list.length === 0 ? (
          <div className="py-8 text-center text-sm text-white/40">No {tabLabel} accounts.</div>
        ) : (
          list.map((account) => (
            <AccountListRow
              key={account.id}
              account={account}
              active={account.id === selectedId}
              characterCitizenId={character.citizenId}
              onSelect={() => onSelect(account.id)}
            />
          ))
        )}
      </PanelScroll>
    </GlassCard>
  );
}

function TabBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 radius-chip px-2.5 py-1 text-[10px] font-medium transition",
        active ? "bg-primary/15 text-white" : "text-white/50 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function AccountListRow({
  account,
  active,
  characterCitizenId,
  onSelect,
}: {
  account: Account;
  active: boolean;
  characterCitizenId: string;
  onSelect: () => void;
}) {
  const Icon =
    account.kind === "society" ? Building2 : account.kind === "shared" ? Handshake : User;
  const sharedMembership =
    account.kind === "shared"
      ? account.sharedMembers?.find(
          (m) => m.citizenId.toUpperCase() === characterCitizenId.toUpperCase(),
        )
      : undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-center gap-3 radius-control border px-3 py-2.5 text-left transition",
        active
          ? "border-primary/50 bg-[var(--primary-15)]"
          : "panel-card hover:border-primary/30",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_8px_var(--primary)]"
        />
      ) : null}

      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center radius-chip",
          active ? "bg-primary/15 text-primary" : "bg-white/5 text-white/50",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold leading-snug text-white">{account.name}</div>
          {account.kind === "society" && account.role ? (
            <span className="shrink-0 radius-chip border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
              {account.role}
            </span>
          ) : null}
          {sharedMembership ? (
            <span className="shrink-0 radius-chip border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
              {formatSharedRoleLabel(sharedMembership.role)}
            </span>
          ) : null}
        </div>
        <div className="truncate font-mono text-[10px] leading-snug tracking-wider text-white/40">
          {maskIban(account.iban)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-xs font-semibold tabular-nums text-white">{formatMoney(account.balance)}</div>
      </div>
    </button>
  );
}
