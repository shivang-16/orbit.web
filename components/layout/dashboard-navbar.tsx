"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import { UserButton } from "@clerk/nextjs";

import { LoadCreditsButton } from "@/components/billing/load-credits-button";

export function DashboardNavbar({
  menuOpen,
  onMenuClick,
}: {
  menuOpen: boolean;
  onMenuClick: () => void;
}) {
  return (
    <header className="relative z-50 flex h-11 shrink-0 items-center gap-2 border-b border-white/10 bg-black px-3 sm:px-5">
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={onMenuClick}
        className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white lg:hidden"
      >
        {menuOpen ? <XIcon size={16} /> : <ListIcon size={16} />}
      </button>

      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-2.5">
        <LoadCreditsButton />
        <UserButton />
      </div>
    </header>
  );
}
