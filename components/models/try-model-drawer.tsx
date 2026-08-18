"use client";

import { type PointerEvent, type ReactNode, useCallback, useState } from "react";
import Link from "next/link";
import { ArrowSquareOutIcon, CheckIcon, CopyIcon, XIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { chatEndpoint, curlSample, pythonSample, typescriptSample } from "@/lib/inference-docs";
import { cn } from "@/lib/utils";

const DEFAULT_WIDTH = 640;
const MIN_WIDTH = 420;
const MAX_WIDTH_RATIO = 0.85;

type CodeTab = "python" | "typescript" | "curl";

const TABS: { key: CodeTab; label: string }[] = [
  { key: "python", label: "Python" },
  { key: "typescript", label: "TypeScript (fetch)" },
  { key: "curl", label: "cURL" },
];

export function TryModelDrawer({
  open,
  onOpenChange,
  modelId,
  modelName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  modelName: string;
}) {
  const [tab, setTab] = useState<CodeTab>("python");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);

  const samples: Record<CodeTab, string> = {
    python: pythonSample(modelId),
    typescript: typescriptSample(modelId),
    curl: curlSample(modelId),
  };

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
              <Dialog.Title className="text-[15px] font-medium text-white">Quick Start</Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] text-zinc-400">
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
              <p className="text-[13px] text-zinc-400">
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
              <p className="text-[13px] text-zinc-400">
                Send messages to{" "}
                <code className="rounded bg-white/10 px-1 py-0.5 text-[11px] text-zinc-300">{modelId}</code> and get
                the model&apos;s response back directly — no routing decisions to make.
              </p>

              <div className="mt-3 flex gap-1 rounded-lg bg-white/5 p-1">
                {TABS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                      tab === item.key ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <CodeBlock className="mt-3" code={samples[tab]} />
            </Step>

            <Step number={3} title="Endpoint">
              <p className="text-[13px] text-zinc-400">
                Accepts chat messages and returns the provider&apos;s response as JSON.
              </p>
              <div className="mt-3 space-y-2 rounded-lg border border-white/10 bg-black px-3 py-3 text-[12px]">
                <Row label="Method">
                  <span className="font-mono text-zinc-300">POST</span>
                </Row>
                <Row label="URL">
                  <span className="font-mono break-all text-zinc-300">{chatEndpoint(modelId)}</span>
                </Row>
                <Row label="Authorization">
                  <span className="font-mono text-zinc-300">Bearer $ORBIT_API_KEY</span>
                </Row>
                <Row label="Content-Type">
                  <span className="font-mono text-zinc-300">application/json</span>
                </Row>
              </div>
            </Step>
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
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white">
          {number}
        </span>
        <h3 className="text-[13px] font-medium text-white">{title}</h3>
      </div>
      <div className="mt-2 pl-7">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-zinc-500">{label}</span>
      <span className="min-w-0 text-right">{children}</span>
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
      <pre className="overflow-x-auto px-3 py-2.5 pr-9 font-mono text-[12px] leading-relaxed whitespace-pre text-zinc-300">
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
