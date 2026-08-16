"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "@phosphor-icons/react";

import { VendorLogo } from "@/components/models/vendor-logo";
import { vendorLabel } from "@/components/models/model-identity";
import { ModalityBadge, ModalityBadgeList } from "@/components/models/modality-badge";
import { ProviderLogo } from "@/components/models/provider-logo";
import { TryModelDrawer } from "@/components/models/try-model-drawer";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  fetchCatalogueModel,
  formatContext,
  formatPerMillion,
  type CatalogueModelDetail,
} from "@/lib/catalogue";
import { providerLabel } from "@/lib/providers";
import { slugify } from "@/lib/slug";
import { tagDescription, tagLabel } from "@/lib/tags";

import { formatAddedDate, modelDescription } from "../_components/model-description";

export default function ModelDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [model, setModel] = useState<CatalogueModelDetail | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setModel(undefined);
    setError(null);
    fetchCatalogueModel(id)
      .then((data) => {
        if (!cancelled) setModel(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load this model.");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
      <Link
        href="/dashboard/models"
        className="inline-flex items-center gap-1.5 text-[13px] text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeftIcon size={14} />
        Back to models
      </Link>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : model === undefined ? (
        <Loader />
      ) : model === null ? (
        <p className="mt-6 text-[13px] text-zinc-400">This model could not be found.</p>
      ) : (
        <ModelDetail model={model} />
      )}
    </div>
  );
}

function ModelDetail({ model }: { model: CatalogueModelDetail }) {
  const [tryOpen, setTryOpen] = useState(false);

  return (
    <div className="mt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <VendorLogo vendor={model.vendor} className="size-10" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-white">{model.name}</h1>
            <p className="mt-0.5 text-[13px] text-zinc-400">
              {model.vendor}/{slugify(model.name)}
            </p>
          </div>
        </div>

        <Button onClick={() => setTryOpen(true)} className="shrink-0">
          <PlayIcon size={13} weight="fill" />
          Try this model
        </Button>
      </div>

      <TryModelDrawer
        open={tryOpen}
        onOpenChange={setTryOpen}
        modelId={model.id}
        modelName={model.name}
      />

      <p className="mt-4 w-full text-[15px] leading-relaxed text-zinc-300">
        {modelDescription(model)}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetaCard label="Modalities">
          <span className="flex items-center gap-1.5">
            <ModalityBadgeList modalities={model.modalities} size={20} />
            <ArrowRightIcon size={11} className="text-zinc-500" />
            <ModalityBadge modality="text" size={20} />
          </span>
        </MetaCard>
        <MetaCard label="Context">{`${formatContext(model.input_context_limit)} tokens`}</MetaCard>
        <MetaCard label="Vendor">{vendorLabel(model.vendor)}</MetaCard>
        <MetaCard label="Added">{formatAddedDate(model.created_at)}</MetaCard>
      </div>

      {model.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {model.tags.map((value) => (
            <span
              key={value}
              title={tagDescription(value)}
              className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-300"
            >
              {tagLabel(value)}
            </span>
          ))}
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-[13px] font-medium text-white">Providers</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-[#0b0b0c]">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-400">
                <th className="px-4 py-2.5 font-normal">Provider</th>
                <th className="px-4 py-2.5 font-normal">Model ID</th>
                <th className="px-4 py-2.5 text-right font-normal">Context</th>
                <th className="px-4 py-2.5 text-right font-normal">Modalities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-white">
                    <ProviderLogo provider={model.provider} />
                    {providerLabel(model.provider)}
                  </span>
                </td>
                <td className="max-w-[260px] truncate px-4 py-3 font-mono text-xs text-zinc-400">
                  {model.model_id}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                  {formatContext(model.input_context_limit)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ModalityBadgeList modalities={model.modalities} className="justify-end" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-[13px] font-medium text-white">Pricing</h2>
        {model.pricing ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-[#0b0b0c]">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-xs text-zinc-400">
                  <th className="px-4 py-2.5 font-normal">Provider</th>
                  <th className="px-4 py-2.5 text-right font-normal">Input / 1M tokens</th>
                  <th className="px-4 py-2.5 text-right font-normal">Output / 1M tokens</th>
                  <th className="px-4 py-2.5 text-right font-normal">Currency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-white">
                      <ProviderLogo provider={model.provider} />
                      {providerLabel(model.provider)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                    {formatPerMillion(model.pricing.vendor_input_per_million_micros)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                    {formatPerMillion(model.pricing.vendor_output_per_million_micros)}
                  </td>
                  <td className="px-4 py-3 text-right uppercase text-zinc-400">
                    {model.pricing.currency || "USD"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-8 text-center text-[13px] text-zinc-400">
            No pricing for this model yet.
          </div>
        )}
      </section>
    </div>
  );
}

function MetaCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0b0b0c] px-3 py-2.5">
      <p className="text-[11px] tracking-wide text-zinc-400 uppercase">{label}</p>
      <div className="mt-1 truncate text-[13px] text-white">{children}</div>
    </div>
  );
}
