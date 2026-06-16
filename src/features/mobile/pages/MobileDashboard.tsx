import { ArrowDownToLine, CreditCard, Receipt, Send } from "lucide-react";
import { TransactionRow } from "@/features/banking/components/TransactionRow";
import { useBanking } from "@/features/banking/context/BankingContext";
import { MobileBalanceCarousel } from "../components/ui/MobileBalanceCarousel";
import { MobileEmptyState } from "../components/ui/MobileEmptyState";
import { MobileQuickAction } from "../components/ui/MobileQuickAction";
import { MobileRequestSheet } from "../components/ui/MobileRequestSheet";
import { MobileScreen } from "../components/ui/MobileScreen";
import { MobileYourCardPanel } from "../components/ui/MobileYourCardPanel";
import { useMobile } from "../hooks/useMobile";

export function MobileDashboard() {
  const { character, activeAccount, transactions } = useBanking();
  const { setTab, openRequest } = useMobile();

  const holderName = `${character.firstName} ${character.lastName}`.trim();

  const recent = transactions
    .filter((t) => t.accountId === activeAccount.id)
    .slice(0, 30);

  return (
    <>
      <MobileScreen scrollable={false} scrollClassName="gap-4 pt-7" immersive>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="mobile-stagger-1 shrink-0">
            <p className="text-[11px] text-[var(--tx-2)]">Welcome back</p>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--tx)]">
              {character.firstName} {character.lastName}
            </h2>
          </div>

          <div className="mobile-stagger-2 shrink-0">
            <MobileBalanceCarousel />
          </div>

          <div className="mobile-stagger-3 shrink-0">
            <MobileYourCardPanel
              key={activeAccount.id}
              holderName={holderName}
              iban={activeAccount.iban}
              balance={activeAccount.balance}
            />
          </div>

          <div className="mobile-stagger-4 shrink-0">
            <div className="grid grid-cols-4 gap-2">
              <MobileQuickAction
                icon={Send}
                label="Send"
                onClick={() => setTab("transfer")}
              />
              <MobileQuickAction
                icon={ArrowDownToLine}
                label="Request"
                onClick={openRequest}
              />
              <MobileQuickAction
                icon={Receipt}
                label="Bills"
                onClick={() => setTab("invoices")}
              />
              <MobileQuickAction
                icon={CreditCard}
                label="Cards"
                onClick={() => setTab("cards")}
              />
            </div>
          </div>

          <div className="mobile-stagger-5 flex min-h-0 flex-1 flex-col">
            <h3 className="mb-2 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[var(--tx-2)]">
              Recent Activity
            </h3>
            <div className="min-h-0 flex-1 overflow-y-auto pb-[var(--mobile-tab-clearance)] mobile-scrollbar-hide">
              {recent.length === 0 ? (
                <MobileEmptyState
                  icon={Receipt}
                  title="No recent activity"
                  description="Transactions on this account will appear here."
                />
              ) : (
                <div className="flex flex-col gap-1.5 pb-1">
                  {recent.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      variant="dashboard"
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </MobileScreen>
      <MobileRequestSheet />
    </>
  );
}
