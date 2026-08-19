"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";

import { VendorLogo } from "@/components/models/vendor-logo";
import { anthropicBaseUrl, openaiBaseUrl } from "@/lib/inference-docs";
import { cn } from "@/lib/utils";

const MODEL_TOKEN = "__MODEL__";

/** Real catalogue slugs, so the snippet stays copy-pasteable at every frame. */
const MODELS = [
  "claude-opus-5",
  "gpt-5-6-sol",
  "kimi-k2-5",
  "llama-4-maverick-17b",
  "claude-sonnet-5",
];

const SDKS = [
  { key: "openai", label: "OpenAI SDK" },
  { key: "anthropic", label: "Anthropic SDK" },
] as const;

const LANGUAGES = [
  { key: "python", label: "Python" },
  { key: "node", label: "Node.js" },
  { key: "curl", label: "cURL" },
] as const;

type SdkKey = (typeof SDKS)[number]["key"];
type LanguageKey = (typeof LANGUAGES)[number]["key"];

const HIGHLIGHTS = [
  {
    lead: "One base URL.",
    body: "Point base_url at Orbit and keep your api_key in an env var. Nothing else in your code changes.",
  },
  {
    lead: "OpenAI and Anthropic compatible.",
    body: "Chat completions and messages, buffered or streamed as server-sent events.",
  },
  {
    lead: "One key, every model.",
    body: "The same sk-orbit key reaches every model in the catalogue, billed at Bedrock list rates.",
  },
];

const VENDORS = [
  { vendor: "anthropic", label: "Anthropic" },
  { vendor: "openai", label: "OpenAI" },
  { vendor: "moonshot", label: "Moonshot" },
  { vendor: "meta", label: "Meta" },
  { vendor: "mistral", label: "Mistral" },
  { vendor: "deepseek", label: "DeepSeek" },
  { vendor: "qwen", label: "Qwen" },
  { vendor: "minimax", label: "MiniMax" },
];

function samples(sdk: SdkKey): Record<LanguageKey, string> {
  if (sdk === "openai") {
    return {
      python: `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["ORBIT_API_KEY"],
    base_url="${openaiBaseUrl()}",
)

stream = client.chat.completions.create(
    model="${MODEL_TOKEN}",
    messages=[{"role": "user", "content": "Analyze this data..."}],
    stream=True,
)`,
      node: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.ORBIT_API_KEY,
  baseURL: "${openaiBaseUrl()}",
});

const stream = await client.chat.completions.create({
  model: "${MODEL_TOKEN}",
  messages: [{ role: "user", content: "Analyze this data..." }],
  stream: true,
});`,
      curl: `curl ${openaiBaseUrl()}/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${MODEL_TOKEN}",
    "messages": [{ "role": "user", "content": "Analyze this data..." }],
    "stream": true
  }'`,
    };
  }

  return {
    python: `import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["ORBIT_API_KEY"],
    base_url="${anthropicBaseUrl()}",
)

message = client.messages.create(
    model="${MODEL_TOKEN}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Analyze this data..."}],
)`,
    node: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ORBIT_API_KEY,
  baseURL: "${anthropicBaseUrl()}",
});

const message = await client.messages.create({
  model: "${MODEL_TOKEN}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Analyze this data..." }],
});`,
    curl: `curl ${anthropicBaseUrl()}/v1/messages \\
  -H "x-api-key: $ORBIT_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${MODEL_TOKEN}",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "Analyze this data..." }]
  }'`,
  };
}

