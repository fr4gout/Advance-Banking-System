import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { MobileTab } from "../../types/mobile";

const TRANSITION_MS = 280;

interface MobileScreenTransitionProps {
  activeKey: MobileTab;
  direction?: 1 | -1;
  children: ReactNode;
}

interface TransitionLayer {
  key: MobileTab;
  node: ReactNode;
  phase: "enter" | "exit";
}

export function MobileScreenTransition({
  activeKey,
  direction = 1,
  children,
}: MobileScreenTransitionProps) {
  const [layers, setLayers] = useState<TransitionLayer[]>([
    { key: activeKey, node: children, phase: "enter" },
  ]);
  const prevKeyRef = useRef(activeKey);
  const timerRef = useRef<number | null>(null);
  const childrenRef = useRef(children);
  childrenRef.current = children;

  useEffect(() => {
    if (activeKey === prevKeyRef.current) {
      setLayers([{ key: activeKey, node: childrenRef.current, phase: "enter" }]);
      return;
    }

    const outgoingKey = prevKeyRef.current;
    prevKeyRef.current = activeKey;

    setLayers((prev) => {
      const outgoing = prev.find((l) => l.key === outgoingKey && l.phase === "enter");
      const next: TransitionLayer[] = [];
      if (outgoing) {
        next.push({ ...outgoing, phase: "exit" });
      }
      next.push({ key: activeKey, node: childrenRef.current, phase: "enter" });
      return next;
    });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setLayers([{ key: activeKey, node: childrenRef.current, phase: "enter" }]);
      timerRef.current = null;
    }, TRANSITION_MS);
  }, [activeKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const enterClass = direction > 0 ? "mobile-tab-enter-right" : "mobile-tab-enter-left";
  const exitClass = direction > 0 ? "mobile-tab-exit-left" : "mobile-tab-exit-right";
  const isTransitioning = layers.length > 1;

  if (!isTransitioning) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {layers.map((layer) => (
        <div
          key={`${layer.key}-${layer.phase}`}
          className={cn(
            "absolute inset-0 flex min-h-0 flex-col",
            layer.phase === "enter" ? enterClass : exitClass,
            layer.phase === "exit" && "pointer-events-none z-0",
            layer.phase === "enter" && "z-10",
          )}
        >
          {layer.key === activeKey ? children : layer.node}
        </div>
      ))}
    </div>
  );
}
