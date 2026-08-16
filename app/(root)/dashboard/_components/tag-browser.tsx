import { TagIcon } from "@phosphor-icons/react";
import Link from "next/link";

import type { CatalogueTagSummary } from "@/lib/catalogue";
import { tagDescription, tagLabel } from "@/lib/tags";

export function TagBrowser({ tags }: { tags: CatalogueTagSummary[] }) {
  const featured = (Array.isArray(tags) ? tags : []).slice(0, 5);

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[13px] text-zinc-300">Browse by tag</h2>
        <Link
          href="/dashboard/models"
          className="text-[13px] text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          View all tags
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {featured.map((item) => (
          <Link
            key={item.tag}
            href={`/dashboard/models?tag=${item.tag}`}
            className="rounded-xl border border-white/10 bg-[#0b0b0c] p-4 transition-colors hover:border-white/20"
          >
            <div className="flex items-center gap-1.5 text-[13px] text-white">
              <TagIcon size={13} className="text-zinc-400" />
              {tagLabel(item.tag)}
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
              {tagDescription(item.tag)}
            </p>
            <p className="mt-3 text-xs text-zinc-500">{item.count} models</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
