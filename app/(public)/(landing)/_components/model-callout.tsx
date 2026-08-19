"use client";

import { useEffect, useState } from "react";

import { VendorLogo } from "@/components/models/vendor-logo";

/** Real catalogue entries, each anchored to a different point on the globe. */
const ROUTES = [
  {
    vendor: "anthropic",
    vendorLabel: "Anthropic",
    model: "claude-opus-5",
    tag: "Flagship",
    blurb: "Reasoning and agentic work.",
    status: "Cheapest healthy route in 1 hop",
    meta: "1M context · text, image",
    anchor: { left: 46, top: 36 },
  },
  {
    vendor: "openai",
    vendorLabel: "OpenAI",
    model: "gpt-5-6-sol",
    tag: "Frontier",
    blurb: "Long-horizon reasoning.",
    status: "Cheapest healthy route in 1 hop",
    meta: "400K context · text",
    anchor: { left: 56, top: 52 },
  },
  {
    vendor: "moonshot",
    vendorLabel: "Moonshot",
    model: "kimi-k2-5",
    tag: "Cost-efficient",
    blurb: "High volume, low spend.",
    status: "Cheapest healthy route in 1 hop",
    meta: "256K context · text",
    anchor: { left: 44, top: 60 },
  },
  {
    vendor: "meta",
    vendorLabel: "Meta",
    model: "llama-4-maverick-17b",
    tag: "Balanced",
    blurb: "Everyday chat and tools.",
    status: "Cheapest healthy route in 1 hop",
    meta: "1M context · text, image",
    anchor: { left: 54, top: 36 },
  },
];

export function ModelCallout() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hold = setTimeout(() => setVisible(false), 7000);
    return () => clearTimeout(hold);
  }, [index]);

  useEffect(() => {
    if (visible) return;

    const swap = setTimeout(() => {
      setIndex((current) => (current + 1) % ROUTES.length);
      setVisible(true);
    }, 520);
    return () => clearTimeout(swap);
  }, [visible]);

  const route = ROUTES[index];

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute z-10 transition-all duration-[1200ms] ease-in-out"
        style={{
          left: `${route.anchor.left}%`,
          top: `${route.anchor.top}%`,
        }}
      >
        <span className="absolute -translate-x-1/2 -translate-y-1/2">
          <span className="animate-orbit-pulse block size-5 rounded-full border border-white/50" />
        </span>
      </span>

      <div
        className="pointer-events-none absolute z-20 w-[336px] max-w-[calc(100%-1.5rem)] transition-all duration-[1200ms] ease-in-out"
        style={{
          left: `${route.anchor.left}%`,
          top: `${route.anchor.top}%`,
          transform: "translate(-50%, 18px)",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="rounded-xl border border-white/10 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur-sm">
          <p className="text-[11.5px] text-zinc-500">{route.vendorLabel}</p>

          <div className="mt-1 flex items-center gap-2">
            <VendorLogo vendor={route.vendor} className="size-4" />
            <p className="truncate font-mono text-[13px] text-white">
              {route.model}
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="shrink-0 rounded bg-white/[0.08] px-1.5 py-0.5 text-[10.5px] font-medium whitespace-nowrap text-zinc-300">
              {route.tag}
            </span>
            <span className="truncate text-[11.5px] text-zinc-400">
              {route.blurb}
            </span>
          </div>

          <p className="mt-2 text-[11.5px] text-emerald-400">{route.status}</p>

          <p className="mt-1 text-[11.5px] text-zinc-500">{route.meta}</p>
        </div>
      </div>
    </>
  );
}
