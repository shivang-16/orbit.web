import { apiFetch } from "@/lib/api";

export type UsageRangePreset = "1d" | "7d" | "30d" | "mtd" | "last_month";

export const USAGE_RANGE_PRESETS: { id: UsageRangePreset; label: string }[] = [
  { id: "1d", label: "1d" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "mtd", label: "MTD" },
  { id: "last_month", label: "Last month" },
];

export type UsageModelPoint = {
  model_id: string;
  model_name: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
};

export type UsageDay = {
  date: string;
  models: UsageModelPoint[];
};

export type UsageRequest = {
  id: string;
  created_at: string;
  model_name: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  amount_micros: number;
  status: string;
};

export type UsageResponse = {
  range: UsageRangePreset;
  from: string;
  to: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_micros: number;
  series: UsageDay[];
  requests: UsageRequest[];
  requests_page: number;
  requests_limit: number;
  requests_total: number;
};

export const USAGE_PAGE_SIZES = [25, 50, 75] as const;
export const DEFAULT_USAGE_PAGE_SIZE = 25;

export function fetchUsage(range: UsageRangePreset, page = 1, limit = DEFAULT_USAGE_PAGE_SIZE) {
  const params = new URLSearchParams({
    range,
    page: String(page),
    limit: String(limit),
  });
  return apiFetch(`/usage?${params.toString()}`) as Promise<UsageResponse>;
}

export function formatTokenCount(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${trimZeros(value / 1_000_000)}M`;
  }
  if (abs >= 1_000) {
    return `${trimZeros(value / 1_000)}k`;
  }
  return value.toLocaleString("en-US");
}

function trimZeros(value: number) {
  return value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export function formatUsageRangeLabel(fromISO: string, toISO: string) {
  const from = new Date(fromISO);
  const toExclusive = new Date(toISO);
  if (Number.isNaN(from.getTime()) || Number.isNaN(toExclusive.getTime())) return "—";
  const to = new Date(toExclusive);
  to.setUTCDate(to.getUTCDate() - 1);
  return `${formatShortDate(from)} – ${formatShortDate(to)}`;
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatChartTick(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return formatShortDate(date);
}

export const USAGE_CHART_COLORS = [
  "#86efac",
  "#93c5fd",
  "#c4b5fd",
  "#fdba74",
  "#f9a8d4",
  "#67e8f9",
  "#fcd34d",
  "#a3a3a3",
];
