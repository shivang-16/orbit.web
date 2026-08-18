import { formatContext, type CatalogueModel } from "@/lib/catalogue";
import { providerLabel } from "@/lib/providers";
import { tagDescription } from "@/lib/tags";
import { vendorLabel } from "@/components/models/model-identity";

export function modelDescription(model: CatalogueModel) {
  const modalityPhrase = model.modalities.join(" and ") || "text";
  const sentences: string[] = [
    `${model.name} is ${vendorLabel(model.vendor)}'s ${modalityPhrase} model, hosted on Orbit through ${providerLabel(model.provider)}.`,
  ];

  const traits = model.tags.map(traitPhrase).filter(Boolean);
  if (traits.length > 0) {
    sentences.push(`It's ${joinWithAnd(traits)}.`);
  }

  sentences.push(
    `With a ${formatContext(model.input_context_limit)}-token context window, it can take in long conversations, documents or codebases in a single request.`
  );

  return sentences.join(" ");
}

// Phrases tuned to read naturally after "It's ...", since TAG_META descriptions
// are written as standalone sentences elsewhere (tooltips, tag browser).
const TRAIT_PHRASE_OVERRIDES: Record<string, string> = {
  flagship: "the most capable model in its lab's line-up",
  lightweight: "built for high-volume, low-cost work",
};

function traitPhrase(tag: string) {
  if (TRAIT_PHRASE_OVERRIDES[tag]) return TRAIT_PHRASE_OVERRIDES[tag];
  const description = tagDescription(tag);
  if (!description) return "";
  return lowercaseFirst(description.replace(/\.$/, ""));
}

function lowercaseFirst(value: string) {
  return value.length > 0 ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function joinWithAnd(items: string[]) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function formatAddedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
