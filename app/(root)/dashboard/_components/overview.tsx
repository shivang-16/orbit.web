"use client";

import { useEffect, useState } from "react";

import { Loader } from "@/components/ui/loader";
import { fetchCatalogueOverview, type CatalogueOverview } from "@/lib/catalogue";

import { FrontierCard } from "./frontier-card";
import { HighlightCards } from "./highlight-cards";
import { ModelTable } from "./model-table";
import { OverviewHeader } from "./overview-header";
import { TagBrowser } from "./tag-browser";

export function Overview() {
  const [data, setData] = useState<CatalogueOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogueOverview()
      .then((overview) => {
        if (!cancelled) setData(overview);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load catalogue overview.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <Shell><p className="text-[13px] text-red-400">{error}</p></Shell>;
  }

  if (!data) {
    return (
      <Shell>
        <Loader />
      </Shell>
    );
  }

  return (
    <Shell>
      <OverviewHeader total={data.total} />

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)]">
        <FrontierCard models={data.frontier ?? []} />
        <HighlightCards highlights={data.highlights ?? []} />
      </div>

      <div className="mt-8">
        <TagBrowser tags={data.tags} />
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        <ModelTable
          title="Value leaders"
          description="Tagged cost efficient — cheapest capability per token."
          tag="cost-efficient"
          models={data.value_leaders}
        />
        <ModelTable
          title="Fastest models"
          description="Tagged fast — tuned for low latency."
          tag="fast"
          models={data.fastest}
        />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">{children}</div>
  );
}
