import type { Account, Character, SharedMemberRole } from "../types/banking";

export const SHARED_ROLE_OPTIONS: ReadonlyArray<{
  value: SharedMemberRole;
  label: string;
  description: string;
}> = [
  { value: "owner", label: "Owner", description: "Full account access" },
  { value: "contributor", label: "Contributor", description: "Can manage account funds" },
  { value: "viewer", label: "Viewer", description: "Read-only account access" },
] as const;

export function getSharedRoleOption(role: SharedMemberRole) {
  const option = SHARED_ROLE_OPTIONS.find((o) => o.value === role);
  if (!option) {
    const _exhaustive: never = role;
    return _exhaustive;
  }
  return option;
}

export function formatSharedRoleLabel(role: SharedMemberRole): string {
  return getSharedRoleOption(role).label.toUpperCase();
}

export function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getSharedMemberForCharacter(account: Account, character: Character) {
  if (account.kind !== "shared") return undefined;
  return account.sharedMembers?.find(
    (m) => m.citizenId.toUpperCase() === character.citizenId.toUpperCase(),
  );
}

export function isSharedAccountOwner(account: Account, character: Character): boolean {
  const member = getSharedMemberForCharacter(account, character);
  return member?.role === "owner";
}

export function countSharedOwners(account: Account): number {
  return (account.sharedMembers ?? []).filter((m) => m.role === "owner").length;
}

export function formatMemberAddedDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export function membersAccessSubtitle(count: number): string {
  if (count === 1) return "1 person has access";
  return `${count} people have access`;
}
