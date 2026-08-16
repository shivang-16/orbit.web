"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WalletIcon } from "@phosphor-icons/react";

import { useOrg } from "@/components/org/org-context";
import { fetchOrganizationCredits, formatCreditDollars } from "@/lib/credits";

export function LoadCreditsButton() {
  const { activeOrganization } = useOrg();
  const [remainingMicros, setRemainingMicros] = useState<number | null>(null);

  useEffect(() => {
    if (!activeOrganization) {
      setRemainingMicros(0);
      return;
    }

    let cancelled = false;
    fetchOrganizationCredits()
      .then((data) => {
        if (!cancelled) setRemainingMicros(data.credits_remaining_micros);
      })
      .catch(() => {
        if (!cancelled) setRemainingMicros(0);
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganization]);

  return (
    <Link
      href="/pricing"
      className="flex h-7 items-center gap-2 rounded-full border border-white/15 bg-black px-2.5 text-[12px] transition-colors hover:border-white/25 hover:bg-white/5"
    >
      <WalletIcon size={13} className="shrink-0 text-zinc-300" />
      <span className="text-zinc-300">Load credits</span>
      <span className="h-3 w-px bg-white/20" />
      <span className="font-medium text-white">
        {remainingMicros === null ? "—" : formatCreditDollars(remainingMicros)}
      </span>
    </Link>
  );
}
