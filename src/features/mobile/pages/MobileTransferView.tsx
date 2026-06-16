import { useEffect, useMemo, useRef, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "@/features/banking/context/BankingContext";
import { formatMoney } from "@/features/banking/hooks/useCurrency";
import {
  notifyBankingError,
  notifyBankingSuccess,
} from "@/features/banking/utils/bankingNotify";
import {
  isCitizenIdValid,
  TRANSFER_LIMIT,
} from "@/features/banking/utils/transferLimits";
import { NumericKeypad } from "../components/NumericKeypad";
import { SwipeSlider } from "../components/SwipeSlider";
import { MobileListRow } from "../components/ui/MobileListRow";
import { MobilePageHeader } from "../components/ui/MobilePageHeader";
import { MobilePressable } from "../components/ui/MobilePressable";
import { MobileScreen } from "../components/ui/MobileScreen";
import { MobileStepProgress } from "../components/ui/MobileStepProgress";
import { MobileTextArea } from "../components/ui/MobileTextArea";
import { MobileTextField } from "../components/ui/MobileTextField";
import { useMobile } from "../hooks/useMobile";

import { isValidIban } from "@/features/banking/utils/iban";

export function MobileTransferView() {
  const { contacts, activeAccount, transfer } = useBanking();
  const { transferDraft, setTransferDraft, resetTransferDraft } = useMobile();
  const [amountPulse, setAmountPulse] = useState(false);
  const prevStepRef = useRef(transferDraft.step);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);

  const amount = useMemo(() => {
    const n = Number(transferDraft.amountRaw.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [transferDraft.amountRaw]);

  useEffect(() => {
    if (!transferDraft.amountRaw) return;
    setAmountPulse(true);
    const t = window.setTimeout(() => setAmountPulse(false), 200);
    return () => window.clearTimeout(t);
  }, [transferDraft.amountRaw]);

  useEffect(() => {
    if (transferDraft.step !== prevStepRef.current) {
      setStepDirection(transferDraft.step > prevStepRef.current ? 1 : -1);
      prevStepRef.current = transferDraft.step;
    }
  }, [transferDraft.step]);

  const recipientValid = transferDraft.useManualRecipient
    ? isValidIban(transferDraft.toIban) ||
      isCitizenIdValid(transferDraft.citizenId)
    : transferDraft.selectedContact !== null;

  const canProceedStep1 = recipientValid;
  const canProceedStep2 =
    amount > 0 && amount <= activeAccount.balance && amount <= TRANSFER_LIMIT;

  const appendAmount = (digit: string) => {
    if (digit === "." && transferDraft.amountRaw.includes(".")) return;
    setTransferDraft({ amountRaw: transferDraft.amountRaw + digit });
  };

  const backspaceAmount = () => {
    setTransferDraft({ amountRaw: transferDraft.amountRaw.slice(0, -1) });
  };

  const executeTransfer = () => {
    if (!canProceedStep2) return;

    const toIban = transferDraft.useManualRecipient
      ? transferDraft.toIban.trim()
      : transferDraft.selectedContact?.iban;
    const citizenId = transferDraft.useManualRecipient
      ? transferDraft.citizenId.trim()
      : undefined;
    const contactName = transferDraft.selectedContact?.name;

    if (!toIban && !citizenId) {
      notifyBankingError("Enter a valid recipient");
      return;
    }

    transfer({
      toIban: toIban || undefined,
      citizenId: citizenId || undefined,
      amount,
      note: transferDraft.note.trim() || undefined,
      contactName,
    });
    notifyBankingSuccess(`Sent ${formatMoney(amount)}`);
    resetTransferDraft();
  };

  const stepSlideClass =
    stepDirection > 0 ? "mobile-tab-enter-right" : "mobile-tab-enter-left";

  const stepBody = (() => {
    switch (transferDraft.step) {
      case 1:
        return (
          <>
            <h3 className="text-sm font-semibold text-[var(--tx)]">
              Recipient
            </h3>
            <div className="flex gap-2">
              <MobilePressable
                variant={
                  !transferDraft.useManualRecipient ? "primary" : "surface"
                }
                className="flex-1 py-2 text-[11px] font-semibold"
                onClick={() => setTransferDraft({ useManualRecipient: false })}
              >
                Contacts
              </MobilePressable>
              <MobilePressable
                variant={
                  transferDraft.useManualRecipient ? "primary" : "surface"
                }
                className="flex-1 py-2 text-[11px] font-semibold"
                onClick={() =>
                  setTransferDraft({
                    useManualRecipient: true,
                    selectedContact: null,
                  })
                }
              >
                Manual
              </MobilePressable>
            </div>

            {transferDraft.useManualRecipient ? (
              <div className="flex flex-col gap-3">
                <MobileTextField
                  label="IBAN"
                  value={transferDraft.toIban}
                  onChange={(e) => setTransferDraft({ toIban: e.target.value })}
                  placeholder="LS00 0000 0000 0000"
                  onClear={() => setTransferDraft({ toIban: "" })}
                />
                <MobileTextField
                  label="Citizen ID"
                  value={transferDraft.citizenId}
                  onChange={(e) =>
                    setTransferDraft({
                      citizenId: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Or Citizen ID"
                  onClear={() => setTransferDraft({ citizenId: "" })}
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
                    selected={transferDraft.selectedContact?.id === contact.id}
                    stagger={(Math.min(i, 4) + 1) as 1 | 2 | 3 | 4 | 5}
                    onClick={() =>
                      setTransferDraft({
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
              onClick={() => setTransferDraft({ step: 2 })}
            >
              Continue
            </MobilePressable>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-sm font-semibold text-[var(--tx)]">Amount</h3>
            <div className="panel-card py-6 text-center">
              <p
                className={cn(
                  "text-4xl font-bold tabular-nums text-[var(--tx)]",
                  amountPulse && "mobile-amount-pulse",
                )}
              >
                {formatMoney(amount)}
              </p>
              <p className="mt-1 text-[11px] text-[var(--tx-2)]">
                Available {formatMoney(activeAccount.balance)}
              </p>
            </div>
            <NumericKeypad
              onDigit={appendAmount}
              onBackspace={backspaceAmount}
              onDot={() => appendAmount(".")}
            />
            <div className="flex gap-2">
              <MobilePressable
                className="flex-1 border border-[var(--bd)] py-2 text-sm"
                onClick={() => setTransferDraft({ step: 1 })}
              >
                Back
              </MobilePressable>
              <MobilePressable
                variant="primary"
                disabled={!canProceedStep2}
                className="flex-1 py-2 text-sm font-semibold disabled:opacity-40"
                onClick={() => setTransferDraft({ step: 3 })}
              >
                Continue
              </MobilePressable>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <MobileTextArea
              label="Note (optional)"
              value={transferDraft.note}
              onChange={(e) => setTransferDraft({ note: e.target.value })}
              rows={3}
              placeholder="Add a note…"
            />
            <div className="panel-card p-3 text-sm">
              <p className="text-[var(--tx-2)]">To</p>
              <p className="font-medium text-[var(--tx)]">
                {transferDraft.selectedContact?.name ??
                  (transferDraft.toIban || transferDraft.citizenId)}
              </p>
              <p className="mt-2 text-[var(--tx-2)]">Amount</p>
              <p className="font-bold text-primary">{formatMoney(amount)}</p>
            </div>
            <div className="flex gap-2">
              <MobilePressable
                className="flex-1 border border-[var(--bd)] py-2 text-sm"
                onClick={() => setTransferDraft({ step: 2 })}
              >
                Back
              </MobilePressable>
              <MobilePressable
                variant="primary"
                className="flex-1 py-2 text-sm font-semibold"
                onClick={() => setTransferDraft({ step: 4 })}
              >
                Review
              </MobilePressable>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-sm font-semibold text-[var(--tx)]">
              Confirm Transfer
            </h3>
            <div className="panel-card space-y-2 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--tx-2)]">Recipient</span>
                <span className="text-right font-medium text-[var(--tx)]">
                  {transferDraft.selectedContact?.name ??
                    (transferDraft.toIban || transferDraft.citizenId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--tx-2)]">Amount</span>
                <span className="font-bold text-primary">
                  {formatMoney(amount)}
                </span>
              </div>
              {transferDraft.note ? (
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--tx-2)]">Note</span>
                  <span className="text-right text-[var(--tx)]">
                    {transferDraft.note}
                  </span>
                </div>
              ) : null}
            </div>
            <SwipeSlider
              onConfirm={executeTransfer}
              disabled={!canProceedStep2}
            />
            <MobilePressable
              className="w-full border border-[var(--bd)] py-2 text-sm"
              onClick={() => setTransferDraft({ step: 3 })}
            >
              Back
            </MobilePressable>
          </>
        );
      default: {
        const _exhaustive: never = transferDraft.step;
        return _exhaustive;
      }
    }
  })();

  return (
    <MobileScreen
      stickyHeader={
        <>
          <MobilePageHeader
            title="Transfer"
            subtitle={`Step ${transferDraft.step} of 4`}
          />
          <div className="shrink-0 px-4 pb-3">
            <MobileStepProgress current={transferDraft.step} total={4} />
          </div>
        </>
      }
      scrollClassName="gap-4 pt-2"
    >
      <div
        key={transferDraft.step}
        className={cn("flex flex-col gap-4", stepSlideClass)}
      >
        {stepBody}
      </div>
    </MobileScreen>
  );
}
