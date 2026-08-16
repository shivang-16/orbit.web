import { apiFetch } from "@/lib/api";

export type CheckoutSession = {
  checkout_url: string;
};

export function createCheckoutSession(planSlug: string) {
  return apiFetch("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug }),
  }) as Promise<CheckoutSession>;
}
