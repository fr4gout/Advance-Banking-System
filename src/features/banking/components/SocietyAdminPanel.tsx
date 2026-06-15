import { useState } from "react";
import { ShieldCheck, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";
import type { Account } from "../types/banking";

const LIMIT_MAX = 10_000_000;

interface SocietyAdminPanelProps {
  account: Account;
}

export function SocietyAdminPanel({ account }: SocietyAdminPanelProps) {
  const { updateSocietyLimits } = useBanking();
  const [withdrawLimit, setWithdrawLimit] = useState(String(account.withdrawLimit ?? ""));
  const [depositLimit, setDepositLimit] = useState(String(account.depositLimit ?? ""));
  const [saved, setSaved] = useState(false);

  const withdrawNum = Number(withdrawLimit.replace(/[^\d.]/g, "")) || 0;
  const depositNum = Number(depositLimit.replace(/[^\d.]/g, "")) || 0;
  const withdrawValid = withdrawNum >= 1 && withdrawNum <= LIMIT_MAX;
  const depositValid = depositNum >= 1 && depositNum <= LIMIT_MAX;
  const formValid = withdrawValid && depositValid;

  const save = () => {
    if (!formValid) return;
    updateSocietyLimits(account.id, {
      withdrawLimit: withdrawNum,
      depositLimit: depositNum,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="radius-card border border-white/5 bg-black/20 p-4">
      <SectionHeader
        title="Society Administration"
        subtitle={`Manage limits and roster for ${account.name}`}
        action={
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" />
            {account.role} — Authorized
          </span>
        }
      />

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/40">
            Account Limits
          </div>
          <div className="flex flex-col gap-3">
            <LimitField
              label="Withdraw Limit"
              value={withdrawLimit}
              onChange={setWithdrawLimit}
              valid={!withdrawLimit || withdrawValid}
            />
            <LimitField
              label="Deposit Limit"
              value={depositLimit}
              onChange={setDepositLimit}
              valid={!depositLimit || depositValid}
            />
            <button
              type="button"
              disabled={!formValid}
              onClick={save}
              className="mt-1 radius-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Limits
            </button>
            {saved ? <div className="text-xs text-emerald-300">Limits updated successfully.</div> : null}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-white/40">
            <Users className="h-3.5 w-3.5" />
            Member Roster
          </div>
          <div className="flex flex-col gap-2">
            {(account.memberRoster ?? []).length === 0 ? (
              <div className="radius-control bg-white/5 px-4 py-6 text-center text-sm text-white/40">
                No members on record.
              </div>
            ) : (
              account.memberRoster!.map((member) => (
                <div
                  key={`${member.name}-${member.rank}`}
                  className="panel-card flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-white">{member.name}</span>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {member.rank}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LimitField({
  label,
  value,
  onChange,
  valid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  valid: boolean;
}) {
  const num = Number(value.replace(/[^\d.]/g, "")) || 0;
  return (
    <div>
      <div className="mb-1 text-xs text-white/50">{label}</div>
      <div className="flex items-center gap-2 radius-control border border-white/10 bg-black/30 px-4 py-2.5">
        <span className="text-white/40">$</span>
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm font-semibold text-white outline-none"
        />
      </div>
      {!valid ? (
        <div className="mt-1 text-xs text-rose-300">Enter between $1 and {formatMoney(LIMIT_MAX)}</div>
      ) : num > 0 ? (
        <div className="mt-1 text-xs text-white/35">{formatMoney(num)}</div>
      ) : null}
    </div>
  );
}
