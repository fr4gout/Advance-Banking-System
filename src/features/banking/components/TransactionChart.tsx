import { useMemo } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";
import { buildChartData } from "../utils/chartData";

const chartConfig = {
  moneyIn: { label: "IN", color: "var(--success)" },
  moneyOut: { label: "OUT", color: "var(--destructive)" },
};

export function TransactionChart() {
  const { activeAccount, transactions } = useBanking();

  const data = useMemo(
    () => buildChartData(transactions, activeAccount.id, "daily", 30),
    [transactions, activeAccount.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <div className="text-sm font-semibold text-white">Cashflow</div>
        <div className="text-[10px] text-white/40">Last 30 days</div>
      </div>

      <ChartContainer config={chartConfig} className="mt-2 min-h-0 flex-1 [&>div]:!h-full">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            width={32}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="panel-modal border-primary/30 shadow-[var(--shadow-glow)]"
                formatter={(value, name) => (
                  <span className="font-mono tabular-nums">
                    {name}: {formatMoney(Number(value))}
                  </span>
                )}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="moneyIn"
            name="IN"
            stroke="var(--success)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 3, fill: "var(--success)" }}
          />
          <Line
            type="monotone"
            dataKey="moneyOut"
            name="OUT"
            stroke="var(--destructive)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 3, fill: "var(--destructive)" }}
          />
        </LineChart>
      </ChartContainer>

      <div className="mt-1 flex shrink-0 items-center gap-3 text-[10px] text-white/50">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-full bg-[var(--success)]" /> IN
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-full bg-[var(--destructive)]" /> OUT
        </span>
      </div>
    </div>
  );
}