export function SdkSection() {
  const [sdk, setSdk] = useState<SdkKey>("openai");
  const [language, setLanguage] = useState<LanguageKey>("python");
  const [copied, setCopied] = useState(false);
  const typedModel = useTypewriter(MODELS);

  const template = useMemo(() => samples(sdk)[language], [sdk, language]);
  const [before, after] = template.split(MODEL_TOKEN);

  async function copy() {
    await navigator.clipboard.writeText(
      template.replace(MODEL_TOKEN, MODELS[0])
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="relative bg-black px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 sm:gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2 className="max-w-md text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.035em] lg:text-[clamp(1.75rem,3vw,2.5rem)]">
            <span className="text-white">No migration. No new SDK.</span>{" "}
            <span className="text-zinc-500">
              Point the client you already use at Orbit.
            </span>
          </h2>

          <dl className="mt-10 border-t border-white/[0.06]">
            {HIGHLIGHTS.map((item) => (
              <div key={item.lead} className="border-b border-white/[0.06] py-4">
                <dt className="inline text-[13.5px] font-medium text-white">
                  {item.lead}
                </dt>{" "}
                <dd className="inline text-[13.5px] leading-relaxed text-zinc-400">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-2">
            {VENDORS.map((item) => (
              <span
                key={item.vendor}
                className="flex items-center gap-2 rounded-lg bg-white/[0.05] py-1.5 pr-3 pl-2 text-[12.5px] text-zinc-300"
              >
                <VendorLogo vendor={item.vendor} className="size-4" />
                {item.label}
              </span>
            ))}
            <Link
              href="/models"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] text-zinc-500 transition-colors hover:text-white"
            >
              And more
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative min-w-0">
          <GridBackdrop />

          <div className="relative min-w-0">
            <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-white/[0.04] p-1">
              {SDKS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSdk(item.key)}
                  aria-pressed={sdk === item.key}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors sm:px-3.5",
                    sdk === item.key
                      ? "bg-[#18181b] text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 min-w-0 overflow-hidden rounded-2xl bg-[#09090b]/80 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2 px-2 pt-3 sm:px-3">
                <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setLanguage(item.key)}
                      className={cn(
                        "shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                        language === item.key
                          ? "bg-white/[0.07] text-white"
                          : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="Copy code"
                  className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto px-4 py-5 font-mono text-[11.5px] leading-[1.85] whitespace-pre sm:px-5 sm:py-6 sm:text-[12.5px]">
                <code>
                  <Highlighted code={before} />
                  <span className="text-emerald-300">{typedModel}</span>
                  <span className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.18em] animate-pulse bg-white/70" />
                  <Highlighted code={after} />
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Faint graph paper behind the snippet, fading out at the edges. */
function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-4 -inset-y-8 -z-10 sm:-inset-x-10 sm:-inset-y-12"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
      }}
    />
  );
}

/** Types each model out, holds, deletes, then moves to the next one. */
function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];

    if (!deleting && length === word.length) {
      const hold = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(hold);
    }

    if (deleting && length === 0) {
      setDeleting(false);
      setIndex((current) => (current + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => setLength((current) => current + (deleting ? -1 : 1)),
      deleting ? 35 : 70
    );
    return () => clearTimeout(tick);
  }, [words, index, length, deleting]);

  return words[index].slice(0, length);
}

const TOKENS =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(#[^\n]*)|\b(import|from|const|await|new|return|True|true|False|false)\b|\b(OpenAI|Anthropic|create|environ)\b|\b(\d+)\b/g;

/** Small, dependency-free highlighter — enough for these six snippets. */
function Highlighted({ code }: { code: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(TOKENS);

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > cursor) {
      parts.push(code.slice(cursor, match.index));
    }

    const [value, string, comment, keyword, callable, number] = match;
    const className = string
      ? "text-emerald-300"
      : comment
        ? "text-zinc-600"
        : keyword
          ? "text-violet-300"
          : callable
            ? "text-sky-300"
            : number
              ? "text-zinc-200"
              : undefined;

    parts.push(
      <span key={`${match.index}-${value}`} className={className}>
        {value}
      </span>
    );
    cursor = match.index + value.length;
  }

  if (cursor < code.length) {
    parts.push(code.slice(cursor));
  }

  return <span className="text-zinc-400">{parts}</span>;
}
