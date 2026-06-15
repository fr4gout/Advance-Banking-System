import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useBanking } from "../context/BankingContext";
import { IssueCardModal } from "../components/cards/IssueCardModal";
import { VirtualCardTile } from "../components/cards/VirtualCardTile";
import { IssueCardTile } from "../components/cards/IssueCardTile";
import { CardDetailSheet } from "../components/cards/CardDetailSheet";
import type { VirtualCard } from "../types/banking";

export function CardsView() {
  const { cards, activeAccount, issueVirtualCard, updateVirtualCard } = useBanking();
  const [issueOpen, setIssueOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const list = useMemo(() => cards.filter((c) => c.accountId === activeAccount.id), [cards, activeAccount.id]);

  const openDetail = (card: VirtualCard) => {
    setSelectedCard(card);
    setDetailOpen(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <GlassCard className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">Virtual Cards</div>
            <div className="truncate text-[10px] text-white/40">
              {list.length} of 3 · Issue cost $50
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIssueOpen(true)}
            className="inline-flex h-9 items-center gap-2 radius-control bg-primary px-3.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Issue Card
          </button>
        </div>

        <div className="mt-4 shrink-0">
          <div className="flex snap-x snap-mandatory items-start gap-3 overflow-x-auto pb-2 panel-scroll">
            {list.map((c) => (
              <VirtualCardTile
                key={c.id}
                card={c}
                active={selectedCard?.id === c.id}
                onSelect={() => openDetail(c)}
                className="snap-start"
              />
            ))}
            <IssueCardTile className="snap-start" onClick={() => setIssueOpen(true)} />
          </div>
        </div>
      </GlassCard>

      <IssueCardModal
        open={issueOpen}
        onOpenChange={setIssueOpen}
        onIssue={(args) => issueVirtualCard({ accountId: activeAccount.id, ...args })}
      />

      <CardDetailSheet
        card={selectedCard}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={updateVirtualCard}
      />
    </div>
  );
}
