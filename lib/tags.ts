export type TagMeta = {
  label: string;
  description: string;
};

export const TAG_META: Record<string, TagMeta> = {
  flagship: {
    label: "Flagship",
    description: "Most capable model in each lab's line-up.",
  },
  reasoning: {
    label: "Reasoning",
    description: "Strong at analysis and multi-step problems.",
  },
  thinking: {
    label: "Thinking",
    description: "Reasons at length before it answers.",
  },
  fast: {
    label: "Fast",
    description: "Tuned for low latency responses.",
  },
  lightweight: {
    label: "Lightweight",
    description: "Small models for high-volume simple work.",
  },
  balanced: {
    label: "Balanced",
    description: "A middle ground of quality, cost and speed.",
  },
  coding: {
    label: "Coding",
    description: "Built for writing and reviewing code.",
  },
  "creative-writing": {
    label: "Creative writing",
    description: "Long-form prose, story and roleplay.",
  },
  "open-source": {
    label: "Open source",
    description: "Open weights you can host yourself.",
  },
  safety: {
    label: "Safety",
    description: "Moderation and guardrail workloads.",
  },
  agentic: {
    label: "Agentic",
    description: "Tool use and multi-step agent runs.",
  },
  "long-context": {
    label: "Long context",
    description: "Built around very large context windows.",
  },
  "cost-efficient": {
    label: "Cost efficient",
    description: "The cheapest capability per token.",
  },
};

export function tagLabel(tag: string) {
  return TAG_META[tag]?.label ?? tag;
}

export function tagDescription(tag: string) {
  return TAG_META[tag]?.description ?? "";
}
