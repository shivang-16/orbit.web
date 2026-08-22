"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { LandingSectionLink } from "@/components/layout/claude-code-nav";

type NavItem = {
  label: string;
  href: string;
  sectionId?: string;
};

type Props = {
  items: NavItem[];
};

export function MobileNav({ items }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const itemClassName =
    "border-b border-white/6 py-3.5 text-[15px] text-zinc-300 transition-colors last:border-b-0 hover:text-white";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="landing-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
        className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-14 z-40 bg-black/60 sm:top-16"
          />
          <nav
            id="landing-mobile-nav"
            className="fixed inset-x-0 top-14 z-50 flex flex-col border-b border-white/8 bg-black/95 px-4 py-3 backdrop-blur-md sm:top-16 sm:px-6"
          >
            {items.map((item) =>
              item.sectionId ? (
                <LandingSectionLink
                  key={item.label}
                  id={item.sectionId}
                  onNavigate={() => setOpen(false)}
                  className={itemClassName}
                >
                  {item.label}
                </LandingSectionLink>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  {...(item.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={itemClassName}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </>
      ) : null}
    </div>
  );
}
