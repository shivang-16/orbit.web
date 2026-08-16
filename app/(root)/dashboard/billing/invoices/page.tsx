"use client";

import { useOrg } from "@/components/org/org-context";

export default function InvoicesPage() {
  const { activeOrganization } = useOrg();
  const orgName = activeOrganization?.name ?? "your organization";

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
      <p className="text-[12px] text-zinc-500">Invoices</p>
      <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white">Invoices</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        Payment invoices for {orgName}
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-10 text-center text-[13px] text-zinc-400">
        No invoices yet. They will appear here after a plan purchase.
      </div>
    </div>
  );
}
