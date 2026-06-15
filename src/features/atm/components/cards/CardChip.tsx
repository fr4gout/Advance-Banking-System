export function CardChip() {
  return (
    <div className="relative h-8 w-10 rounded-md bg-gradient-to-br from-amber-300/80 to-amber-600/60">
      <div className="absolute inset-1 grid grid-cols-2 gap-px">
        <div className="rounded-sm bg-amber-900/20" />
        <div className="rounded-sm bg-amber-900/20" />
        <div className="rounded-sm bg-amber-900/20" />
        <div className="rounded-sm bg-amber-900/20" />
      </div>
    </div>
  );
}
