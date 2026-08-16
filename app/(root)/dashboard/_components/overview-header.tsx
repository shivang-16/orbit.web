import Link from "next/link";

export function OverviewHeader({ total }: { total: number }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[17px] font-semibold tracking-tight text-white">
          Discover models
        </h1>
        <p className="mt-1 text-[13px] text-zinc-400">
          Starting points from your catalogue, grouped by the tags you assigned.
        </p>
      </div>
      <Link
        href="/dashboard/models"
        className="shrink-0 rounded-md border border-white/10 bg-zinc-950 px-3 py-1.5 text-[13px] text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
      >
        Browse all {total} models
      </Link>
    </div>
  );
}
