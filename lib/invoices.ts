import { apiFetch, getStoredOrganizationId } from "@/lib/api";

export type Invoice = {
  payment_id: string;
  invoice_id: string;
  plan_name: string;
  plan_slug: string;
  amount: number;
  currency: string;
  status: string;
  status_label: string;
  refund_status: string;
  downloadable: boolean;
  subscription_id: string;
  created_at: string;
};

export type InvoiceList = {
  invoices: Invoice[];
  page: number;
  limit: number;
  total: number;
};

export const INVOICE_PAGE_SIZES = [25, 50, 75] as const;
export const DEFAULT_INVOICE_PAGE_SIZE = 25;

export function fetchInvoices(page = 1, limit = DEFAULT_INVOICE_PAGE_SIZE) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return apiFetch(`/billing/invoices?${params.toString()}`) as Promise<InvoiceList>;
}

const ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export function formatInvoiceAmount(amount: number, currency: string) {
  const code = (currency || "USD").toUpperCase();
  const digits = ZERO_DECIMAL.has(code) ? 0 : 2;
  const value = digits === 0 ? amount : amount / 100;
  try {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  } catch {
    return `${value.toFixed(digits)} ${code}`;
  }
}

export async function downloadInvoicePdf(paymentId: string) {
  const organizationId = getStoredOrganizationId();
  const response = await fetch(`/api/proxy/billing/invoices/${encodeURIComponent(paymentId)}/pdf`, {
    headers: {
      Accept: "application/pdf",
      ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
    },
  });
  if (!response.ok) {
    throw new Error("Could not download invoice");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `orbit-invoice-${paymentId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
