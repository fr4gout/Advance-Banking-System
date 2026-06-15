import { useMemo } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "@/features/banking/context/BankingContext";
import { formatMoney } from "@/features/banking/hooks/useCurrency";
import { notifyBankingError } from "@/features/banking/utils/bankingNotify";
import { isCitizenIdValid } from "@/features/banking/utils/transferLimits";
import { NumericKeypad } from "../NumericKeypad";
import { MobileListRow } from "./MobileListRow";
import { MobilePressable } from "./MobilePressable";
import { MobileSheet } from "./MobileSheet";
import { MobileStepProgress } from "./MobileStepProgress";
import { MobileTextArea } from "./MobileTextArea";
import { MobileTextField } from "./MobileTextField";
import { useMobile } from "../../hooks/useMobile";

const IBAN_RE = /^LS\d{2}(?:\s?\d{4}){3}$/i;

export function MobileRequestSheet() {
  const { contacts, requestPayment } = useBanking();
  const { requestOpen, requestDraft, closeRequest, setRequestDraft } = useMobile();

  const amount = useMemo(() => {
    const n = Number(requestDraft.amountRaw.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [requestDraft.amountRaw]);

  const recipientValid = requestDraft.useManualRecipient
    ? IBAN_RE.test(requestDraft.toIban.trim()) || isCitizenIdValid(requestDraft.citizenId)
    : requestDraft.selectedContact !== null;

  const canProceedStep1 = recipientValid;
  const canProceedStep2 = amount > 0 && requestDraft.reason.trim().length > 0;

  const recipientLabel =
    requestDraft.selectedContact?.name ??
    (requestDraft.citizenId.trim() || requestDraft.toIban.trim() || "—");

  const appendAmount = (digit: string) => {
    if (digit === "." && requestDraft.amountRaw.includes(".")) return;
    setRequestDraft({ amountRaw: requestDraft.amountRaw + digit });
  };

  const backspaceAmount = () => {
    setRequestDraft({ amountRaw: requestDraft.amountRaw.slice(0, -1) });
  };

  const executeRequest = () => {
    if (!canProceedStep2) return;

    const toIban = requestDraft.useManualRecipient
      ? requestDraft.toIban.trim()
      : requestDraft.selectedContact?.iban;
    const citizenId = requestDraft.useManualRecipient
      ? requestDraft.citizenId.trim()
      : undefined;
    const contactName = requestDraft.selectedContact?.name;

    if (!toIban && !citizenId) {
      notifyBankingError("Enter a valid recipient");
      return;
    }

    requestPayment({
      toIban: toIban || undefined,
      citizenId: citizenId || undefined,
      amount,
      reason: requestDraft.reason.trim(),
      contactName,
    });
    closeRequest();
  };

  const stepBody = (() => {
    switch (requestDraft.step) {
      case 1:
        return (
          <>
            <div className="flex gap-2">
              <MobilePressable
                variant={!requestDraft.useManualRecipient ? "primary" : "surface"}
                className="flex-1 py-2 text-[11px] font-semibold"
                onClick={() => setRequestDraft({ useManualRecipient: false })}
              >
                Contacts
              </MobilePressable>
              <MobilePressable
                variant={requestDraft.useManualRecipient ? "primary" : "surface"}
                className="flex-1 py-2 text-[11px] font-semibold"
                onClick={() =>
                  setRequestDraft({ useManualRecipient: true, selectedContact: null })
                }
              >
                Manual
              </MobilePressable>
            </div>

            {requestDraft.useManualRecipient ? (
              <div className="flex flex-col gap-3">
                <MobileTextField
                  label="IBAN"
                  value={requestDraft.toIban}
                  onChange={(e) => setRequestDraft({ toIban: e.target.value })}
                  placeholder="LS00 0000 0000 0000"
                  onClear={() => setRequestDraft({ toIban: "" })}
                />
                <MobileTextField
                  label="Citizen ID"
                  value={requestDraft.citizenId}
                  onChange={(e) =>
                    setRequestDraft({ citizenId: e.target.value.toUpperCase() })
                  }
                  placeholder="Or Citizen ID"
                  onClear={() => setRequestDraft({ citizenId: "" })}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {contacts.map((contact, i) => (
                  <MobileListRow
                    key={contact.id}
                    icon={User}
                    title={contact.name}
                    subtitle={contact.iban}
                    selected={requestDraft.selectedContact?.id === contact.id}
                    stagger={(Math.min(i, 4) + 1) as 1 | 2 | 3 | 4 | 5}
                    onClick={() =>
                      setRequestDraft({
                        selectedContact: contact,
                        toIban: contact.iban,
                      })
                    }
                  />
                ))}
              </div>
            )}

            <MobilePressable
              variant="primary"
              disabled={!canProceedStep1}
              className="w-full py-2.5 text-sm font-semibold disabled:opacity-40"
              onClick={() => setRequestDraft({ step: 2 })}
            >
              Continue
            </MobilePressable>
          </>
        );
      case 2:
        return (
          <>
            <div className="panel-card py-5 text-center">
              <p className="text-3xl font-bold tabular-nums text-[var(--tx)]">
                {formatMoney(amount)}
              </p>
            </div>
            <NumericKeypad
              onDigit={appendAmount}
              onBackspace={backspaceAmount}
              onDot={() => appendAmount(".")}
            />
            <MobileTextArea
              label="Reason"
              value={requestDraft.reason}
              onChange={(e) => setRequestDraft({ reason: e.target.value })}
              rows={2}
              placeholder="What is this request for?"
            />
            <div className="flex gap-2">
              <MobilePressable
                className="flex-1 border border-[var(--bd)] py-2 text-sm"
                onClick={() => setRequestDraft({ step: 1 })}
              >
                Back
              </MobilePressable>
              <MobilePressable
                variant="primary"
                disabled={!canProceedStep2}
                className="flex-1 py-2 text-sm font-semibold disabled:opacity-40"
                onClick={() => setRequestDraft({ step: 3 })}
              >
                Continue
              </MobilePressable>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="panel-card space-y-2 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--tx-2)]">From</span>
                <span className="text-right font-medium text-[var(--tx)]">{recipientLabel}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--tx-2)]">Amount</span>
                <span className="font-bold text-primary">{formatMoney(amount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--tx-2)]">Reason</span>
                <span className="text-right text-[var(--tx)]">{requestDraft.reason.trim()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <MobilePressable
                className="flex-1 border border-[var(--bd)] py-2 text-sm"
                onClick={() => setRequestDraft({ step: 2 })}
              >
                Back
              </MobilePressable>
              <MobilePressable
                variant="primary"
                disabled={!canProceedStep2}
                className="flex-1 py-2 text-sm font-semibold disabled:opacity-40"
                onClick={executeRequest}
              >
                Send request
              </MobilePressable>
            </div>
          </>
        );
      default: {
        const _exhaustive: never = requestDraft.step;
        return _exhaustive;
      }
    }
  })();

  return (
    <MobileSheet open={requestOpen} onClose={closeRequest} title="Request money">
      <div className="flex flex-col gap-4 pb-2">
        <MobileStepProgress current={requestDraft.step} total={3} />
        <div className={cn("flex flex-col gap-4")}>{stepBody}</div>
      </div>
    </MobileSheet>
  );
}
