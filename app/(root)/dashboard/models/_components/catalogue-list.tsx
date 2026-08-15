"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ModelIdentity } from "@/components/models/model-identity";
import { fetchCatalogue, formatContext, type CatalogueModel } from "@/lib/catalogue";
import { tagLabel } from "@/lib/tags";

export function CatalogueList() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const [models, setModels] = useState<CatalogueModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setModels(null);
    fetchCatalogue(tag || undefined)
      .then((data) => {
        if (!cancelled) setModels(data.models);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load models.");
      });
    return () => {
      cancelled = true;
    };
  }, [tag]);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
      <h1 className="text-[17px] font-semibold tracking-tight text-white">
        {tag ? `Models tagged ${tagLabel(tag).toLowerCase()}` : "Model Catalogue"}
      </h1>
      <p className="mt-1 text-[13px] text-zinc-500">
        {error
          ? error
          : models === null
            ? "Loading models…"
            : `${models.length} model${models.length === 1 ? "" : "s"} in your catalogue.`}
      </p>

      {models && models.length > 0 ? (
        <ul className="mt-6 rounded-xl border border-white/10 bg-[#0b0b0c]">
          {models.map((model) => (
            <li
              key={model.id}
              className="flex items-center gap-4 border-b border-white/5 px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <ModelIdentity name={model.name} vendor={model.vendor} />
              </div>

              <div className="hidden max-w-[22rem] flex-wrap justify-end gap-1 sm:flex">
                {model.tags.map((value) => (
                  <span
                    key={value}
                    className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-400"
                  >
                    {tagLabel(value)}
                  </span>
                ))}
              </div>

              <span className="w-12 text-right text-[13px] tabular-nums text-zinc-400">
                {formatContext(model.input_context_limit)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
