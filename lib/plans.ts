import { apiFetch } from "@/lib/api";

export type Plan = {
  id: string;
  slug: string;
  name: string;
  dodo_product_id: string;
  price_micros: number;
  credits_micros: number;
  tagline: string;
  features: string[];
  includes_from: string;
  highlighted: boolean;
  sort_order: number;
  is_active: boolean;
};

export type PlanList = {
  plans: Plan[];
  total: number;
};

export function fetchPlans() {
  return apiFetch("/plans") as Promise<PlanList>;
}

export function formatPlanDollars(micros: number) {
  return Math.round(micros / 1_000_000);
}
