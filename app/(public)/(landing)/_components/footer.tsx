import Link from "next/link";

import { ASK_AI_QUERY } from "@/lib/ask-ai";

const LINKS = {
  Product: [
    { label: "Models", href: "/models" },
    { label: "Playground", href: "/playground" },
    { label: "Pricing", href: "/pricing" },
  ],
  Resources: [
    { label: "Docs", href: "/docs" },
    { label: "Discord", href: "https://discord.gg/JHsxTjPUBc" },
    { label: "Sign in", href: "/sign-in" },
    { label: "Sign up", href: "/sign-up" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Contact", href: "mailto:hello@tryorbit.cloud" },
  ],
};

const ASK_AI = [
  { label: "ChatGPT", vendor: "openai", href: `https://chatgpt.com/?q=${ASK_AI_QUERY}` },
  { label: "Claude", vendor: "anthropic", href: `https://claude.ai/new?q=${ASK_AI_QUERY}` },
  { label: "Gemini", vendor: "google", href: `https://gemini.google.com/app?q=${ASK_AI_QUERY}` },
  { label: "Perplexity", vendor: "perplexity", href: `https://www.perplexity.ai/search?q=${ASK_AI_QUERY}` },
];

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/8 bg-black">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-[260px] shrink-0 flex-col gap-4">
            <Link
              href="/"
              className="font-mono text-[16px] font-medium tracking-tight text-white"
            >
              orbit
            </Link>
            <p className="text-[13px] leading-relaxed text-zinc-400">
              One API for Claude, GPT, Kimi and 50+ more. Orbit routes every
              request to the cheapest healthy provider &mdash; no markup, no
              lock-in.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-16 lg:gap-x-24">
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group} className="flex min-w-0 flex-col gap-3">
                <p className="text-[12px] font-semibold tracking-widest text-zinc-500 uppercase">
                  {group}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={`${group}-${item.label}`}>
                      {item.href.startsWith("http") || item.href.startsWith("mailto:") ? (
                        <a
                          href={item.href}
                          {...(item.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-[13px] text-zinc-400 transition-colors hover:text-white"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-[13px] text-zinc-400 transition-colors hover:text-white"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 mb-6 h-px bg-white/8" />

        <div className="flex flex-col-reverse items-start gap-6 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-zinc-500">
            &copy; 2026 Orbit. All rights reserved.
          </p>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="text-[12px] text-zinc-500">Ask AI about Orbit</p>
            <div className="flex items-center gap-2">
              {ASK_AI.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ask ${item.label} about Orbit`}
                  title={`Ask ${item.label} about Orbit`}
                  className="group flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-all hover:border-white/20 hover:bg-white/[0.06]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/vendors/${item.vendor}.svg`}
                    alt=""
                    className="size-4 object-contain opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giant "orbit" outline wordmark */}
      <div
        aria-hidden
        className="pointer-events-none relative -mt-14 w-full overflow-hidden select-none"
        style={{ height: "clamp(110px, 28vw, 360px)" }}
      >
        <svg
          viewBox="0 0 1000 260"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 h-full w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="orbit-wordmark-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="100%"
            dominantBaseline="auto"
            textAnchor="middle"
            className="font-sans"
            fontWeight="600"
            fontSize="280"
            letterSpacing="-4"
            fill="none"
            stroke="url(#orbit-wordmark-grad)"
            strokeWidth="1.25"
          >
            orbit
          </text>
        </svg>
      </div>
    </footer>
  );
}
