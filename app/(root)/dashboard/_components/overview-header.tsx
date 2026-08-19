import Link from "next/link";

import { Button } from "@/components/ui/button";

export function OverviewHeader({ total }: { total: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 text-[17px] font-semibold tracking-tight text-white">
          Discover models
        </h1>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/models">Browse all {total} models</Link>
        </Button>
      </div>
      <p className="mt-1 text-[13px] text-zinc-400">
        Starting points from your catalogue, grouped by the tags you assigned.
      </p>
    </div>
  );
}
