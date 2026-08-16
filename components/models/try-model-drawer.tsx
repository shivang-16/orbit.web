"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { ArrowSquareOutIcon, CheckIcon, CopyIcon, XIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { chatEndpoint, curlSample, pythonSample, typescriptSample } from "@/lib/inference-docs";
import { cn } from "@/lib/utils";

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

  const samples: Record<CodeTab, string> = {
    python: pythonSample(modelId),
    typescript: typescriptSample(modelId),
    curl: curlSample(modelId),
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0b0b0c] shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-[15px] font-medium text-white">Quick Start</Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] text-zinc-400">
                Drop-in code to call {modelName} with Orbit&apos;s API.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <XIcon size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
            <Step number={1} title="Get your API key">
              <p className="text-[13px] text-zinc-400">
                Create an API key from your Orbit dashboard and set it as an environment variable.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/dashboard/api-keys" target="_blank">
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
      <button
        type="button"
        onClick={copy}
        className="absolute top-2 right-2 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
      >
        {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
      </button>
    </div>
  );
}
