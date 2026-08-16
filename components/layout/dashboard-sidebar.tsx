"use client";

import { useEffect, useState } from "react";
import {
  BookOpenTextIcon,
  CaretDownIcon,
  CreditCardIcon,
  KeyIcon,
  SquaresFourIcon,
  StackIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";

import { OrgSwitcher } from "@/components/layout/org-switcher";
import { cn } from "@/lib/utils";

type NavLeaf = { label: string; href: string; icon: Icon };
type NavGroup = {
  label: string;
  icon: Icon;
  children: { label: string; href: string }[];
};

const NAV_ITEMS: Array<NavLeaf | NavGroup> = [
  { label: "Overview", href: "/dashboard", icon: SquaresFourIcon },
  { label: "Model Catalogue", href: "/dashboard/models", icon: StackIcon },
  { label: "API Keys", href: "/dashboard/api-keys", icon: KeyIcon },
  {
    label: "Billing",
    icon: CreditCardIcon,
    children: [
      { label: "Credits", href: "/dashboard/billing/credits" },
      { label: "Invoices", href: "/dashboard/billing/invoices" },
    ],
  },
  { label: "Documentation", href: "/dashboard/docs", icon: BookOpenTextIcon },
];

function isGroup(item: NavLeaf | NavGroup): item is NavGroup {
  return "children" in item;
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-black px-4 py-5">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-1.5 font-mono text-[15px] font-medium tracking-tight text-white"
      >
        <img
          src="/assets/orbit.png"
          alt="Orbit"
          className="size-5 object-contain rounded-sm invert"
        />
        orbit
      </Link>

      <div className="mt-6">
        <OrgSwitcher />
      </div>

      <nav className="mt-6 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) =>
          isGroup(item) ? (
            <BillingNav key={item.label} item={item} pathname={pathname} />
          ) : (
            <LeafLink key={item.href} item={item} pathname={pathname} />
          )
        )}
      </nav>
    </aside>
  );
}

function LeafLink({ item, pathname }: { item: NavLeaf; pathname: string }) {
  const active = pathname === item.href;
  const ItemIcon = item.icon;
  return (
    <Link
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
}

function BillingNav({ item, pathname }: { item: NavGroup; pathname: string }) {
  const childActive = item.children.some((child) => pathname === child.href);
  const [open, setOpen] = useState(childActive);
  const ItemIcon = item.icon;

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
          childActive
            ? "text-white"
            : "text-zinc-300 hover:bg-white/5 hover:text-white"
        )}
      >
        <ItemIcon size={16} weight={childActive ? "fill" : "regular"} />
        <span className="flex-1 text-left">{item.label}</span>
        <CaretDownIcon
          size={12}
          className={cn("text-zinc-500 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="mt-0.5 ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-2">
          {item.children.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
