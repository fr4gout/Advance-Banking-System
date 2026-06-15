import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";
import { buildAccountDistribution } from "../utils/accountDistribution";
import { PanelScroll } from "./PanelScroll";

export function AccountDistributionChart() {
  const { accounts } = useBanking();

  const slices = useMemo(() => buildAccountDistribution(accounts), [accounts]);

  const chartConfig = useMemo(
    () => Object.fromEntries(slices.map((s) => [s.id, { label: s.name, color: s.fill }])),
    [slices],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <div className="text-sm font-semibold text-white">Distribution</div>
        <div className="text-[10px] text-white/40">Balance across accounts</div>
      </div>

      <ChartContainer config={chartConfig} className="mx-auto mt-1 h-[120px] w-full max-w-[160px] shrink-0">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="panel-modal border-primary/30"
                formatter={(value) => formatMoney(Number(value))}
              />
            }
          />
          <Pie
            data={slices}
            dataKey="balance"
            nameKey="name"
            innerRadius={36}
            outerRadius={56}
            strokeWidth={2}
            stroke="rgba(6,8,16,0.8)"
            cornerRadius={4}
          >
            {slices.map((slice) => (
              <Cell key={slice.id} fill={slice.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <PanelScroll className="mt-2 flex flex-col gap-1.5">
        {slices.map((slice) => (
          <div
            key={slice.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[10px]"
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: slice.fill }} />
              <span className="truncate text-white/70">{slice.name}</span>
            </div>
            <span className="shrink-0 font-mono font-medium tabular-nums text-white">
              {formatMoney(slice.balance)}
            </span>
          </div>
        ))}
      </PanelScroll>
    </div>
  );
}
