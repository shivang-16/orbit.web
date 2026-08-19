"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import {
  USAGE_CHART_COLORS,
  formatChartTick,
  formatTokenCount,
  type UsageDay,
} from "@/lib/usage";

type ChartRow = {
  date: string;
  dailyTotal: number;
  cumulativeTotal: number;
  daily: Record<string, number>;
  [model: string]: string | number | Record<string, number>;
};

export function UsageChart({ series }: { series: UsageDay[] }) {
  const { rows, models } = useMemo(() => buildChart(series), [series]);
  const [groupBy] = useState("Model");

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-4 py-4">
        <div>
          <h2 className="text-[15px] font-medium text-white">Your usage</h2>
          <p className="mt-0.5 text-[13px] text-zinc-400">
            Your usage per day across this period
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black px-3 py-1.5 text-[12px] text-zinc-300">
          Group by: {groupBy}
        </div>
      </div>

      <div className="px-2 py-4 sm:px-4">
        {models.length === 0 ? (
          <p className="px-2 py-16 text-center text-[13px] text-zinc-500">
            No inference usage in this range.
          </p>
        ) : (
          <div className="h-[220px] w-full sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartTick}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatTokenCount}
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as ChartRow | undefined;
                    if (!row) return null;
                    return (
                      <UsageTooltip
                        dateKey={String(label)}
                        models={models}
                        row={row}
                      />
                    );
                  }}
                />
                {models.map((model, index) => (
                  <Area
                    key={model}
                    type="monotone"
                    dataKey={model}
                    stackId="usage"
                    stroke={USAGE_CHART_COLORS[index % USAGE_CHART_COLORS.length]}
                    fill={USAGE_CHART_COLORS[index % USAGE_CHART_COLORS.length]}
                    fillOpacity={0.35}
                    strokeWidth={1.5}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {models.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 px-4 py-3">
          {models.map((model, index) => (
            <span key={model} className="flex items-center gap-2 text-[12px] text-zinc-400">
              <span
                className="size-2.5 rounded-[3px]"
                style={{ background: USAGE_CHART_COLORS[index % USAGE_CHART_COLORS.length] }}
              />
              {model}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function UsageTooltip({
  dateKey,
  models,
  row,
}: {
  dateKey: string;
  models: string[];
  row: ChartRow;
}) {
  const dailyRows = models
    .map((model) => ({ model, tokens: row.daily[model] ?? 0 }))
    .filter((item) => item.tokens > 0)
    .sort((a, b) => b.tokens - a.tokens);

  return (
    <div className="min-w-[220px] rounded-lg border border-white/10 bg-[#111] px-3 py-2.5 shadow-xl">
      <p className="text-[12px] font-medium text-white">{formatChartTick(dateKey)}</p>
      <p className="mt-0.5 text-[11px] text-zinc-500">Daily breakdown</p>
      <div className="mt-2 space-y-1">
        {dailyRows.map((item) => (
          <div key={item.model} className="flex items-center justify-between gap-4 text-[12px]">
            <span className="max-w-[140px] truncate text-zinc-300">{item.model}</span>
            <span className="tabular-nums text-zinc-200">
              {formatTokenCount(item.tokens)}
              <span className="ml-1 text-zinc-500">
                ({row.dailyTotal > 0 ? ((item.tokens / row.dailyTotal) * 100).toFixed(1) : "0.0"}%)
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 border-t border-white/10 pt-2 text-[12px]">
        <div className={cn("flex justify-between text-zinc-300")}>
          <span>Daily total</span>
          <span className="tabular-nums">{formatTokenCount(row.dailyTotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-zinc-300">
          <span>Cumulative</span>
          <span className="tabular-nums">{formatTokenCount(row.cumulativeTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function buildChart(series: UsageDay[]) {
  const models = Array.from(
    new Set(series.flatMap((day) => day.models.map((model) => model.model_name)))
  );
  const running: Record<string, number> = {};
  for (const model of models) running[model] = 0;

  const rows: ChartRow[] = series.map((day) => {
    const daily: Record<string, number> = {};
    let dailyTotal = 0;
    for (const point of day.models) {
      daily[point.model_name] = (daily[point.model_name] ?? 0) + point.total_tokens;
      dailyTotal += point.total_tokens;
      running[point.model_name] = (running[point.model_name] ?? 0) + point.total_tokens;
    }
    const row: ChartRow = {
      date: day.date,
      dailyTotal,
      cumulativeTotal: Object.values(running).reduce((sum, value) => sum + value, 0),
      daily,
    };
    for (const model of models) {
      row[model] = running[model] ?? 0;
    }
    return row;
  });

  return { rows, models };
}
