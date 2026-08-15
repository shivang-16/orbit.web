import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sun } from "lucide-react";

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
              className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {item.label}
              {item.hasMenu ? (
                <ChevronDown className="size-3 text-zinc-600" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex size-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <Sun className="size-3.5" />
          </button>

          <Link
            href="/sign-up"
            className="group flex h-8 items-center gap-2 rounded-full bg-white pr-1 pl-3.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Start for free
            <span className="flex size-6 items-center justify-center rounded-full bg-black text-white">
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
