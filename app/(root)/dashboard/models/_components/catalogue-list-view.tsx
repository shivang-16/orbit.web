import { InfoIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { ModalityBadgeList } from "@/components/models/modality-badge";
import { VendorLogo } from "@/components/models/vendor-logo";
import { vendorLabel } from "@/components/models/model-identity";
import { formatContext, type CatalogueModel } from "@/lib/catalogue";
import { tagDescription, tagLabel } from "@/lib/tags";

import { formatAddedDate, modelDescription } from "./model-description";

export function CatalogueListView({ models }: { models: CatalogueModel[] }) {
  return (
    <ul className="divide-y divide-white/5 rounded-xl border border-white/10 bg-[#0b0b0c]">
      {models.map((model) => {
        const primaryTag = model.tags[0];
        const secondaryTags = model.tags.slice(1, 3);

        return (
          <li key={model.id}>
            <Link
              href={`/dashboard/models/${model.id}`}
              className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-white/[0.03]"
            >
              <VendorLogo vendor={model.vendor} className="mt-0.5 size-6" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="truncate text-[13px] font-medium text-white">
                    {vendorLabel(model.vendor)}: {model.name}
                  </h3>
                  {primaryTag ? (
                    <span
                      title={tagDescription(primaryTag)}
                      className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] text-zinc-300"
                    >
                      {tagLabel(primaryTag)}
                    </span>
                  ) : null}
                  <span title={modelDescription(model)} className="shrink-0 text-zinc-600">
                    <InfoIcon size={12} />
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-[13px] text-zinc-500">
                  {modelDescription(model)}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                  <span>by {model.vendor}</span>
                  <Dot />
                  <span>Added {formatAddedDate(model.created_at)}</span>
                  <Dot />
                  <span>{formatContext(model.input_context_limit)} context</span>
                  <Dot />
                  <ModalityBadgeList modalities={model.modalities} size={16} />
                </div>
              </div>

              {secondaryTags.length > 0 ? (
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  {secondaryTags.map((value) => (
                    <span
                      key={value}
                      className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-400"
                    >
                      {tagLabel(value)}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Dot() {
  return <span className="text-zinc-700">·</span>;
}
