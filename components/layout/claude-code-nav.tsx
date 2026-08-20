"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

export const CLAUDE_CODE_SECTION_ID = "claude-code";
export const USE_CASES_SECTION_ID = "use-cases";

export function scrollToLandingSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;

  const header = document.querySelector("header");
  const offset = header?.getBoundingClientRect().height ?? 64;
  const target = el.getBoundingClientRect().top + window.scrollY - offset;
  const start = window.scrollY;
  const distance = target - start;
  if (Math.abs(distance) < 2) return true;

  const duration = 1100;
  const started = performance.now();

  function frame(now: number) {
    const t = Math.min(1, (now - started) / duration);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, start + distance * eased);
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return true;
}

export function scrollToClaudeCode() {
  return scrollToLandingSection(CLAUDE_CODE_SECTION_ID);
}

function useSectionClick(id: string, onNavigate?: () => void) {
  const pathname = usePathname();
  const router = useRouter();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (pathname !== "/") {
      event.preventDefault();
      router.push(`/#${id}`);
      return;
    }

    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    scrollToLandingSection(id);
  };
}

export function LandingSectionLink({
  id,
  className,
  children,
  onNavigate,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const onClick = useSectionClick(id, onNavigate);

  return (
    <Link href={`/#${id}`} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

export function ClaudeCodeNavButton() {
  const onClick = useSectionClick(CLAUDE_CODE_SECTION_ID);

  return (
    <Link
      href={`/#${CLAUDE_CODE_SECTION_ID}`}
      onClick={onClick}
      aria-label="Set up Claude Code with Orbit"
      className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/vendors/claude-code.svg"
        alt=""
        className="size-5 object-contain"
      />
    </Link>
  );
}
