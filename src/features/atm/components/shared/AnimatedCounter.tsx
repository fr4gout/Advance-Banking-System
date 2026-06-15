import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "../../utils/currency";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 600,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    const diff = value - start;
    if (diff === 0) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        previousValue.current = value;
      }
    };

    requestAnimationFrame(tick);
  }, [duration, value]);

  return <span className={className}>{formatCurrency(displayValue)}</span>;
}
