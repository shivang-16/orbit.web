import { apiFetch } from "@/lib/api";

export type CatalogueModel = {
  id: string;
  name: string;
  vendor: string;
  provider: string;
  model_id: string;
  input_context_limit: number;
  sort_order: number;
  tags: string[];
  modalities: string[];
  is_active: boolean;
  created_at: string;
};

export type CatalogueHighlight = {
  tag: string;
  model: CatalogueModel | null;
  count: number;
};

export type CatalogueTagSummary = {
  tag: string;
  count: number;
};

export type CatalogueOverview = {
  total: number;
  frontier: CatalogueModel[];
  highlights: CatalogueHighlight[];
  value_leaders: CatalogueModel[];
  fastest: CatalogueModel[];
  tags: CatalogueTagSummary[];
};

export type CatalogueList = {
  models: CatalogueModel[];
  total: number;
};

const HIGHLIGHT_TAGS = [
  "flagship",
  "open-source",
  "cost-efficient",
  "fast",
  "coding",
] as const;

const LEGACY_HIGHLIGHT_KEYS: Record<string, string> = {
  flagship: "flagship",
  open_source: "open-source",
  cost_efficient: "cost-efficient",
  fast: "fast",
  coding: "coding",
};

export async function fetchCatalogueOverview() {
  const raw = (await apiFetch("/catalogue/overview")) as Record<string, unknown>;
  return normalizeOverview(raw);
}

function normalizeOverview(raw: Record<string, unknown>): CatalogueOverview {
  const models = (raw.frontier as CatalogueModel[] | undefined) ?? [];
  return {
    total: typeof raw.total === "number" ? raw.total : 0,
    frontier: Array.isArray(raw.frontier) ? raw.frontier : [],
    highlights: normalizeHighlights(raw.highlights, models),
    value_leaders: Array.isArray(raw.value_leaders) ? raw.value_leaders : [],
    fastest: Array.isArray(raw.fastest) ? raw.fastest : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

function normalizeHighlights(
  value: unknown,
  frontier: CatalogueModel[]
): CatalogueHighlight[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, CatalogueModel | null>;
    return Object.entries(LEGACY_HIGHLIGHT_KEYS).map(([key, tag]) => {
      const model = record[key] ?? null;
      return { tag, model, count: model ? 1 : 0 };
    });
  }

  return HIGHLIGHT_TAGS.map((tag) => ({
    tag,
    model: tag === "flagship" ? frontier[0] ?? null : null,
    count: 0,
  }));
}

export function fetchCatalogue(tag?: string) {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  return apiFetch(`/catalogue${query}`) as Promise<CatalogueList>;
}

export async function fetchCatalogueModel(id: string) {
  const raw = (await apiFetch(`/catalogue/${encodeURIComponent(id)}`)) as { model: CatalogueModel };
  return raw.model;
}

export function formatContext(limit: number) {
  return `${Math.round(limit / 1000)}k`;
}
