import { useCallback, useState } from "react";

const PIN_LENGTH = 4;

interface UsePinOptions {
  onComplete?: (pin: string) => void;
  externalPin?: string;
  onPinChange?: (pin: string) => void;
}

export function usePin({ onComplete, externalPin, onPinChange }: UsePinOptions = {}) {
  const [internalPin, setInternalPin] = useState("");
  const pin = externalPin ?? internalPin;

  const updatePin = useCallback(
    (next: string) => {
      if (onPinChange) {
        onPinChange(next);
      } else {
        setInternalPin(next);
      }
    },
    [onPinChange],
  );

  const appendDigit = useCallback(
    (digit: string) => {
      if (pin.length >= PIN_LENGTH) return;
      const next = pin + digit;
      updatePin(next);
      if (next.length === PIN_LENGTH) {
        onComplete?.(next);
      }
    },
    [onComplete, pin, updatePin],
  );

  const backspace = useCallback(() => {
    updatePin(pin.slice(0, -1));
  }, [pin, updatePin]);

  const clear = useCallback(() => {
    updatePin("");
  }, [updatePin]);

  return {
    pin,
    appendDigit,
    backspace,
    clear,
    isComplete: pin.length === PIN_LENGTH,
    maxLength: PIN_LENGTH,
  };
}
