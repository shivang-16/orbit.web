"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createCheckoutSession } from "@/lib/checkout";

/**
 * Picks up `?checkout=<plan_slug>` after a signed-out visitor completes
 * Clerk sign-up from the pricing page, starts the Dodo checkout session,
 * and redirects to the hosted checkout page.
 */
export function CheckoutOnLoad() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const planSlug = searchParams.get("checkout");

  useEffect(() => {
    if (!planSlug || started.current) return;
    started.current = true;

    createCheckoutSession(planSlug)
      .then(({ checkout_url }) => {
        window.location.href = checkout_url;
      })
      .catch(() => {
        setError("Could not start checkout for the selected plan. Please try again from the pricing page.");
        router.replace("/dashboard");
      });
  }, [planSlug, router]);

  if (!error) return null;

  return (
    <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-2.5 text-center text-[13px] text-red-300">
      {error}
    </div>
  );
}
