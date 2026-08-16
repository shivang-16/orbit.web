import Link from "next/link";

import { ModelIdentity, vendorLabel } from "@/components/models/model-identity";
import { formatContext, type CatalogueModel } from "@/lib/catalogue";

export function FrontierCard({ models }: { models: CatalogueModel[] }) {
  const lead = models[0];

  return (
    <section className="rounded-xl border border-white/10 bg-[#0b0b0c] p-5">
      <p className="text-[13px] text-zinc-400">Today&apos;s frontier</p>
      <h2 className="mt-2.5 text-[21px] leading-tight font-semibold tracking-tight text-white">
        {lead
          ? `${lead.name} takes the frontier lead`
          : "No flagship models tagged yet"}
      </h2>
      <p className="mt-2.5 text-[13px] text-zinc-400">
        {lead
          ? `${vendorLabel(lead.vendor)} leads your flagship tag, ordered newest first within each lab.`
          : "Tag a model as flagship to feature it here."}
      </p>

      <div className="mt-7">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs text-zinc-400">
          <span>Model</span>
          <span>Context</span>
        </div>
        <ol>
          {models.map((model, index) => (
            <li key={model.id} className="border-b border-white/5 last:border-b-0">
              <Link
                href={`/dashboard/models/${model.id}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-white/[0.03]"
              >
                <span className="w-3 text-[13px] text-zinc-400">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <ModelIdentity name={model.name} vendor={model.vendor} />
                </div>
                <span className="text-[13px] tabular-nums text-zinc-300">
                  {formatContext(model.input_context_limit)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
