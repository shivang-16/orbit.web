import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { AuthControls } from "@/components/layout/auth-controls";

const NAV_ITEMS = [
  { label: "Models", href: "/models", hasMenu: true },
  { label: "Use cases", href: "/use-cases", hasMenu: true },
  { label: "Platforms", href: "/platforms", hasMenu: true },
  { label: "Pricing", href: "/pricing", hasMenu: false },
  { label: "Docs", href: "/docs", hasMenu: true },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="relative flex h-16 items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="font-mono text-[15px] font-medium tracking-tight text-white"
        >
          orbit
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              {item.label}
              {item.hasMenu ? (
                <CaretDownIcon className="text-zinc-500" size={12} weight="bold" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
