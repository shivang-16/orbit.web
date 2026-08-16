import { UserButton } from "@clerk/nextjs";

import { LoadCreditsButton } from "@/components/billing/load-credits-button";

export function DashboardNavbar() {
  return (
    <header className="flex h-11 shrink-0 items-center justify-end gap-2.5 border-b border-white/10 bg-black px-5">
      <LoadCreditsButton />
        <UserButton/>
    </header>
  );
}
