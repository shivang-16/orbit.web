import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";

import { HeroBackdrop } from "./hero-backdrop";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-black pt-32 pb-16 lg:pb-16">
      <HeroBackdrop />

      <div className="w-full px-6 lg:px-10">
        <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.95] font-normal tracking-[-0.045em] text-white">
          <span className="block">Every frontier model,</span>
          <span className="block">at half the price.</span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-zinc-400 lg:text-lg">
          One API for Claude, GPT, Gemini and 200+ more. Orbit routes every
          request to the cheapest healthy provider — no markup, no lock-in.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/sign-up"
            className="group flex h-12 items-center gap-3 rounded-xl border border-white/15 bg-zinc-950 pr-1.5 pl-5 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-zinc-900"
          >
            Start for free
            <span className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
            </span>
          </Link>

          <Link
            href="/models"
            className="flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Layers className="size-4 text-zinc-500" />
            Browse models
          </Link>
        </div>

        <p className="mt-8 text-[13px] text-zinc-600">
          $5 in free credits to start &middot; No credit card required &middot;
          Pay only for what you use.
        </p>
      </div>
    </section>
  );
}
