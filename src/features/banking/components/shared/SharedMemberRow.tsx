import { useState } from "react";
import { Shield, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Account, SharedAccountMember, SharedMemberRole } from "../../types/banking";
import {
  countSharedOwners,
  formatMemberAddedDate,
  formatSharedRoleLabel,
  memberInitials,
  SHARED_ROLE_OPTIONS,
} from "../../utils/sharedAccount";

interface SharedMemberRowProps {
  member: SharedAccountMember;
  account: Account;
  canManage: boolean;
  isSelf: boolean;
  onRoleChange: (memberId: string, role: SharedMemberRole) => void;
  onRemove: (memberId: string) => void;
}

export function SharedMemberRow({
  member,
  account,
  canManage,
  isSelf,
  onRoleChange,
  onRemove,
}: SharedMemberRowProps) {
  const [open, setOpen] = useState(false);
  const owners = countSharedOwners(account);
  const isLastOwner = member.role === "owner" && owners <= 1;
  const showActions = canManage && !(isSelf && isLastOwner);

  const handleRoleChange = (role: SharedMemberRole) => {
    if (role === member.role) return;
    if (member.role === "owner" && role !== "owner" && isLastOwner) return;
    onRoleChange(member.id, role);
    setOpen(false);
  };

  const handleRemove = () => {
    if (isLastOwner) return;
    onRemove(member.id);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3 radius-control border border-[var(--bd)] bg-[var(--bg-surface)] px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-chip border border-[var(--bd)] bg-[var(--bg-panel)] text-sm font-semibold text-[var(--tx)]">
        {memberInitials(member.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[var(--tx)]">{member.name}</div>
        <div className="mt-0.5 truncate text-xs text-[var(--tx-2)]">
          {member.citizenId} · Added {formatMemberAddedDate(member.addedAt)}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="radius-chip border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {formatSharedRoleLabel(member.role)}
        </span>

        {showActions ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="motion-interactive flex h-9 w-9 items-center justify-center radius-control border border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15"
                aria-label={`Manage ${member.name}`}
              >
                <Shield className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-56 border-[var(--bd)] bg-[var(--bg-panel)] p-2 text-[var(--tx)]"
            >
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--tx-2)]">
                Change role
              </div>
              <div className="flex flex-col gap-0.5">
                {SHARED_ROLE_OPTIONS.map((option) => {
                  const active = option.value === member.role;
                  const wouldDemoteLastOwner =
                    member.role === "owner" && option.value !== "owner" && isLastOwner;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={wouldDemoteLastOwner}
                      onClick={() => handleRoleChange(option.value)}
                      className={cn(
                        "motion-interactive radius-chip px-3 py-2 text-left transition",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-[var(--tx)] hover:bg-[var(--bg-surface)]",
                        wouldDemoteLastOwner && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs text-[var(--tx-2)]">{option.description}</div>
                    </button>
                  );
                })}
              </div>
              {!isSelf ? (
                <button
                  type="button"
                  disabled={isLastOwner}
                  onClick={handleRemove}
                  className={cn(
                    "motion-interactive mt-2 flex w-full items-center justify-center gap-1.5 radius-chip border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10",
                    isLastOwner && "cursor-not-allowed opacity-40",
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove member
                </button>
              ) : null}
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </div>
  );
}
