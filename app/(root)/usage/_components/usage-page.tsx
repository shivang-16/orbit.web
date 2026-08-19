"use client";

import { useEffect, useState } from "react";

import { useOrg } from "@/components/org/org-context";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { formatSignedCreditDollars } from "@/lib/credits";
import {
  DEFAULT_USAGE_PAGE_SIZE,
  USAGE_RANGE_PRESETS,
  fetchUsage,
  formatTokenCount,
  formatUsageRangeLabel,
  type UsageRangePreset,
  type UsageResponse,
} from "@/lib/usage";

import { UsageChart } from "./usage-chart";
import { UsageTable } from "./usage-table";

export function UsagePage() {
  const { activeOrganization } = useOrg();
  const [range, setRange] = useState<UsageRangePreset>("7d");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_USAGE_PAGE_SIZE);
  const [data, setData] = useState<UsageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrganization) {
      setData(null);
      return;
    }

    let cancelled = false;

    fetchUsage(range, page, limit)
      .then((next) => {
        if (!cancelled) {
          setData(next);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load usage.");
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganization, range, page, limit]);

  function onRangeChange(next: UsageRangePreset) {
    setRange(next);
    setPage(1);
    setData(null);
  }

  function onLimitChange(next: number) {
    setLimit(next);
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
      <p className="text-[12px] text-zinc-500">Usage</p>
      <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white">Usage</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        Tokens, cost, and requests for {activeOrganization?.name ?? "your organization"}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-zinc-300">
          {data ? formatUsageRangeLabel(data.from, data.to) : "—"}
        </p>
        <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-[#0b0b0c] p-1">
          {USAGE_RANGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onRangeChange(preset.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] transition-colors",
                range === preset.id
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : !data ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Input tokens" value={formatTokenCount(data.input_tokens)} />
            <SummaryCard label="Output tokens" value={formatTokenCount(data.output_tokens)} />
            <SummaryCard label="Cost" value={formatSignedCreditDollars(data.cost_micros)} />
          </div>

          <UsageChart series={data.series} />
          <UsageTable
            requests={data.requests}
            page={data.requests_page}
            limit={data.requests_limit}
            total={data.requests_total}
            onPageChange={setPage}
            onLimitChange={onLimitChange}
          />
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-4">
      <p className="text-[12px] text-zinc-400">{label}</p>
      <p className="mt-2 text-[22px] font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}
