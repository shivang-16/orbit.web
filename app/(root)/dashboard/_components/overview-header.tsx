import Link from "next/link";

import { Button } from "@/components/ui/button";

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
      <Button asChild variant="outline" className="shrink-0">
        <Link href="/dashboard/models">Browse all {total} models</Link>
      </Button>
    </div>
  );
}
