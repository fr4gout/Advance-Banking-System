import { useCallback, useState } from "react";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onDot?: () => void;
  disabled?: boolean;
  showDot?: boolean;
  compact?: boolean;
}

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface Ripple {
  id: number;
  x: number;
  y: number;
}

function Key({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 360);
    },
    [disabled],
  );

  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn(
        "mobile-press relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[var(--bg-row)] text-lg font-medium text-[var(--tx)] transition-colors active:bg-[var(--primary-08)] disabled:opacity-40",
      )}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="key-ripple-circle"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
      <span className="relative z-[1]">{children}</span>
    </button>
  );
}

export function NumericKeypad({
  onDigit,
  onBackspace,
  onDot,
  disabled = false,
  showDot = true,
  compact = false,
}: NumericKeypadProps) {
  const handle = (fn: () => void) => {
    if (!disabled) fn();
  };

  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-[280px] grid-cols-3 justify-items-center",
        compact ? "gap-1.5" : "gap-2",
      )}
    >
      {digits.map((digit) => (
        <Key
          key={digit}
          onClick={() => handle(() => onDigit(digit))}
          disabled={disabled}
        >
          {digit}
        </Key>
      ))}
      {showDot ? (
        <Key
          onClick={() => handle(() => onDot?.())}
          disabled={disabled || !onDot}
        >
          .
        </Key>
      ) : (
        <div className="h-14 w-14" />
      )}
      <Key onClick={() => handle(() => onDigit("0"))} disabled={disabled}>
        0
      </Key>
      <Key onClick={() => handle(onBackspace)} disabled={disabled}>
        <Delete className="h-5 w-5" />
      </Key>
    </div>
  );
}
