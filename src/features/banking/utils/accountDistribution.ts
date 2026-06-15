import type { Account } from "../types/banking";

export interface DistributionSlice {
  id: string;
  name: string;
  balance: number;
  fill: string;
}

const SLICE_COLORS = [
  "var(--primary)",
  "color-mix(in oklch, var(--primary) 60%, white)",
  "color-mix(in oklch, var(--primary) 35%, transparent)",
  "oklch(0.45 0.02 265)",
  "oklch(0.35 0.02 265)",
];

export function buildAccountDistribution(accounts: Account[]): DistributionSlice[] {
  return accounts.map((account, i) => ({
    id: account.id,
    name: account.name,
    balance: account.balance,
    fill: SLICE_COLORS[i % SLICE_COLORS.length],
  }));
}
