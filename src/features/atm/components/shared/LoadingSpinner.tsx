import { cn } from "@/lib/utils";

export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
