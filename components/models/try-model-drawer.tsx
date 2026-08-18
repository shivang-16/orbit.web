"use client";

import { type PointerEvent, type ReactNode, useCallback, useState } from "react";
import Link from "next/link";
import { ArrowSquareOutIcon, CheckIcon, CopyIcon, XIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import {
  anthropicBaseUrl,
  anthropicCurlSample,
  anthropicPythonSample,
  anthropicStreamCurlSample,
  anthropicTypescriptSample,
  chatEndpoint,
  curlSample,
  openaiBaseUrl,
  openaiCurlSample,
  openaiPythonSample,
  openaiStreamCurlSample,
  openaiTypescriptSample,
  pythonSample,
  streamCurlSample,
  typescriptSample,
} from "@/lib/inference-docs";
import { cn } from "@/lib/utils";

const DEFAULT_WIDTH = 640;
const MIN_WIDTH = 420;
const MAX_WIDTH_RATIO = 0.85;

type CodeTab = "python" | "typescript" | "curl";
type SdkTab = "orbit" | "openai" | "anthropic";

const CODE_TABS: { key: CodeTab; label: string }[] = [
  { key: "python", label: "Python" },
  { key: "typescript", label: "TypeScript (fetch)" },
  { key: "curl", label: "cURL" },
];

const SDK_TABS: { key: SdkTab; label: string }[] = [
  { key: "orbit", label: "Orbit API" },
  { key: "openai", label: "OpenAI SDK" },
  { key: "anthropic", label: "Anthropic SDK" },
];

export function TryModelDrawer({
  open,
  onOpenChange,
  modelSlug,
  modelName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelSlug: string;
  modelName: string;
}) {
  const [sdkTab, setSdkTab] = useState<SdkTab>("orbit");
  const [tab, setTab] = useState<CodeTab>("python");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);

  // The native endpoint resolves models by slug or UUID, so every sample
  // (including Orbit's own) uses the short, human-readable slug.
  const samplesBySdk: Record<SdkTab, Record<CodeTab, string>> = {
    orbit: {
      python: pythonSample(modelSlug),
      typescript: typescriptSample(modelSlug),
      curl: curlSample(modelSlug),
    },
    openai: {
      python: openaiPythonSample(modelSlug),
      typescript: openaiTypescriptSample(modelSlug),
      curl: openaiCurlSample(modelSlug),
    },
    anthropic: {
      python: anthropicPythonSample(modelSlug),
      typescript: anthropicTypescriptSample(modelSlug),
      curl: anthropicCurlSample(modelSlug),
    },
  };
  const samples = samplesBySdk[sdkTab];
  const streamSampleBySdk: Record<SdkTab, string> = {
    orbit: streamCurlSample(modelSlug),
    openai: openaiStreamCurlSample(modelSlug),
    anthropic: anthropicStreamCurlSample(modelSlug),
  };

  const endpoints: EndpointCardData[] = [
    {
      description: "Sends a chat request and returns the model's response. Supports streaming and non-streaming.",
      method: "POST",
      url: chatEndpoint(modelSlug),
      fields: [
        { label: "Authorization", value: "Bearer $ORBIT_API_KEY" },
        { label: "Content-Type", value: "application/json" },
        { label: "Model", value: modelSlug },
      ],
    },
    {
      description: "OpenAI Chat Completions compatibility. Point the official SDK at Orbit with base_url and api_key.",
      method: "POST",
      url: `${openaiBaseUrl()}/chat/completions`,
      fields: [
        { label: "Authorization", value: "Bearer $ORBIT_API_KEY" },
        { label: "Content-Type", value: "application/json" },
        { label: "Model", value: modelSlug },
      ],
    },
    {
      description: "Anthropic Messages compatibility. Supports text, tools, and streaming. Auth is sent as x-api-key.",
      method: "POST",
      url: `${anthropicBaseUrl()}/v1/messages`,
      fields: [
        { label: "x-api-key", value: "$ORBIT_API_KEY" },
        { label: "anthropic-version", value: "2023-06-01" },
        { label: "Content-Type", value: "application/json" },
        { label: "Model", value: modelSlug },
      ],
    },
  ];

  const clampWidth = useCallback((next: number) => {
    const max = Math.max(MIN_WIDTH, Math.round(window.innerWidth * MAX_WIDTH_RATIO));
    return Math.min(max, Math.max(MIN_WIDTH, next));
  }, []);

  function onResizeStart(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function onResizeMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setWidth(clampWidth(window.innerWidth - event.clientX));
  }

  function onResizeEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:duration-300 data-[state=closed]:duration-200" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex flex-col border-l border-white/10 bg-[#0b0b0c] shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-300 data-[state=closed]:duration-200 data-[state=open]:ease-out data-[state=closed]:ease-in",
            dragging && "select-none"
          )}
          style={{ width }}
        >
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel"
            onPointerDown={onResizeStart}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeEnd}
            onPointerCancel={onResizeEnd}
            className="absolute inset-y-0 left-0 z-10 flex w-4 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center"
          >
            <span
              className={cn(
                "flex h-10 w-3.5 items-center justify-center rounded-full border border-white/15 bg-[#1a1a1a] shadow-md transition-colors",
                dragging ? "border-white/30 bg-white/15" : "hover:border-white/25 hover:bg-white/10"
              )}
            >
              <span className="grid grid-cols-2 gap-0.5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span key={index} className="size-0.5 rounded-full bg-zinc-400" />
                ))}
              </span>
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-[17px] font-medium text-white">Quick Start</Dialog.Title>
              <Dialog.Description className="mt-1 text-[14.5px] text-zinc-400">
                Drop-in code to call {modelName} with Orbit&apos;s API.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon-xs" className="shrink-0 text-zinc-400">
                <XIcon size={16} />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
            <Step number={1} title="Get your API key">
              <p className="text-[14.5px] text-zinc-400">
                Create an API key from your Orbit dashboard and set it as an environment variable.
              </p>
              <Button asChild className="mt-3">
                <Link href="/api-keys" target="_blank">
                  Create API key
                  <ArrowSquareOutIcon size={13} data-icon="inline-end" />
                </Link>
              </Button>
              <CodeBlock className="mt-3" code="export ORBIT_API_KEY=sk-orbit-..." />
            </Step>

            <Step number={2} title="Make your first request">
              <div className="grid grid-cols-3 gap-1.5">
                {SDK_TABS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSdkTab(item.key)}
                    aria-pressed={sdkTab === item.key}
                    className={cn(
                      "rounded-lg border px-2.5 py-2 text-center text-[13.5px] font-medium transition-all",
                      sdkTab === item.key
                        ? "border-white/25 bg-white/[0.08] text-white"
                        : "border-white/10 text-zinc-400 hover:border-white/15 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-[14.5px] text-zinc-400">
                Requests return a single JSON body by default. Pass{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-zinc-300">
                  stream: true
                </code>{" "}
                in step 3 to receive tokens as they arrive.
              </p>
              <div className="mt-3 flex items-center gap-4 border-b border-white/10 text-[14px]">
                {CODE_TABS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={cn(
                      "relative -mb-px pb-2 font-medium transition-colors",
                      tab === item.key ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {item.key === "typescript" && sdkTab !== "orbit" ? "TypeScript" : item.label}
                    {tab === item.key ? (
                      <span className="absolute inset-x-0 -bottom-px h-px bg-white" />
                    ) : null}
                  </button>
                ))}
              </div>

              <CodeBlock className="mt-3" code={samples[tab]} />
            </Step>

            <Step number={3} title="Enable streaming">
              <p className="text-[14.5px] text-zinc-400">
                Add{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-zinc-300">
                  &quot;stream&quot;: true
                </code>{" "}
                to your request body to receive responses as server-sent events:
              </p>
              <CodeBlock className="mt-3" code={streamSampleBySdk[sdkTab]} />
            </Step>

            <section>
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-medium text-white">
                  4
                </span>
                <h3 className="text-[15px] font-medium text-white">API endpoints</h3>
              </div>
              <div className="mt-3 space-y-5 pl-8">
                {endpoints.map((item) => (
                  <EndpointCard key={item.url} {...item} />
                ))}
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-medium text-white">
          {number}
        </span>
        <h3 className="text-[15px] font-medium text-white">{title}</h3>
      </div>
      <div className="mt-2.5 pl-8">{children}</div>
    </section>
  );
}

type EndpointField = { label: string; value: string; hint?: string };

type EndpointCardData = {
  description: string;
  method: string;
  url: string;
  fields: EndpointField[];
};

function EndpointCard({ description, method, url, fields }: EndpointCardData) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111113]">
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 font-mono text-[13.5px]">
          <span
            className={cn(
              "shrink-0 font-semibold",
              method === "GET" ? "text-sky-400" : "text-emerald-400"
            )}
          >
            {method}
          </span>
          <span className="min-w-0 break-all text-zinc-300">{url}</span>
        </div>
        <div className="border-t border-white/10 px-3.5 py-2.5">
          <dl className="space-y-1.5 text-[13.5px]">
            {fields.map((field) => (
              <div key={field.label} className="flex items-start justify-between gap-4">
                <dt className="shrink-0 text-zinc-500">{field.label}</dt>
                <dd className="min-w-0 text-right font-mono text-zinc-200">
                  <span className="font-medium">{field.value}</span>
                  {field.hint ? <span className="ml-1.5 font-sans font-normal text-zinc-500">— {field.hint}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="mt-2 text-[14px] leading-snug text-zinc-400">{description}</p>
    </div>
  );
}

function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={cn("group relative rounded-lg border border-white/10 bg-black", className)}>
      <pre className="overflow-x-auto px-3 py-3 pr-9 font-mono text-[13.5px] leading-relaxed whitespace-pre text-zinc-300">
        {code}
      </pre>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={copy}
        className="absolute top-2 right-2 text-zinc-500"
      >
        {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
      </Button>
    </div>
  );
}
