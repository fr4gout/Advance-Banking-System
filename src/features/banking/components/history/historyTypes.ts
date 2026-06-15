import type { TxType } from "../../types/banking";

export type HistoryTypeFilter = "all" | "deposit" | "withdraw" | "transfer_in" | "transfer_out";

export const HISTORY_FILTERS: { id: HistoryTypeFilter; label: string; types: TxType[] | null }[] = [
  { id: "all", label: "All", types: null },
  { id: "deposit", label: "Deposit", types: ["deposit"] },
  { id: "withdraw", label: "Withdraw", types: ["withdraw"] },
  { id: "transfer_in", label: "Transfer in", types: ["transfer_in"] },
  { id: "transfer_out", label: "Transfer out", types: ["transfer_out"] },
];

