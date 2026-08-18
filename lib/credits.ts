import { apiFetch } from "@/lib/api";

export type OrganizationCredits = {
  organization_id: string;
  organization_name: string;
  credits_granted_micros: number;
  credits_used_micros: number;
  credits_remaining_micros: number;
};

export type CreditHistoryEntry = {
  id: string;
  entry_type: string;
  type_label: string;
  description: string;
  amount_micros: number;
  idempotency_key: string;
  created_at: string;
};

export type CreditHistory = {
  entries: CreditHistoryEntry[];
  total: number;
};

export function fetchOrganizationCredits() {
  return apiFetch("/billing/credits") as Promise<OrganizationCredits>;
}

export function fetchCreditHistory() {
  return apiFetch("/billing/credits/history") as Promise<CreditHistory>;
}

export function formatCreditDollars(micros: number) {
  // Header / summary balances stay at cents. Truncate leftover micros so
  // $99.996988 displays as $99.99, not rounded up to $100.00.
  const cents = Math.trunc(micros / 10_000) / 100;
  return cents.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// History rows keep micros-level precision so a $0.000090 usage line
// does not display as $0.00. Balances (header, summary cards) stay at
// two decimal places.
export function formatSignedCreditDollars(micros: number) {
  const absMicros = Math.abs(Math.trunc(micros));
  const fractionDigits = absMicros % 10_000 === 0 ? 2 : 6;
  const formatted = formatDollars(Math.abs(micros), fractionDigits);
  if (micros > 0) return `+${formatted}`;
  if (micros < 0) return `-${formatted}`;
  return formatted;
}

function formatDollars(micros: number, fractionDigits: number) {
  return (micros / 1_000_000).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatCreditDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
