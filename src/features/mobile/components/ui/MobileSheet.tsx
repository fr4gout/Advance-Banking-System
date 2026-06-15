import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
}

const DISMISS_THRESHOLD = 0.35;

export function MobileSheet({ open, onClose, children, title, footer }: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const springRef = useRef<number | null>(null);
  const startYRef = useRef(0);
  const dragYRef = useRef(0);

  useEffect(() => {
    if (!open) {
      setDragY(0);
      setDragging(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const springBack = useCallback(() => {
    if (springRef.current !== null) cancelAnimationFrame(springRef.current);
    const from = dragYRef.current;
    const start = performance.now();
    const duration = 200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from * (1 - eased);
      dragYRef.current = next;
      setDragY(next);
      if (t < 1) {
        springRef.current = requestAnimationFrame(tick);
      } else {
        dragYRef.current = 0;
        setDragY(0);
        setDragging(false);
        springRef.current = null;
      }
    };
    springRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (springRef.current !== null) {
      cancelAnimationFrame(springRef.current);
      springRef.current = null;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = Math.max(0, e.clientY - startYRef.current);
    dragYRef.current = delta;
    setDragY(delta);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    const sheet = sheetRef.current;
    const height = sheet?.clientHeight ?? 300;
    if (dragYRef.current > height * DISMISS_THRESHOLD) {
      onClose();
      dragYRef.current = 0;
      setDragY(0);
      setDragging(false);
      return;
    }
    springBack();
  };

  useEffect(() => {
    return () => {
      if (springRef.current !== null) cancelAnimationFrame(springRef.current);
    };
  }, []);

  if (!open) return null;

  const sheetHeight = sheetRef.current?.clientHeight ?? 400;
  const backdropOpacity = Math.max(0.15, 0.55 - (dragY / sheetHeight) * 0.4);

  return (
    <div className="absolute inset-x-0 top-0 bottom-[var(--mobile-tab-clearance)] z-30 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0"
        style={{ background: `rgba(0, 0, 0, ${backdropOpacity})` }}
        onClick={onClose}
        aria-label="Close sheet"
      />
      <div
        ref={sheetRef}
        className={cn(
          "panel-modal relative flex max-h-[80%] flex-col rounded-t-[var(--mobile-radius-xl)] border-b-0",
          !dragging && dragY === 0 && "mobile-sheet-in",
        )}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : "transform var(--mobile-duration-base) var(--mobile-ease-out)",
        }}
      >
        <div
          className="flex shrink-0 cursor-grab flex-col items-center px-4 pb-2 pt-3 active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="h-1 w-10 rounded-full bg-[var(--bd)]" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 panel-scroll mobile-scrollbar-hide">
          {title ? (
            <h3 className="mb-3 text-base font-semibold text-[var(--tx)]">{title}</h3>
          ) : null}
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-[var(--bd)] px-4 py-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
