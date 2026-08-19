"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useOrg } from "@/components/org/org-context";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { fetchOrganizationCredits, formatExactCreditDollars, type OrganizationCredits } from "@/lib/credits";

export function CreditsPage() {
  const { activeOrganization } = useOrg();
  const [credits, setCredits] = useState<OrganizationCredits | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrganization) {
      setCredits(null);
      return;
    }

    let cancelled = false;
    setCredits(null);
    setError(null);

    fetchOrganizationCredits()
      .then((nextCredits) => {
        if (!cancelled) setCredits(nextCredits);
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
    <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[12px] text-zinc-500">Credits</p>
      <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white">Credits</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        Credit balance for {orgName}
      </p>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : !credits ? (
        <Loader />
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Total credits given" value={formatExactCreditDollars(credits.credits_granted_micros)} />
            <SummaryCard label="Total used" value={formatExactCreditDollars(credits.credits_used_micros)} />
            <SummaryCard label="Left credits" value={formatExactCreditDollars(credits.credits_remaining_micros)} />
          </div>

          <section className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-5">
            <h2 className="text-[14px] font-medium text-white">Add more credits</h2>
            <p className="mt-1 text-[13px] text-zinc-400">
              Choose a plan on the pricing page to top up this organization.
            </p>
            <Button asChild className="mt-4">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </section>
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
