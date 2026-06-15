import type { Transaction } from "../types/banking";

const IN_TYPES: Transaction["type"][] = ["deposit", "transfer_in", "salary"];
const OUT_TYPES: Transaction["type"][] = ["withdraw", "transfer_out", "purchase", "invoice"];

export type ChartBucket = {
  key: string;
  label: string;
  moneyIn: number;
  moneyOut: number;
};

export type ChartGranularity = "daily" | "weekly";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfWeek(ts: number): number {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDayLabel(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatWeekLabel(ts: number): string {
  const end = new Date(ts);
  end.setDate(end.getDate() + 6);
  const startStr = new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${startStr} – ${endStr}`;
}

export function buildChartData(
  transactions: Transaction[],
  accountId: string,
  granularity: ChartGranularity,
  days = 30,
): ChartBucket[] {
  const now = Date.now();
  const rangeStart = now - days * 86_400_000;
  const accountTxs = transactions.filter((tx) => tx.accountId === accountId && tx.timestamp >= rangeStart);

  const bucketFn = granularity === "daily" ? startOfDay : startOfWeek;
  const labelFn = granularity === "daily" ? formatDayLabel : formatWeekLabel;
  const bucketCount = granularity === "daily" ? days : Math.ceil(days / 7);

  const buckets = new Map<string, ChartBucket>();

  for (let i = bucketCount - 1; i >= 0; i--) {
    const offset = granularity === "daily" ? i * 86_400_000 : i * 7 * 86_400_000;
    const ts = bucketFn(now - offset);
    const key = String(ts);
    buckets.set(key, { key, label: labelFn(ts), moneyIn: 0, moneyOut: 0 });
  }

  for (const tx of accountTxs) {
    const bucketStart = bucketFn(tx.timestamp);
    const key = String(bucketStart);
    const bucket = buckets.get(key);
    if (!bucket) continue;

    if (IN_TYPES.includes(tx.type)) {
      bucket.moneyIn += tx.amount;
    } else if (OUT_TYPES.includes(tx.type)) {
      bucket.moneyOut += tx.amount;
    }
  }

  return Array.from(buckets.values());
}
