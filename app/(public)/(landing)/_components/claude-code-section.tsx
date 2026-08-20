"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import { CLAUDE_CODE_SECTION_ID, scrollToClaudeCode } from "@/components/layout/claude-code-nav";
import { Button } from "@/components/ui/button";
import { anthropicBaseUrl } from "@/lib/inference-docs";

const HIGHLIGHTS = [
  {
    lead: "No Claude subscription.",
    body: "Skip the login screen. Your sk-orbit key is the only credential Claude Code needs.",
  },
  {
    lead: "Same agent, cheaper tokens.",
    body: "Every turn is billed from organization credits at Bedrock list rates, with zero markup.",
  },
  {
    lead: "Swap models per session.",
    body: "Run the agent on Sonnet 5, Opus 5 or Haiku 4.5 — just name the slug you want.",
  },
];

const SETUP = `export CLAUDE_CODE_USE_GATEWAY=1
export ANTHROPIC_BASE_URL="${anthropicBaseUrl()}"
export ANTHROPIC_AUTH_TOKEN="$ORBIT_API_KEY"
export ANTHROPIC_MODEL="claude-sonnet-5"

claude`;

/** The banner Claude Code prints on start, once it is pointed at Orbit. */
const BANNER = [
  " ▐▛███▜▌   Claude Code v2.1.237",
  "▝▜█████▛▘  Sonnet 5 · Cloud gateway",
  "  ▘▘ ▝▝    api.tryorbit.cloud",
];

export function ClaudeCodeSection() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.location.hash !== `#${CLAUDE_CODE_SECTION_ID}`) return;
    const frame = requestAnimationFrame(() => scrollToClaudeCode());
    return () => cancelAnimationFrame(frame);
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section
      id="claude-code"
      className="relative scroll-mt-16 bg-black px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28 xl:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.035em] lg:text-[clamp(1.75rem,3vw,2.5rem)]">
          <span className="text-white">Run Claude Code on Orbit credits.</span>{" "}
          <span className="text-zinc-500">
            Point it at one base URL and the agent runs exactly as it does today.
          </span>
        </h2>

        <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <dl className="border-t border-white/[0.06]">
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

          <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="relative flex h-8 items-center bg-[#161617] px-3">
              <div className="flex items-center gap-[6px]" aria-hidden>
                <span className="size-[9px] rounded-full bg-[#ff5f57]" />
                <span className="size-[9px] rounded-full bg-[#febc2e]" />
                <span className="size-[9px] rounded-full bg-[#28c840]" />
              </div>
              <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] text-zinc-400">
                orbit — zsh — 80×24
              </p>
              <button
                type="button"
                onClick={copy}
                aria-label="Copy setup commands"
                className="relative z-10 ml-auto flex size-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>

            <div className="overflow-x-auto bg-black px-4 py-4 font-mono text-[11.5px] leading-[1.85] sm:px-5 sm:py-5 sm:text-[12.5px]">
              <p className="mb-2">
                <span className="text-white">(base)</span>
                <span className="text-[#ff6b8a]"> → </span>
                <span className="text-sky-400">~</span>
              </p>

              <pre className="whitespace-pre">
                <code>
                  <ShellHighlighted code={SETUP} />
                </code>
              </pre>

              <pre className="mt-4 whitespace-pre text-[#d87756]">
                <code>{BANNER.join("\n")}</code>
              </pre>

              <p className="mt-3 whitespace-pre text-zinc-500">
                <span className="text-emerald-400">❯</span> refactor this handler
                and run the tests
                <span className="ml-px inline-block h-[1.05em] w-[7px] translate-y-[0.18em] animate-pulse bg-white/80" />
              </p>
            </div>
          </div>
        </div>

        <Lockup />

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button
            asChild
            className="group h-11 w-auto shrink-0 gap-2 rounded-lg bg-white pr-1 pl-4 text-[13px] font-medium text-black hover:bg-zinc-200 sm:h-12 sm:gap-3 sm:pr-1.5 sm:pl-5 sm:text-sm"
          >
            <Link href="/docs">
              Set up Claude Code
              <span className="flex size-8 items-center justify-center rounded-md bg-black text-white sm:size-9">
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** Full-bleed "Claude Code × Orbit" wordmark band that sits above the CTA. */
function Lockup() {
  return (
    <div className="mt-14 flex w-full items-center justify-center gap-4 sm:mt-20 sm:gap-8 lg:gap-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/claude-code.png"
        alt="Claude Code"
        className="h-[clamp(2.75rem,11vw,8rem)] w-auto mix-blend-screen"
        style={{ imageRendering: "pixelated" }}
      />

      <span className="text-[clamp(1.25rem,3.5vw,2.5rem)] leading-none text-zinc-700">
        &times;
      </span>

      <span className="flex items-center gap-[clamp(0.5rem,1.4vw,1.25rem)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/orbit.png"
          alt=""
          className="size-[clamp(2rem,7vw,5.5rem)] rounded-sm object-contain invert"
        />
        <span className="font-mono text-[clamp(1.75rem,7vw,5.5rem)] leading-none font-medium tracking-tight text-white">
          orbit
        </span>
      </span>
    </div>
  );
}

const SHELL_TOKENS =
  /("(?:[^"\\]|\\.)*")|(#[^\n]*)|\b(export)\b|\b([A-Z][A-Z0-9_]{3,})\b|\b(claude)\b|\b(\d+)\b/g;

/** Same palette as the SDK snippet, tuned for shell instead of Python/Node. */
function ShellHighlighted({ code }: { code: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(SHELL_TOKENS);

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > cursor) {
      parts.push(code.slice(cursor, match.index));
    }

    const [value, string, comment, keyword, envName, command, number] = match;
    const className = string
      ? "text-emerald-300"
      : comment
        ? "text-zinc-600"
        : keyword
          ? "text-violet-300"
          : envName
            ? "text-sky-300"
            : command
              ? "text-white"
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
