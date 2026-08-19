"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "How does Orbit's pricing work?",
    answer:
      "Pick a monthly plan that includes a credit balance, or talk to us about custom volume pricing. Every request is billed at Amazon Bedrock's list rate for that model \u2014 Orbit never adds a markup. New accounts start with $2 in free credits, no card required.",
    tags: ["Pricing", "Credits", "Bedrock rates", "No markup"],
  },
  {
    question: "Which models and providers does Orbit support?",
    answer:
      "50+ models across OpenAI, Anthropic, Kimi, Meta, Mistral, DeepSeek, Qwen, MiniMax and more, all served through Amazon Bedrock \u2014 including Bedrock Mantle for the newest GPT-5 models. The catalogue keeps growing as new models ship.",
    tags: ["Models", "Vendors", "Bedrock", "Bedrock Mantle"],
  },
  {
    question: "Do I need to change my code to use Orbit?",
    answer:
      "No. Point the OpenAI or Anthropic SDK you already use at Orbit's base_url and swap in an Orbit API key. Chat completions and messages work exactly like they do today, buffered or streamed.",
    tags: ["OpenAI SDK", "Anthropic SDK", "Streaming"],
  },
  {
    question: "What does \u201ccheapest healthy provider\u201d actually mean?",
    answer:
      "Before every request, Orbit's router checks price and live health for the model you asked for and sends the call down the cheapest path that's currently healthy. If a provider is degraded, the next healthy one serves the request \u2014 no failover logic for you to build.",
    tags: ["Routing", "Failover", "Health checks"],
  },
  {
    question: "How is usage billed?",
    answer:
      "Every request consumes organization credits based on billed input and output tokens, at Bedrock list rates, whether inference succeeds or fails after the provider call. Track spend live from the usage dashboard.",
    tags: ["Billing", "Tokens", "Usage dashboard"],
  },
  {
    question: "What happens when I run out of credits?",
    answer:
      "Requests are declined once your organization's credit balance is exhausted, so you're never billed a surprise. Add credits by upgrading your plan or topping up from the dashboard at any time.",
    tags: ["Credits", "Plans", "Dashboard"],
  },
  {
    question: "How do I keep my API key secure?",
    answer:
      "Orbit stores only a hash and a short preview of each key after it's shown to you once. Create separate keys per project or environment, and revoke any key instantly from the dashboard if it's ever exposed.",
    tags: ["API keys", "Security", "Dashboard"],
  },
] as const;

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-black px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[clamp(2.5rem,12vw,5.5rem)] leading-[0.95] font-bold tracking-tight text-white">
          FAQ
        </h2>

        <div className="mt-8 border-t border-white/10 sm:mt-10">
          {FAQS.map((item, index) => {
            const expanded = open === index;

            return (
              <div key={item.question} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : index)}
                  aria-expanded={expanded}
                  className="flex w-full items-start gap-3 py-4 text-left sm:gap-5 sm:py-6"
                >
                  <span
                    className={cn(
                      "mt-1 shrink-0 font-mono text-[12px] tabular-nums transition-colors sm:text-[13px]",
                      expanded ? "text-emerald-400" : "text-zinc-600"
                    )}
                  >
                    ({String(index + 1).padStart(3, "0")})
                  </span>

                  <span className="flex-1 text-[15px] leading-snug font-medium text-white sm:text-[17px] md:text-[19px]">
                    {item.question}
                  </span>

                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                      expanded
                        ? "border-emerald-400/40 text-emerald-400"
                        : "border-white/15 text-zinc-500"
                    )}
                  >
                    {expanded ? (
                      <Minus className="size-3.5" />
                    ) : (
                      <Plus className="size-3.5" />
                    )}
                  </span>
                </button>

                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300 ease-out",
                    expanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0">
                    <div className="max-w-2xl pb-5 pl-11 sm:pb-6 sm:pl-[56px]">
                      <p className="text-[14px] leading-relaxed text-zinc-400">
                        {item.answer}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
