import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeroBackdrop } from "./hero-backdrop";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-black pt-32 pb-24 lg:pb-25">
      <HeroBackdrop />

      <div className="w-full px-8 lg:px-10 xl:px-12">
        <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.95] font-normal tracking-[-0.045em] text-white">
          <span className="block">Every frontier model,</span>
          <span className="block">at half the price.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 lg:text-lg">
          One API for Claude, GPT, Kimi and 50+ more. Orbit routes every
          request to the cheapest healthy provider - no markup, no lock-in.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="group h-12 gap-3 rounded-lg bg-white pr-1.5 pl-5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            <Link href="/sign-up">
              Get API Key
              <span className="flex size-9 items-center justify-center rounded-md bg-black text-white">
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 rounded-lg border-white/20 bg-transparent px-4 text-sm text-white hover:bg-white/5"
          >
            <Link href="/models">
              <Layers className="size-4 text-zinc-400" />
              Browse models
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-[13px] text-zinc-500">
          $2 in free credits to start &middot; No credit card required &middot;
          Pay only for what you use.
        </p>
      </div>
    </section>
  );
}
