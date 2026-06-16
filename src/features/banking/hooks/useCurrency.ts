import { formatMoney as formatMoneyBase } from "@/lib/currency";

export const formatMoney = formatMoneyBase;

export const formatMoneySigned = (n: number): string => {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  return `${sign}${formatMoney(Math.abs(n))}`;
};

export const maskIban = (iban: string): string => {
  const clean = iban.replace(/\s+/g, "");
  if (clean.length <= 6) return iban;
  return `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`;
};

export const formatRelative = (ts: number): string => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
};

export const formatDueDate = (ts: number): string =>
  new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
