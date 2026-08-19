import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeroBackdrop } from "./hero-backdrop";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-25">
      <HeroBackdrop />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <h1 className="text-[clamp(2.15rem,8vw,6.5rem)] leading-[0.95] font-normal tracking-[-0.045em] text-white">
          <span className="block">Every frontier model,</span>
          <span className="block">at half the price.</span>
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-300 sm:mt-6 sm:text-base lg:text-lg">
          One API for Claude, GPT, Kimi and 50+ more. Orbit routes every
          request to the cheapest healthy provider - no markup, no lock-in.
        </p>

        <div className="mt-8 flex flex-row flex-nowrap items-center gap-2 sm:mt-10 sm:gap-3">
          <Button
            asChild
            className="group h-11 w-auto shrink-0 gap-2 rounded-lg bg-white pr-1 pl-4 text-[13px] font-medium text-black hover:bg-zinc-200 sm:h-12 sm:gap-3 sm:pr-1.5 sm:pl-5 sm:text-sm"
          >
            <Link href="/sign-up">
              Get API Key
              <span className="flex size-8 items-center justify-center rounded-md bg-black text-white sm:size-9">
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 w-auto shrink-0 rounded-lg border-white/20 bg-transparent px-3 text-[13px] text-white hover:bg-white/5 sm:h-12 sm:px-4 sm:text-sm"
          >
            <Link href="/models">
              <Layers className="size-4 text-zinc-400" />
              Browse models
            </Link>
          </Button>
        </div>

        <p className="mt-4 max-w-md text-[12.5px] leading-relaxed text-zinc-500 sm:max-w-none sm:text-[13px]">
          $2 in free credits to start &middot; No credit card required &middot;
          Pay only for what you use.
        </p>
      </div>
    </section>
  );
}
