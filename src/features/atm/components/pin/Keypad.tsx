import { Delete } from "lucide-react";
import { KeypadButton } from "./KeypadButton";

interface KeypadProps {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Keypad({
  onDigit,
  onClear,
  onBackspace,
  disabled = false,
}: KeypadProps) {
  const handle = (fn: () => void) => {
    if (!disabled) fn();
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {digits.map((digit) => (
        <KeypadButton key={digit} onClick={() => handle(() => onDigit(digit))}>
          {digit}
        </KeypadButton>
      ))}
      <KeypadButton variant="action" onClick={() => handle(onClear)}>
        C
      </KeypadButton>
      <KeypadButton onClick={() => handle(() => onDigit("0"))}>0</KeypadButton>
      <KeypadButton variant="action" onClick={() => handle(onBackspace)}>
        <Delete className="h-5 w-5" />
      </KeypadButton>
    </div>
  );
}
