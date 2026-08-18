import { InfoIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { ModelIdentity } from "@/components/models/model-identity";
import { formatContext, type CatalogueHighlight } from "@/lib/catalogue";
import { tagLabel } from "@/lib/tags";

const CARD_TITLE: Record<string, string> = {
  flagship: "Top of the catalogue",
  "open-source": "Smartest open model",
  "cost-efficient": "Best value",
  fast: "Fastest",
  coding: "Best for coding",
};

export function HighlightCards({ highlights }: { highlights: CatalogueHighlight[] }) {
  const cards = Array.isArray(highlights) ? highlights : [];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((highlight, index) => (
        <HighlightCard
          key={highlight.tag}
          highlight={highlight}
          wide={index === cards.length - 1 && cards.length % 2 === 1}
        />
      ))}
    </div>
  );
}

function HighlightCard({
  highlight,
  wide,
}: {
  highlight: CatalogueHighlight;
  wide: boolean;
}) {
  const { tag, model, count } = highlight;

  return (
    <article
      className={`rounded-xl border border-white/10 bg-[#0b0b0c] p-4 ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
        {CARD_TITLE[tag] ?? tagLabel(tag)}
        <InfoIcon size={12} />
      </div>

      {model ? (
        <>
          <Link href={`/models/${model.id}`} className="mt-3 block hover:underline">
            <ModelIdentity name={model.name} vendor={model.vendor} showVendor={false} />
          </Link>
          <p className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[26px] leading-none font-semibold tracking-tight text-white">
              {count}
            </span>
            <span className="text-xs text-zinc-400">
              {count === 1 ? "model" : "models"} tagged
            </span>
          </p>
          <Link
            href={`/models?tag=${tag}`}
            className="mt-2 inline-block text-xs text-zinc-400 transition-colors hover:text-zinc-300"
          >
            {formatContext(model.input_context_limit)} context · view {tagLabel(tag).toLowerCase()}
          </Link>
        </>
      ) : (
        <p className="mt-4 text-[13px] text-zinc-400">Nothing tagged yet.</p>
      )}
    </article>
  );
}
