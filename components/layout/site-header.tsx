import Link from "next/link";

import { AuthControls } from "@/components/layout/auth-controls";
import { ClaudeCodeNavButton, LandingSectionLink } from "@/components/layout/claude-code-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

const NAV_ITEMS = [
  { label: "Models", href: "/models" },
  { label: "Use cases", href: "/#use-cases", sectionId: "use-cases" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

const navClassName =
  "text-sm text-zinc-300 transition-colors hover:text-white";

export function SiteHeader() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/6 bg-black/70 backdrop-blur-md backdrop-saturate-150">
      <div className="relative flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-10 xl:px-12">
        <Link
          href="/"
          className="font-mono text-[15px] font-medium tracking-tight text-white"
        >
          orbit
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) =>
            item.sectionId ? (
              <LandingSectionLink
                key={item.label}
                id={item.sectionId}
                className={navClassName}
              >
                {item.label}
              </LandingSectionLink>
            ) : (
              <Link key={item.label} href={item.href} className={navClassName}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="https://discord.gg/JHsxTjPUBc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Orbit on Discord"
            className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09A.08.08 0 0 0 9 4c-1.51.26-2.95.71-4.27 1.33A.07.07 0 0 0 4.67 5.4C1.94 9.46 1.18 13.4 1.56 17.3a.08.08 0 0 0 .03.05c1.8 1.32 3.54 2.12 5.25 2.65a.08.08 0 0 0 .09-.03c.4-.55.76-1.13 1.07-1.74a.08.08 0 0 0-.04-.1 10.7 10.7 0 0 1-1.54-.73.08.08 0 0 1 0-.12l.3-.24a.07.07 0 0 1 .08 0 12.3 12.3 0 0 0 10.4 0 .07.07 0 0 1 .08 0l.31.24a.08.08 0 0 1 0 .12 10.2 10.2 0 0 1-1.55.73.08.08 0 0 0-.04.1c.32.61.68 1.19 1.07 1.74a.08.08 0 0 0 .09.03c1.72-.53 3.46-1.33 5.26-2.65a.08.08 0 0 0 .03-.05c.44-4.51-.73-8.41-3.1-11.9a.06.06 0 0 0-.03-.07zM8.52 14.85c-1.04 0-1.9-.96-1.9-2.13s.84-2.14 1.9-2.14 1.92.96 1.9 2.14c0 1.17-.84 2.13-1.9 2.13zm6.97 0c-1.04 0-1.9-.96-1.9-2.13s.84-2.14 1.9-2.14 1.92.96 1.9 2.14c0 1.17-.83 2.13-1.9 2.13z" />
            </svg>
          </a>
          <ClaudeCodeNavButton />
          <AuthControls />
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
