"use client";

import { BookOpenTextIcon, KeyIcon, SquaresFourIcon, StackIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";

import { OrgSwitcher } from "@/components/layout/org-switcher";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; href: string; icon: Icon }[] = [
  { label: "Overview", href: "/dashboard", icon: SquaresFourIcon },
  { label: "Model Catalogue", href: "/dashboard/models", icon: StackIcon },
  { label: "API Keys", href: "/dashboard/api-keys", icon: KeyIcon },
  { label: "Documentation", href: "/dashboard/docs", icon: BookOpenTextIcon },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-black px-4 py-5">
      <Link
        href="/"
        className="flex items-center gap-2 px-1.5 font-mono text-[15px] font-medium tracking-tight text-white"
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-white text-xs font-bold text-black">
          O
        </span>
        orbit
      </Link>

      <div className="mt-6">
        <OrgSwitcher />
      </div>

      <nav className="mt-6 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <ItemIcon size={16} weight={active ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
