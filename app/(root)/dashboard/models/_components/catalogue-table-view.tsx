import Link from "next/link";

import { ModalityBadgeList } from "@/components/models/modality-badge";
import { ModelIdentity } from "@/components/models/model-identity";
import { formatContext, type CatalogueModel } from "@/lib/catalogue";
import { tagLabel } from "@/lib/tags";

import { formatAddedDate } from "./model-description";

export function CatalogueTableView({ models }: { models: CatalogueModel[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0b0c]">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-white/10 text-xs text-zinc-500">
            <th className="px-4 py-2.5 font-normal">Model</th>
            <th className="px-4 py-2.5 font-normal">Tags</th>
            <th className="px-4 py-2.5 font-normal">Modalities</th>
            <th className="px-4 py-2.5 text-right font-normal">Context</th>
            <th className="px-4 py-2.5 text-right font-normal">Added</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.03]">
              <td className="px-4 py-3">
                <Link href={`/dashboard/models/${model.id}`} className="block">
                  <ModelIdentity name={model.name} vendor={model.vendor} />
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {model.tags.map((value) => (
                    <span
                      key={value}
                      className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-400"
                    >
                      {tagLabel(value)}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <ModalityBadgeList modalities={model.modalities} size={18} />
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-400">
                {formatContext(model.input_context_limit)}
              </td>
              <td className="px-4 py-3 text-right text-zinc-500">
                {formatAddedDate(model.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
