import { Check, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SwipeSliderProps {
  label?: string;
  onConfirm: () => void;
  disabled?: boolean;
}

function fillColorForProgress(progress: number, confirmed: boolean): string {
  if (confirmed) return "var(--c-green)";
  if (progress >= 0.9)
    return "color-mix(in oklch, var(--c-green) 85%, var(--primary))";
  if (progress >= 0.5)
    return "color-mix(in oklch, var(--c-green) 35%, var(--primary-15))";
  return "var(--primary-15)";
}

export function SwipeSlider({
  label = "Swipe to Send",
  onConfirm,
  disabled = false,
}: SwipeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [flash, setFlash] = useState(false);
  const springRef = useRef<number | null>(null);

  const thumbSize = 40;
  const padding = 4;

  const getMaxDrag = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return track.clientWidth - thumbSize - padding * 2;
  }, []);

  const springBack = useCallback((from: number) => {
    if (springRef.current !== null) {
      cancelAnimationFrame(springRef.current);
    }
    const start = performance.now();
    const duration = 200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from * (1 - eased);
      setDragX(next);
      if (t < 1) {
        springRef.current = requestAnimationFrame(tick);
      } else {
        setDragX(0);
        setDragging(false);
        springRef.current = null;
      }
    };

    springRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || confirmed) return;
    if (springRef.current !== null) {
      cancelAnimationFrame(springRef.current);
      springRef.current = null;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || disabled || confirmed) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left - thumbSize / 2 - padding;
    const max = getMaxDrag();
    setDragX(Math.max(0, Math.min(x, max)));
  };

  const handlePointerUp = () => {
    if (!dragging || confirmed) return;
    const max = getMaxDrag();
    if (max > 0 && dragX >= max * 0.9) {
      setConfirmed(true);
      setFlash(true);
      setDragX(max);
      window.setTimeout(() => {
        onConfirm();
        setConfirmed(false);
        setFlash(false);
        setDragX(0);
        setDragging(false);
      }, 180);
      return;
    }
    springBack(dragX);
  };

  const max = getMaxDrag();
  const progress = max > 0 ? dragX / max : 0;
  const fillWidth = dragX + thumbSize + padding;
  const nearComplete = progress >= 0.9 || confirmed;

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label={label}
      className={cn(
        "relative flex h-12 items-center justify-center overflow-hidden rounded-full border border-[var(--bd)] bg-[var(--bg-surface)]",
        disabled && "opacity-40",
        (confirmed || nearComplete) && "border-[var(--c-green)]/40",
      )}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-full rounded-full"
        style={{
          width: fillWidth,
          background: fillColorForProgress(progress, confirmed),
          opacity: flash ? 1 : undefined,
          transition: dragging
            ? "background 80ms linear, width 0ms"
            : "width var(--mobile-duration-fast) var(--mobile-ease-out), background var(--mobile-duration-base) var(--mobile-ease-out), opacity var(--mobile-duration-fast)",
        }}
      />
      <span
        className="pointer-events-none text-[10px] font-bold uppercase tracking-wider text-[var(--tx-3)]"
        style={{ opacity: 1 - progress * 0.85 }}
      >
        {label}
      </span>
      <div
        className={cn(
          "absolute left-1 top-1 flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground touch-none",
          nearComplete ? "bg-[var(--c-green)]" : "bg-primary",
          confirmed && "mobile-swipe-thumb-success",
        )}
        style={{
          transform: `translateX(${dragX}px) scale(${confirmed ? 1.1 : 1})`,
          transition: dragging
            ? "background 80ms linear, transform 0ms"
            : "transform var(--mobile-duration-fast) var(--mobile-spring), background var(--mobile-duration-base) var(--mobile-ease-out)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {confirmed ? (
          <Check className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </div>
    </div>
  );
}
