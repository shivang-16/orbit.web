"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { fetchCatalogue, type CatalogueModel, type CatalogueTagSummary } from "@/lib/catalogue";
import { vendorLabel } from "@/components/models/model-identity";
import { Loader } from "@/components/ui/loader";

import { CatalogueListView } from "./catalogue-list-view";
import { CatalogueTableView } from "./catalogue-table-view";
import { CatalogueToolbar, type SortKey, type ViewKey } from "./catalogue-toolbar";
import { ModalityTabs, type ModalityKey } from "./modality-tabs";

export function CatalogueList() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") ?? "";

  const [models, setModels] = useState<CatalogueModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [tag, setTag] = useState(initialTag);
  const [modality, setModality] = useState<ModalityKey>("all");
  const [view, setView] = useState<ViewKey>("list");

  useEffect(() => {
    let cancelled = false;
    fetchCatalogue()
      .then((data) => {
        if (!cancelled) setModels(data.models);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load models.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tagOptions: CatalogueTagSummary[] = useMemo(() => {
    if (!models) return [];
    const counts = new Map<string, number>();
    for (const model of models) {
      for (const value of model.tags) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([t, count]) => ({ tag: t, count }))
      .sort((a, b) => b.count - a.count);
  }, [models]);

  const modalityCounts = useMemo(() => {
    const counts: Record<ModalityKey, number> = { all: 0, text: 0, image: 0 };
    if (!models) return counts;
    counts.all = models.length;
    for (const model of models) {
      if (model.modalities.includes("text")) counts.text += 1;
      if (model.modalities.includes("image")) counts.image += 1;
    }
    return counts;
  }, [models]);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    const query = search.trim().toLowerCase();

    const result = models.filter((model) => {
      if (tag && !model.tags.includes(tag)) return false;
      if (modality !== "all" && !model.modalities.includes(modality)) return false;
      if (
        query &&
        !model.name.toLowerCase().includes(query) &&
        !vendorLabel(model.vendor).toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return a.name.localeCompare(b.name);
    });
  }, [models, search, tag, modality, sort]);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[17px] font-semibold tracking-tight text-white">Models</h1>
      </div>

      {error ? (
        <p className="mt-4 text-[13px] text-red-400">{error}</p>
      ) : models === null ? (
        <Loader />
      ) : (
        <div className="mt-4 space-y-4">
          <CatalogueToolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            tag={tag}
            onTagChange={setTag}
            tagOptions={tagOptions}
            view={view}
            onViewChange={setView}
          />

          <ModalityTabs active={modality} onChange={setModality} counts={modalityCounts} />

          <p className="text-[13px] text-zinc-400">
            {filteredModels.length} model{filteredModels.length === 1 ? "" : "s"}
          </p>

          {filteredModels.length > 0 ? (
            view === "list" ? (
              <CatalogueListView models={filteredModels} />
            ) : (
              <CatalogueTableView models={filteredModels} />
            )
          ) : (
            <p className="rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-8 text-center text-[13px] text-zinc-400">
              No models match your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
