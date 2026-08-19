"use client";

import { type FormEvent, useRef, useState } from "react";
import Anthropic, { APIError as AnthropicAPIError, APIUserAbortError as AnthropicAbortError } from "@anthropic-ai/sdk";
import OpenAI, { APIError as OpenAIAPIError, APIUserAbortError as OpenAIAbortError } from "openai";

import { Button } from "@/components/ui/button";
import { anthropicBaseUrl, openaiBaseUrl } from "@/lib/inference-docs";
import { cn } from "@/lib/utils";

const DEFAULT_MODEL = "kimi-k2-5";
const DEFAULT_PROMPT = "Hello!";

type SdkKind = "openai" | "anthropic";

type PanelState = {
  output: string;
  error: string | null;
  streaming: boolean;
};

const emptyPanel: PanelState = { output: "", error: null, streaming: false };

const CORS_HEADERS = new Set([
  "accept",
  "authorization",
  "content-type",
  "x-request-id",
  "x-organization-id",
  "x-api-key",
  "anthropic-version",
  "anthropic-beta",
]);

function corsSafeFetch(url: RequestInfo | URL, init?: RequestInit) {
  const incoming = new Headers(init?.headers);
  const headers = new Headers();
  incoming.forEach((value, key) => {
    if (CORS_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return fetch(url, { ...init, headers });
}

export function SdkTestPage() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [openai, setOpenai] = useState<PanelState>(emptyPanel);
  const [anthropic, setAnthropic] = useState<PanelState>(emptyPanel);
  const openaiAbort = useRef<AbortController | null>(null);
  const anthropicAbort = useRef<AbortController | null>(null);

  async function runOpenAI() {
    const key = apiKey.trim();
    if (!key) {
      setOpenai({ output: "", error: "Enter an API key.", streaming: false });
      return;
    }
    openaiAbort.current?.abort();
    const controller = new AbortController();
    openaiAbort.current = controller;
    setOpenai({ output: "", error: null, streaming: true });

    try {
      const client = new OpenAI({
        apiKey: key,
        baseURL: openaiBaseUrl(),
        dangerouslyAllowBrowser: true,
        maxRetries: 0,
        fetch: corsSafeFetch,
      });
      const stream = await client.chat.completions.create(
        {
          model,
          messages: [{ role: "user", content: prompt }],
          stream: true,
        },
        { signal: controller.signal }
      );
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          setOpenai((current) => ({ ...current, output: current.output + text }));
        }
      }
      setOpenai((current) => ({ ...current, streaming: false }));
    } catch (err) {
      if (controller.signal.aborted || err instanceof OpenAIAbortError) {
        setOpenai((current) => ({ ...current, streaming: false }));
        return;
      }
      setOpenai({
        output: "",
        streaming: false,
        error: err instanceof OpenAIAPIError ? err.message : String(err),
      });
    } finally {
      if (openaiAbort.current === controller) openaiAbort.current = null;
    }
  }

  async function runAnthropic() {
    const key = apiKey.trim();
    if (!key) {
      setAnthropic({ output: "", error: "Enter an API key.", streaming: false });
      return;
    }
    anthropicAbort.current?.abort();
    const controller = new AbortController();
    anthropicAbort.current = controller;
    setAnthropic({ output: "", error: null, streaming: true });

    try {
      const client = new Anthropic({
        apiKey: key,
        baseURL: anthropicBaseUrl(),
        dangerouslyAllowBrowser: true,
        maxRetries: 0,
        fetch: corsSafeFetch,
      });
      const stream = await client.messages.create(
        {
          model,
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
          stream: true,
        },
        { signal: controller.signal }
      );
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const text = event.delta.text;
          if (text) {
            setAnthropic((current) => ({ ...current, output: current.output + text }));
          }
        }
      }
      setAnthropic((current) => ({ ...current, streaming: false }));
    } catch (err) {
      if (controller.signal.aborted || err instanceof AnthropicAbortError) {
        setAnthropic((current) => ({ ...current, streaming: false }));
        return;
      }
      setAnthropic({
        output: "",
        streaming: false,
        error: err instanceof AnthropicAPIError ? err.message : String(err),
      });
    } finally {
      if (anthropicAbort.current === controller) anthropicAbort.current = null;
    }
  }

  function onSubmit(event: FormEvent, kind: SdkKind) {
    event.preventDefault();
    if (kind === "openai") void runOpenAI();
    else void runAnthropic();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 text-white sm:px-6 sm:py-8">
      <h1 className="text-2xl font-medium tracking-tight">SDK test</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Hits Orbit with the official OpenAI and Anthropic SDKs, both streaming. OpenAI uses{" "}
        <code className="text-zinc-300">{openaiBaseUrl()}</code>, Anthropic uses{" "}
        <code className="text-zinc-300">{anthropicBaseUrl()}</code>.
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#141414] p-4">
        <label className="grid gap-1.5 text-[13px] text-zinc-400">
          API key
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="sk-orbit-..."
            autoComplete="off"
            className="rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[13px] text-white outline-none placeholder:text-zinc-600 focus:border-white/25"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[13px] text-zinc-400">
            Model
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-[13px] text-white outline-none focus:border-white/25"
            />
          </label>
          <label className="grid gap-1.5 text-[13px] text-zinc-400">
            Prompt
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="rounded-lg border border-white/10 bg-black px-3 py-2 text-[13px] text-white outline-none focus:border-white/25"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SdkPanel
          title="OpenAI SDK"
          subtitle='client.chat.completions.create({ stream: true })'
          state={openai}
          onSubmit={(event) => onSubmit(event, "openai")}
          onStop={() => openaiAbort.current?.abort()}
        />
        <SdkPanel
          title="Anthropic SDK"
          subtitle="client.messages.create({ stream: true })"
          state={anthropic}
          onSubmit={(event) => onSubmit(event, "anthropic")}
          onStop={() => anthropicAbort.current?.abort()}
        />
      </div>
    </div>
  );
}

function SdkPanel({
  title,
  subtitle,
  state,
  onSubmit,
  onStop,
}: {
  title: string;
  subtitle: string;
  state: PanelState;
  onSubmit: (event: FormEvent) => void;
  onStop: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-[420px] flex-col rounded-2xl border border-white/10 bg-[#141414] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium">{title}</h2>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">{subtitle}</p>
        </div>
        {state.streaming ? (
          <Button type="button" variant="outline" size="sm" onClick={onStop}>
            Stop
          </Button>
        ) : (
          <Button type="submit" size="sm">
            Stream
          </Button>
        )}
      </div>
      <pre
        className={cn(
          "mt-4 min-h-0 flex-1 overflow-auto whitespace-pre-wrap rounded-xl bg-black p-3 font-mono text-[13px] leading-relaxed",
          state.error ? "text-red-400" : "text-zinc-200"
        )}
      >
        {state.error ?? (state.output || (state.streaming ? "…" : "Output will stream here."))}
      </pre>
    </form>
  );
}
