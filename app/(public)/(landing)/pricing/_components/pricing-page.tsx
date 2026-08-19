"use client";

import { useEffect, useState } from "react";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { createCheckoutSession } from "@/lib/checkout";
import { fetchPlans, formatPlanDollars, type Plan } from "@/lib/plans";

import { PlanIcon } from "./plan-icon";

export function PricingPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPlans()
      .then((data) => {
        if (!cancelled) setPlans(data.plans ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load plans.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex-1 bg-black px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="text-center text-[clamp(2rem,8vw,4.5rem)] leading-[0.95] font-normal tracking-[-0.045em] text-white">
          Plans that grow with you
        </h1>

        {error ? (
          <p className="mt-16 text-center text-sm text-red-400">{error}</p>
        ) : !plans ? (
          <div className="mt-24 flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} outlined={index === 0} />
              ))}
            </div>

            <CustomPlanRow />

            <p className="mt-10 text-center text-[13px] text-zinc-500">
              *Credits are billed at Bedrock list rates. Unused monthly credits
              do not stack forever. Prices and plans are subject to change.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function PlanCard({ plan, outlined }: { plan: Plan; outlined: boolean }) {
  const price = formatPlanDollars(plan.price_micros);
  const credits = formatPlanDollars(plan.credits_micros);

  return (
    <article
      className={`flex flex-col rounded-[28px] border bg-[#161616] ${
        plan.highlighted ? "border-white/25" : "border-white/10"
      }`}
    >
      <div className="flex flex-1 flex-col px-5 pt-7 pb-5 sm:px-7 sm:pt-8 sm:pb-6">
        <PlanIcon slug={plan.slug} />
        <h2 className="mt-6 text-[1.75rem] leading-none font-semibold tracking-tight text-white sm:text-[2rem]">
          {plan.name}
        </h2>
        <p className="mt-3 min-h-0 text-[15px] leading-snug text-zinc-400 sm:min-h-10">
          {plan.tagline}
        </p>

        <div className="mt-8 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span className="text-[2.75rem] leading-none font-medium tracking-tight text-white sm:text-[3.25rem]">
            ${price}
          </span>
          <span className="mb-1.5 text-sm text-zinc-400">
            USD / month
            <span className="mt-0.5 block text-zinc-500">
              ${credits} in credits
            </span>
          </span>
        </div>

        <PlanCTA plan={plan} outlined={outlined} />
      </div>

      <div className="border-t border-white/10 px-5 py-5 sm:px-7 sm:py-6">
        {plan.includes_from ? (
          <p className="mb-3 text-[15px] text-zinc-300">
            Everything in {plan.includes_from}, plus:
          </p>
        ) : null}
        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-[14px] leading-snug text-zinc-300">
              <Check className="mt-0.5 size-4 shrink-0 text-zinc-400" strokeWidth={2} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Signed-out visitors go through Clerk sign-up first; the dashboard picks the
 * `checkout` query param back up and starts the Dodo session automatically. */
function PlanCTA({ plan, outlined }: { plan: Plan; outlined: boolean }) {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonClassName = "mt-8 h-12 w-full rounded-xl text-sm";
  const variant = outlined ? "outline" : "default";

  if (!isSignedIn) {
    return (
      <SignUpButton forceRedirectUrl={`/dashboard?checkout=${encodeURIComponent(plan.slug)}`}>
        <Button type="button" variant={variant} className={buttonClassName}>
          Get {plan.name} plan
        </Button>
      </SignUpButton>
    );
  }

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const { checkout_url } = await createCheckoutSession(plan.slug);
      window.location.href = checkout_url;
    } catch {
      setError("Could not start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={buttonClassName}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? <Loader size="sm" className="py-0" /> : `Get ${plan.name} plan`}
      </Button>
      {error ? <p className="mt-2 text-[12px] text-red-400">{error}</p> : null}
    </>
  );
}

function CustomPlanRow() {
  return (
    <article className="mt-4 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-white/10 bg-[#161616] px-5 py-6 sm:px-8 sm:py-8 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4 sm:gap-5">
        <PlanIcon slug="business" />
        <div>
          <h2 className="text-[1.75rem] leading-none font-semibold tracking-tight text-white sm:text-[2rem]">
            Custom
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-snug text-zinc-400">
            Volume contracts, invoices, or a private setup. We will match
            credits to how you actually run inference.
          </p>
        </div>
      </div>
      <Button asChild className="h-12 w-full shrink-0 rounded-xl px-6 text-sm sm:w-auto">
        <a href="mailto:hello@tryorbit.cloud">Talk to us</a>
      </Button>
    </article>
  );
}
