import { useState } from "react";
import { ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "@/features/banking/context/BankingContext";
import { NumericKeypad } from "../components/NumericKeypad";
import { useMobile } from "../hooks/useMobile";
import { useMobileClock } from "../hooks/useMobileClock";
import { MOBILE_PASSCODE } from "../types/mobile";

function PinDots({ filled, error }: { filled: number; error?: boolean }) {
  return (
    <div className={cn("flex justify-center gap-3", error && "animate-shake")}>
      {Array.from({ length: MOBILE_PASSCODE.length }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "motion-dot h-2.5 w-2.5 rounded-full border",
            i < filled
              ? "scale-110 border-primary bg-primary"
              : error
                ? "border-[var(--c-red)] bg-[var(--c-red)]/20"
                : "border-[var(--bd)] bg-transparent",
          )}
        />
      ))}
    </div>
  );
}

export function MobileLockScreen() {
  const { invoices, transactions } = useBanking();
  const {
    lockMode,
    setLockMode,
    passcodeInput,
    setPasscodeInput,
    passcodeError,
    clearPasscodeError,
    verifyPasscode,
    startFaceIdScan,
    faceIdScanning,
  } = useMobile();
  const { time, date } = useMobileClock();

  const initialAlerts = [
    ...invoices
      .filter((i) => i.status !== "paid")
      .slice(0, 1)
      .map((i) => `Bill due: ${i.sender}`),
    ...transactions.slice(0, 1).map((t) => t.label),
  ].slice(0, 2);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const alerts = initialAlerts.filter((a) => !dismissed.has(a));

  const appendDigit = (digit: string) => {
    clearPasscodeError();
    if (passcodeInput.length >= MOBILE_PASSCODE.length) return;
    const next = passcodeInput + digit;
    setPasscodeInput(next);
    if (next.length === MOBILE_PASSCODE.length) {
      verifyPasscode(next);
    }
  };

  const backspace = () => {
    clearPasscodeError();
    setPasscodeInput(passcodeInput.slice(0, -1));
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col px-5 pb-4">
      {faceIdScanning ? (
        <div
          aria-hidden
          className="mobile-scan-grid pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[32px]"
        >
          <div className="mobile-laser-line" />
        </div>
      ) : null}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-6xl font-extralight tabular-nums tracking-tight text-[var(--tx)]">
          {time}
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--tx-2)]">{date}</p>

        <div className="mobile-lock-crossfade mt-10 w-full max-w-[300px]">
          <div
            className={cn(
              "flex flex-col items-center gap-4",
              lockMode === "face"
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none max-h-0 overflow-hidden opacity-0",
            )}
          >
            <button
              type="button"
              onClick={startFaceIdScan}
              disabled={faceIdScanning}
              className={cn(
                "mobile-press relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--bd-primary)] bg-[var(--bg-surface)]",
                faceIdScanning && "border-[var(--c-green)]/50",
              )}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full border-2 border-primary/40",
                  faceIdScanning && "animate-faceid-ring",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "absolute inset-2 rounded-full border border-primary/25",
                  faceIdScanning && "animate-faceid-ring-delayed",
                )}
                aria-hidden
              />
              <ScanFace
                className={cn(
                  "h-11 w-11 text-primary",
                  faceIdScanning && "animate-pulse",
                )}
              />
            </button>
            <p className="text-sm text-[var(--tx-2)]">
              {faceIdScanning ? "Scanning…" : "Tap for Face ID"}
            </p>
            <button
              type="button"
              onClick={() => setLockMode("passcode")}
              className="text-xs font-semibold text-primary"
            >
              Use Passcode
            </button>
          </div>

          <div
            className={cn(
              "flex w-full flex-col items-center",
              lockMode === "passcode"
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none max-h-0 overflow-hidden opacity-0",
              passcodeError && "mobile-passcode-error-flash rounded-2xl px-2",
            )}
          >
            <p className="mb-4 text-sm font-medium text-[var(--tx)]">
              Enter Passcode
            </p>
            <PinDots filled={passcodeInput.length} error={passcodeError} />
            {passcodeError ? (
              <p className="mt-2 text-xs text-[var(--c-red)]">
                Incorrect passcode
              </p>
            ) : null}
            <div className="mt-6 w-full">
              <NumericKeypad
                onDigit={appendDigit}
                onBackspace={backspace}
                showDot={false}
                compact
              />
            </div>
            <button
              type="button"
              onClick={() => setLockMode("face")}
              className="mt-4 text-xs font-semibold text-primary"
            >
              Use Face ID
            </button>
          </div>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="relative z-10 flex flex-col gap-2">
          {alerts.map((text, i) => (
            <button
              key={text}
              type="button"
              onClick={() => setDismissed((prev) => new Set(prev).add(text))}
              className={cn(
                "panel-card mobile-press px-3 py-2 text-left text-[11px] text-[var(--tx-2)]",
                `mobile-stagger-${i + 1}`,
                "mobile-chip-pop",
              )}
            >
              {text}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
