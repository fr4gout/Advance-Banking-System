import type { Transaction, TransactionSearchState, TxFilterCategory, TxType } from "../types/banking";

const CATEGORY_TYPES: Record<Exclude<TxFilterCategory, "all">, TxType[]> = {
  salary: ["salary"],
  transfers: ["transfer_in", "transfer_out"],
  purchases: ["purchase"],
  invoices: ["invoice"],
  deposits: ["deposit"],
  withdrawals: ["withdraw"],
};

export function categoryToTypes(category: TxFilterCategory): TxType[] | null {
  if (category === "all") return null;
  return CATEGORY_TYPES[category];
}

export function isSearchActive(search: TransactionSearchState): boolean {
  return search.query.trim().length > 0 || search.category !== "all";
}

export function filterTransactions(
  transactions: Transaction[],
  accountId: string,
  search: TransactionSearchState,
): Transaction[] {
  const query = search.query.trim().toLowerCase();
  const types = categoryToTypes(search.category);

  return transactions.filter((tx) => {
    if (tx.accountId !== accountId) return false;
    if (types && !types.includes(tx.type)) return false;
    if (!query) return true;

    const haystack = [tx.label, tx.counterparty, tx.note]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function filterTransferTransactions(
  transactions: Transaction[],
  accountId: string,
  search: TransactionSearchState,
): Transaction[] {
  return filterTransactions(transactions, accountId, search).filter(
    (tx) => tx.type === "transfer_in" || tx.type === "transfer_out",
  );
}
