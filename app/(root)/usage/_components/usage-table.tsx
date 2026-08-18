"use client";

import { formatCreditDate, formatLatency, formatSignedCreditDollars } from "@/lib/credits";
import type { UsageRequest } from "@/lib/usage";

export function UsageTable({ requests }: { requests: UsageRequest[] }) {
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-[14px] font-medium text-white">Usage history</h2>
        <button
          type="button"
          onClick={() => exportCsv(requests)}
          className="rounded-lg border border-white/10 px-2.5 py-1 text-[12px] text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/10 text-xs text-zinc-400">
              <th className="px-4 py-2.5 font-normal">Date</th>
              <th className="px-4 py-2.5 font-normal">Type</th>
              <th className="px-4 py-2.5 font-normal">Model</th>
              <th className="px-4 py-2.5 text-right font-normal">Input</th>
              <th className="px-4 py-2.5 text-right font-normal">Output</th>
              <th className="px-4 py-2.5 text-right font-normal">Latency</th>
              <th className="px-4 py-2.5 text-right font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((entry) => (
              <tr key={entry.id} className="border-b border-white/5 last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                  {formatCreditDate(entry.created_at)}
                </td>
                <td className="px-4 py-3 text-zinc-200">
                  {entry.status === "error" ? "Error" : "Usage"}
                </td>
                <td className="max-w-xs px-4 py-3 text-zinc-300">
                  <span className="line-clamp-2">{entry.model_name || "—"}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-300">
                  {entry.input_tokens.toLocaleString("en-US")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-300">
                  {entry.output_tokens.toLocaleString("en-US")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-300">
                  {formatLatency(entry.latency_ms)}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                    entry.amount_micros < 0 ? "text-red-400" : "text-zinc-300"
                  }`}
                >
                  {formatSignedCreditDollars(entry.amount_micros)}
                </td>
              </tr>
            ))}
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  No usage in this range.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function exportCsv(requests: UsageRequest[]) {
  const header = ["date", "type", "model", "input_tokens", "output_tokens", "latency_ms", "amount_micros"];
  const lines = [
    header.join(","),
    ...requests.map((row) =>
      [
        row.created_at,
        row.status === "error" ? "error" : "usage",
        csvCell(row.model_name),
        row.input_tokens,
        row.output_tokens,
        row.latency_ms,
        row.amount_micros,
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "orbit-usage.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string) {
  if (value.includes(",") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}
