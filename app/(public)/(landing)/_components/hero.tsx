import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";

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

        <p className="mt-7 max-w-xl text-base leading-relaxed text-zinc-300 lg:text-lg">
          One API for Claude, GPT, Gemini and 200+ more. Orbit routes every
          request to the cheapest healthy provider — no markup, no lock-in.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="group h-12 gap-3 rounded-xl border-white/15 bg-zinc-950 pr-1.5 pl-5 text-sm"
          >
            <Link href="/sign-up">
              Start for free
              <span className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
              </span>
            </Link>
          </Button>

          <Button asChild variant="ghost" className="h-12 rounded-xl px-4 text-sm text-zinc-300">
            <Link href="/models">
              <Layers className="size-4 text-zinc-400" />
              Browse models
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-[13px] text-zinc-500">
          $5 in free credits to start &middot; No credit card required &middot;
          Pay only for what you use.
        </p>
      </div>
    </section>
  );
}
