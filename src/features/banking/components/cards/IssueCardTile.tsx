import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function IssueCardTile({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex aspect-[1.586/1] w-[200px] max-w-[200px] flex-[0_0_200px] items-center justify-center radius-debit-card border border-white/10 bg-white/[0.02] p-3 text-center transition",
        "hover:border-primary/30 hover:bg-white/[0.03]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-8 w-8 items-center justify-center radius-chip border border-primary/30 bg-primary/10 text-primary transition group-hover:border-primary/50">
          <Plus className="h-4 w-4" />
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Issue new card</div>
      </div>
    </button>
  );
}

