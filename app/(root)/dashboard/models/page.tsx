import { Suspense } from "react";

import { CatalogueList } from "./_components/catalogue-list";

export default function ModelCataloguePage() {
  return (
    <Suspense fallback={<p className="px-6 py-10 text-sm text-zinc-500 lg:px-10">Loading models…</p>}>
      <CatalogueList />
    </Suspense>
  );
}
