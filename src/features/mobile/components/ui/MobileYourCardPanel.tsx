import { cn } from "@/lib/utils";
import { DebitCard } from "@/features/banking/components/DebitCard";
import { useBanking } from "@/features/banking/context/BankingContext";
import { getBankThemeConfig } from "@/features/banking/hooks/useBankTheme";
import { formatMoney } from "@/features/banking/hooks/useCurrency";

interface MobileYourCardPanelProps {
  holderName: string;
  iban: string;
  balance: number;
  className?: string;
}

export function MobileYourCardPanel({
  holderName,
  iban,
  balance,
  className,
}: MobileYourCardPanelProps) {
  const { bankTheme } = useBanking();
  const subtitle = `${getBankThemeConfig(bankTheme).name} Debit`;

  return (
    <div
      className={cn(
        "panel-surface flex flex-col gap-3 rounded-[var(--mobile-radius-lg)] border border-[var(--bd)] p-3.5",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-[var(--tx)]">
          Your Card
        </h2>
        <p className="mt-0.5 text-[11px] leading-snug text-[var(--tx-2)]">
          {subtitle}
        </p>
      </div>

      <DebitCard
        compact
        interactive={false}
        holderName={holderName}
        iban={iban}
        balance={formatMoney(balance)}
      />
    </div>
  );
}
