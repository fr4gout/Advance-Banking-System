import { useState } from "react";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../SectionHeader";
import { PanelScroll } from "../PanelScroll";
import { SharedMemberRow } from "./SharedMemberRow";
import { SharedRoleSelect } from "./SharedRoleSelect";
import { useBanking } from "../../context/BankingContext";
import type { Account, SharedMemberRole } from "../../types/banking";
import { isSharedAccountOwner, membersAccessSubtitle } from "../../utils/sharedAccount";

interface SharedMembersPanelProps {
  account: Account;
  className?: string;
}

export function SharedMembersPanel({ account, className }: SharedMembersPanelProps) {
  const { character, addSharedMember, updateSharedMemberRole, removeSharedMember } = useBanking();
  const [citizenId, setCitizenId] = useState("");
  const [role, setRole] = useState<SharedMemberRole>("contributor");

  const canManage = isSharedAccountOwner(account, character);
  const members = account.sharedMembers ?? [];
  const citizenIdTrimmed = citizenId.trim();
  const alreadyMember = members.some(
    (m) => m.citizenId.toUpperCase() === citizenIdTrimmed.toUpperCase(),
  );
  const canAdd = canManage && citizenIdTrimmed.length > 0 && !alreadyMember;

  const handleAdd = () => {
    if (!canAdd) return;
    addSharedMember(account.id, { citizenId: citizenIdTrimmed, role });
    setCitizenId("");
    setRole("contributor");
  };

  return (
    <PanelScroll className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <section className="radius-card shrink-0 border border-[var(--bd)] bg-[var(--bg-surface)] p-4">
        <SectionHeader
          title="Add Member"
          subtitle="Grant access to this shared account"
          compact
        />

        <div className="flex items-stretch gap-2">
          <input
            type="text"
            value={citizenId}
            onChange={(e) => setCitizenId(e.target.value)}
            placeholder="Citizen ID"
            disabled={!canManage}
            className={cn(
              "motion-interactive h-10 min-w-0 flex-1 radius-control border border-[var(--bd)] bg-[var(--bg-panel)] px-3 text-sm text-[var(--tx)] outline-none",
              "placeholder:text-[var(--tx-2)] hover:border-[var(--bd-strong)] focus:border-primary/40",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
          <SharedRoleSelect
            value={role}
            onChange={setRole}
            disabled={!canManage}
            className="w-[200px] shrink-0"
          />
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className={cn(
              "motion-interactive inline-flex h-10 shrink-0 items-center gap-1.5 radius-control bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground",
              "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {!canManage ? (
          <p className="mt-2 text-xs text-[var(--tx-2)]">Only account owners can add members.</p>
        ) : alreadyMember && citizenIdTrimmed ? (
          <p className="mt-2 text-xs text-rose-400">This citizen is already a member.</p>
        ) : null}
      </section>

      <section className="radius-card flex min-h-0 flex-1 flex-col border border-[var(--bd)] bg-[var(--bg-surface)] p-4">
        <SectionHeader
          title="Members"
          subtitle={membersAccessSubtitle(members.length)}
          compact
        />

        {members.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8 text-sm text-[var(--tx-2)]">
            No members on this account yet.
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {members.map((member) => (
              <SharedMemberRow
                key={member.id}
                member={member}
                account={account}
                canManage={canManage}
                isSelf={member.citizenId.toUpperCase() === character.citizenId.toUpperCase()}
                onRoleChange={(memberId, nextRole) =>
                  updateSharedMemberRole(account.id, memberId, nextRole)
                }
                onRemove={(memberId) => removeSharedMember(account.id, memberId)}
              />
            ))}
          </div>
        )}
      </section>
    </PanelScroll>
  );
}
