import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";

interface CardStatusProps {
  unlocked?: boolean;
}

export function CardStatus({ unlocked = false }: CardStatusProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 radius-control px-3 py-1.5 text-sm",
        unlocked
          ? "bg-[var(--c-green)]/10 text-[var(--c-green)]"
          : "bg-[var(--primary-15)] text-primary",
      )}
    >
      {unlocked ? (
        <Unlock className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      <span>{unlocked ? "Unlocked" : "Locked"}</span>
    </div>
  );
}
