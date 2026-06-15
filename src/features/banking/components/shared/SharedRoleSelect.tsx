import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SharedMemberRole } from "../../types/banking";
import { getSharedRoleOption, SHARED_ROLE_OPTIONS } from "../../utils/sharedAccount";

interface SharedRoleSelectProps {
  value: SharedMemberRole;
  onChange: (role: SharedMemberRole) => void;
  disabled?: boolean;
  className?: string;
}

export function SharedRoleSelect({ value, onChange, disabled, className }: SharedRoleSelectProps) {
  const selected = getSharedRoleOption(value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SharedMemberRole)} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "motion-interactive h-10 w-full min-w-[180px] border-[var(--bd)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--tx)] shadow-none",
          "hover:border-[var(--bd-strong)] focus:ring-0 focus:ring-offset-0",
          "[&>span]:line-clamp-none [&>span]:whitespace-nowrap",
          className,
        )}
      >
        <SelectValue>
          <span className="text-sm font-medium">{selected.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={4}
        className={cn(
          "radius-card z-[60] min-w-[280px] border border-[var(--bd)] bg-[var(--bg-panel)] p-1 text-[var(--tx)] shadow-[var(--shadow-glow)]",
        )}
      >
        {SHARED_ROLE_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            textValue={option.label}
            className={cn(
              "radius-chip cursor-pointer py-2.5 pl-3 pr-8 outline-none",
              "[&>span:first-child]:hidden",
              "focus:bg-primary/15 focus:text-[var(--tx)]",
              "data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary",
            )}
          >
            <div className="flex min-w-0 flex-col gap-0.5 pr-2">
              <span className="text-sm font-semibold leading-snug">{option.label}</span>
              <span className="text-xs leading-snug text-[var(--tx-2)]">{option.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
