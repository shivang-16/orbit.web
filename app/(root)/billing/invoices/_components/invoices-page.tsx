"use client";

import { useEffect, useState } from "react";

import { useOrg } from "@/components/org/org-context";
import { Select } from "@/components/ui/select";
import { Loader } from "@/components/ui/loader";
import { formatCreditDate } from "@/lib/credits";
import {
  DEFAULT_INVOICE_PAGE_SIZE,
  INVOICE_PAGE_SIZES,
  downloadInvoicePdf,
  fetchInvoices,
  formatInvoiceAmount,
  type Invoice,
  type InvoiceList,
} from "@/lib/invoices";
import { cn } from "@/lib/utils";

export function InvoicesPage() {
  const { activeOrganization } = useOrg();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_INVOICE_PAGE_SIZE);
  const [data, setData] = useState<InvoiceList | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrganization) {
      setData(null);
      return;
    }

    let cancelled = false;
    setData(null);
    setError(null);

    fetchInvoices(page, limit)
      .then((next) => {
        if (!cancelled) setData(next);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load invoices.");
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrganization, page, limit]);

  function onLimitChange(next: number) {
    setLimit(next);
    setPage(1);
  }

  const orgName = activeOrganization?.name ?? "your organization";

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[12px] text-zinc-500">Invoices</p>
      <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white">Invoices</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        Payment invoices for {orgName}
      </p>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : !data ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : (
        <InvoiceTable
          invoices={data.invoices}
          page={data.page}
          limit={data.limit}
          total={data.total}
          onPageChange={setPage}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}

function InvoiceTable({
  invoices,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: {
  invoices: Invoice[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-[14px] font-medium text-white">Invoice history</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/10 text-xs text-zinc-400">
              <th className="px-4 py-2.5 font-normal">Date</th>
              <th className="px-4 py-2.5 font-normal">Invoice</th>
              <th className="px-4 py-2.5 font-normal">Plan</th>
              <th className="px-4 py-2.5 text-right font-normal">Amount</th>
              <th className="px-4 py-2.5 font-normal">Status</th>
              <th className="px-4 py-2.5 text-right font-normal">PDF</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.payment_id} className="border-b border-white/5 last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                  {formatCreditDate(invoice.created_at)}
                </td>
                <td className="px-4 py-3 font-mono text-[12px] text-zinc-300">
                  {invoice.invoice_id}
                </td>
                <td className="max-w-xs px-4 py-3 text-zinc-300">
                  <span className="line-clamp-2">{invoice.plan_name || "Plan purchase"}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-200">
                  {formatInvoiceAmount(invoice.amount, invoice.currency)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={invoice.status_label} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <DownloadButton invoice={invoice} />
                </td>
              </tr>
            ))}
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                  No invoices yet. They will appear here after a plan purchase.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <InvoicePagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </section>
  );
}

function StatusBadge({ label }: { label: string }) {
  const tone =
    label === "Paid"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : label === "Refunded" || label === "Partially refunded"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
        : label === "Failed" || label === "Cancelled"
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-white/10 bg-white/5 text-zinc-300";

  return (
    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[12px]", tone)}>
      {label}
    </span>
  );
}

function DownloadButton({ invoice }: { invoice: Invoice }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  if (!invoice.downloadable) {
    return <span className="text-zinc-600">—</span>;
  }

  async function onDownload() {
    setBusy(true);
    setError(false);
    try {
      await downloadInvoicePdf(invoice.payment_id);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={busy}
      className="rounded-lg border border-white/10 px-2.5 py-1 text-[12px] text-zinc-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-wait disabled:opacity-60"
    >
      {busy ? "…" : error ? "Retry" : "Download"}
    </button>
  );
}

function InvoicePagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-[13px] text-zinc-400">
        <Select
          variant="compact"
          value={limit}
          onValueChange={onLimitChange}
          ariaLabel="Rows per page"
          displayValue={`Rows: ${limit}`}
          options={INVOICE_PAGE_SIZES.map((size) => ({
            value: size,
            label: String(size),
          }))}
        />
        <span>
          {total === 0 ? "Showing 0 of 0" : `Showing ${from}-${to} of ${total}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={atStart}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "rounded-md border border-white/10 px-2.5 py-1 text-[13px] transition-colors",
            atStart
              ? "cursor-not-allowed text-zinc-600"
              : "text-zinc-200 hover:bg-white/5 hover:text-white"
          )}
        >
          Prev
        </button>
        <span className="min-w-12 text-center text-[13px] text-zinc-300">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={atEnd}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "rounded-md border border-white/10 px-2.5 py-1 text-[13px] transition-colors",
            atEnd
              ? "cursor-not-allowed text-zinc-600"
              : "text-zinc-200 hover:bg-white/5 hover:text-white"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
