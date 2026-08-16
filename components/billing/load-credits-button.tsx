"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WalletIcon } from "@phosphor-icons/react";

import { useOrg } from "@/components/org/org-context";
import { Button } from "@/components/ui/button";
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
    <Button asChild variant="outline" size="lg" className="px-3">
      <Link href="/pricing">
        <WalletIcon size={14} className="text-zinc-300" />
        <span className="text-zinc-300">Load credits</span>
        <span className="h-3.5 w-px bg-white/20" />
        <span className="font-medium text-white">
          {remainingMicros === null ? "—" : formatCreditDollars(remainingMicros)}
        </span>
      </Link>
    </Button>
  );
}
