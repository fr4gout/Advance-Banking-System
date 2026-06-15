import { useEffect, useState } from "react";
import { useBanking } from "../context/BankingContext";
import { AccountListPanel } from "../components/accounts/AccountListPanel";
import { AccountDetailPanel } from "../components/accounts/AccountDetailPanel";
import type { AccountKind } from "../types/banking";

export function AccountsView() {
  const { accounts, activeAccount, activeAccountId, switchAccount } = useBanking();
  const [tab, setTab] = useState<AccountKind>(activeAccount.kind);

  useEffect(() => {
    setTab(activeAccount.kind);
  }, [activeAccount.kind, activeAccountId]);

  const handleTabChange = (next: AccountKind) => {
    setTab(next);
    const inTab = accounts.filter((a) => a.kind === next);
    if (inTab.length === 0) return;
    const stillInTab = inTab.some((a) => a.id === activeAccountId);
    if (!stillInTab) {
      switchAccount(inTab[0].id);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === activeAccountId) ?? null;

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(300px,360px)_minmax(0,1fr)] gap-3">
      <AccountListPanel
        className="min-h-0"
        accounts={accounts}
        tab={tab}
        selectedId={activeAccountId}
        onTabChange={handleTabChange}
        onSelect={switchAccount}
      />
      <AccountDetailPanel className="min-h-0" account={selectedAccount} />
    </div>
  );
}
