import { CreditCard } from "lucide-react";
import { BankCard } from "../components/cards/BankCard";
import { useATM } from "../hooks/useATM";

export function CardSelectionView() {
  const { cards, selectCard } = useATM();

  return (
    <div className="view-transition p-4">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-[var(--tx-2)]">Choose a card from your inventory</p>
      </div>

      {cards.length === 0 ? (
        <div className="panel-card px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--tx)]">No cards available</p>
          <p className="mt-1 text-xs text-[var(--tx-2)]">
            Insert a bank card into your inventory to use this terminal.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cards.map((card) => (
            <BankCard key={card.id} card={card} compact onClick={() => selectCard(card)} />
          ))}
        </div>
      )}
    </div>
  );
}
