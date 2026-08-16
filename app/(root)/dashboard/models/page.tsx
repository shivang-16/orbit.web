import { Suspense } from "react";

import { Loader } from "@/components/ui/loader";

import { CatalogueList } from "./_components/catalogue-list";

export default function ModelCataloguePage() {
  return (
    <Suspense fallback={<Loader />}>
      <CatalogueList />
    </Suspense>
  );
}
