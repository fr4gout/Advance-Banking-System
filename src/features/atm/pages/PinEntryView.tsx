import { useEffect } from "react";
import { BankCard } from "../components/cards/BankCard";
import { Keypad } from "../components/pin/Keypad";
import { PinDots } from "../components/pin/PinDots";
import { UnlockButton } from "../components/pin/UnlockButton";
import { useATM } from "../hooks/useATM";
import { usePin } from "../hooks/usePin";

export function PinEntryView() {
  const {
    selectedCard,
    pin,
    setPin,
    verifyPin,
    pinError,
    isLoading,
    clearPinError,
  } = useATM();

  const { appendDigit, backspace, clear } = usePin({
    externalPin: pin,
    onPinChange: setPin,
  });

  useEffect(() => {
    if (pinError) {
      const timer = setTimeout(clearPinError, 600);
      return () => clearTimeout(timer);
    }
  }, [clearPinError, pinError]);

  if (!selectedCard) return null;

  return (
    <div className="view-transition flex flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-wider text-[var(--tx-2)]">Selected Card</p>
        <BankCard card={selectedCard} selected compact />
      </div>

      <div className="flex w-full flex-col items-center">
        <h2 className="text-base font-semibold text-[var(--tx)]">PIN Authentication</h2>
        <p className="mt-1 text-sm text-[var(--tx-2)]">Enter your 4-digit PIN to continue</p>

        <div className="my-4">
          <PinDots length={4} filled={pin.length} error={pinError} shake={pinError} />
        </div>

        <div className="w-full">
          <Keypad
            onDigit={appendDigit}
            onClear={clear}
            onBackspace={backspace}
            disabled={isLoading}
          />
          <UnlockButton
            onClick={() => void verifyPin()}
            disabled={pin.length !== 4}
            loading={isLoading}
          />
        </div>

        {pinError ? (
          <p className="mt-3 animate-pulse text-sm text-[var(--c-red)]">
            Incorrect PIN. Please try again.
          </p>
        ) : null}
      </div>
    </div>
  );
}
