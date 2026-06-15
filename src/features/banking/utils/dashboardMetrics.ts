import type { Transaction } from "../types/banking";

const IN_TYPES: Transaction["type"][] = ["deposit", "transfer_in", "salary"];
const OUT_TYPES: Transaction["type"][] = ["withdraw", "transfer_out", "purchase", "invoice"];

export interface DashboardMetrics {
  incoming: number;
  outgoing: number;
  netFlow: number;
  txCount: number;
  avgTx: number;
}

export function computeDashboardMetrics(
  transactions: Transaction[],
  accountId: string,
  days = 30,
): DashboardMetrics {
  const rangeStart = Date.now() - days * 86_400_000;
  const recent = transactions.filter((tx) => tx.accountId === accountId && tx.timestamp >= rangeStart);

  let incoming = 0;
  let outgoing = 0;

  for (const tx of recent) {
    if (IN_TYPES.includes(tx.type)) incoming += tx.amount;
    else if (OUT_TYPES.includes(tx.type)) outgoing += tx.amount;
  }

  const txCount = recent.length;
  const totalVolume = recent.reduce((sum, tx) => sum + tx.amount, 0);
  const avgTx = txCount > 0 ? Math.round(totalVolume / txCount) : 0;

  return {
    incoming,
    outgoing,
    netFlow: incoming - outgoing,
    txCount,
    avgTx,
  };
}
