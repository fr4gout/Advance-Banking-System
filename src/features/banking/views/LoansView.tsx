import { useMemo, useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { PanelScroll } from "../components/PanelScroll";
import { ApplyLoanModal } from "../components/loans/ApplyLoanModal";
import { CreditProfileBar } from "../components/loans/CreditProfileBar";
import { FeaturedLoanPanel } from "../components/loans/FeaturedLoanPanel";
import { LoanProductCard } from "../components/loans/LoanProductCard";
import { LoanStatsRail } from "../components/loans/LoanStatsRail";
import { useBanking } from "../context/BankingContext";
import type { LoanProduct } from "../types/banking";
import { countEligibleProducts, getLoanEligibility } from "../utils/loanEligibility";

export function LoansView() {
  const {
    creditProfile,
    loanProducts,
    activeLoans,
    character,
    activeAccount,
    accounts,
    activeAccountId,
    switchAccount,
    applyForLoan,
  } = useBanking();

  const [applyProduct, setApplyProduct] = useState<LoanProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const featured = useMemo(
    () => loanProducts.find((p) => p.featured) ?? loanProducts[0],
    [loanProducts],
  );

  const browseProducts = useMemo(
    () => loanProducts.filter((p) => !p.featured),
    [loanProducts],
  );

  const outstandingTotal = useMemo(
    () =>
      activeLoans
        .filter((l) => l.accountId === activeAccount.id && l.status === "open")
        .reduce((sum, l) => sum + l.principal, 0),
    [activeLoans, activeAccount.id],
  );

  const openLoanCount = useMemo(
    () => activeLoans.filter((l) => l.accountId === activeAccount.id && l.status === "open").length,
    [activeLoans, activeAccount.id],
  );

  const availableProductCount = useMemo(
    () => countEligibleProducts(loanProducts, character, activeAccount),
    [loanProducts, character, activeAccount],
  );

  const openApply = (product: LoanProduct) => {
    setApplyProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <GlassCard className="flex h-full min-h-0 flex-col overflow-hidden p-4">
        <PanelScroll className="flex flex-col gap-4">
          <CreditProfileBar profile={creditProfile} />

          <div className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(220px,280px)]">
            {featured ? (
              <FeaturedLoanPanel product={featured} onApply={() => openApply(featured)} />
            ) : null}
            <LoanStatsRail
              outstandingTotal={outstandingTotal}
              availableProductCount={availableProductCount}
              tier={creditProfile.tier}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-white">Browse loans</h2>
              <span className="text-[10px] text-white/40">
                {loanProducts.length} products available
                {openLoanCount > 0 ? ` · ${openLoanCount} active` : ""}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {browseProducts.map((product) => {
                const eligibility = getLoanEligibility(product, character, activeAccount);
                return (
                  <LoanProductCard
                    key={product.id}
                    product={product}
                    eligibility={eligibility}
                    onApply={eligibility.eligible ? () => openApply(product) : undefined}
                  />
                );
              })}
            </div>
          </div>
        </PanelScroll>
      </GlassCard>

      <ApplyLoanModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={applyProduct}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSwitchAccount={switchAccount}
        onApply={applyForLoan}
      />
    </div>
  );
}
