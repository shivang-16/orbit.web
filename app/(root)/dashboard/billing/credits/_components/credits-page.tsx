"use client";

import { useEffect, useState } from "react";

import { useOrg } from "@/components/org/org-context";
import { Loader } from "@/components/ui/loader";
import {
  fetchCreditHistory,
  fetchOrganizationCredits,
  formatCreditDate,
  formatCreditDollars,
  formatSignedCreditDollars,
  type CreditHistoryEntry,
  type OrganizationCredits,
} from "@/lib/credits";

export function CreditsPage() {
  const { activeOrganization } = useOrg();
  const [credits, setCredits] = useState<OrganizationCredits | null>(null);
  const [history, setHistory] = useState<CreditHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrganization) {
      setCredits(null);
      setHistory([]);
      return;
    }

    let cancelled = false;
    setCredits(null);
    setHistory(null);
    setError(null);

    Promise.all([fetchOrganizationCredits(), fetchCreditHistory()])
      .then(([nextCredits, nextHistory]) => {
        if (cancelled) return;
        setCredits(nextCredits);
        setHistory(nextHistory.entries ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load credits.");
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganization]);

  const orgName = credits?.organization_name ?? activeOrganization?.name ?? "your organization";

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
      <p className="text-[12px] text-zinc-500">Credits</p>
      <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white">Credits</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        Credit balance and history for {orgName}
      </p>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : !credits || history === null ? (
        <Loader />
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Total credits given" value={formatCreditDollars(credits.credits_granted_micros)} />
            <SummaryCard label="Total used" value={formatCreditDollars(credits.credits_used_micros)} />
            <SummaryCard label="Left credits" value={formatCreditDollars(credits.credits_remaining_micros)} />
          </div>

          <HistoryTable entries={history} />
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

function HistoryTable({ entries }: { entries: CreditHistoryEntry[] }) {
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-[14px] font-medium text-white">Credit history</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/10 text-xs text-zinc-400">
              <th className="px-4 py-2.5 font-normal">Date</th>
              <th className="px-4 py-2.5 font-normal">Type</th>
              <th className="px-4 py-2.5 font-normal">Description</th>
              <th className="px-4 py-2.5 text-right font-normal">Amount</th>
              <th className="px-4 py-2.5 font-normal">Reference</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-white/5 last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                  {formatCreditDate(entry.created_at)}
                </td>
                <td className="px-4 py-3 text-zinc-200">{entry.type_label}</td>
                <td className="max-w-sm px-4 py-3 text-zinc-300">
                  <span className="line-clamp-2">{entry.description}</span>
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                    entry.amount_micros > 0
                      ? "text-emerald-400"
                      : entry.amount_micros < 0
                        ? "text-red-400"
                        : "text-zinc-300"
                  }`}
                >
                  {formatSignedCreditDollars(entry.amount_micros)}
                </td>
                <td className="px-4 py-3 font-mono text-[12px] text-zinc-500">
                  {entry.idempotency_key || "—"}
                </td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  No credit history yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
