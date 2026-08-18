import Link from "next/link";

import { ModalityBadgeList } from "@/components/models/modality-badge";
import { ModelIdentity } from "@/components/models/model-identity";
import { formatContext, type CatalogueModel } from "@/lib/catalogue";

export function ModelTable({
  title,
  description,
  tag,
  models,
}: {
  title: string;
  description: string;
  tag: string;
  models: CatalogueModel[];
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0b0b0c] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[13px] text-white">{title}</h2>
          <p className="mt-1 text-xs text-zinc-400">{description}</p>
        </div>
        <Link
          href={`/models?tag=${tag}`}
          className="shrink-0 text-[13px] text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          View more
        </Link>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_4rem_5.5rem] items-center gap-3 border-b border-white/5 pb-2 text-xs text-zinc-400">
          <span />
          <span>Model</span>
          <span className="text-right">Context</span>
          <span className="text-right">Modalities</span>
        </div>
        <ol>
          {models.map((model, index) => (
            <li key={model.id} className="border-b border-white/5 last:border-b-0">
              <Link
                href={`/models/${model.id}`}
                className="grid grid-cols-[1.25rem_minmax(0,1fr)_4rem_5.5rem] items-center gap-3 py-3 transition-colors hover:bg-white/[0.03]"
              >
                <span className="text-[13px] text-zinc-400">{index + 1}</span>
                <ModelIdentity name={model.name} vendor={model.vendor} showVendor={false} />
                <span className="text-right text-[13px] tabular-nums text-zinc-300">
                  {formatContext(model.input_context_limit)}
                </span>
                <span className="flex justify-end">
                  <ModalityBadgeList modalities={model.modalities} size={16} />
                </span>
              </Link>
            </li>
          ))}
          {models.length === 0 ? (
            <li className="py-6 text-[13px] text-zinc-400">Nothing tagged yet.</li>
          ) : null}
        </ol>
      </div>
    </section>
  );
}
