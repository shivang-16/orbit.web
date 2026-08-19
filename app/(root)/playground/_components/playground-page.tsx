"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowUpIcon, CaretDownIcon, SquareIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "radix-ui";

import { ChatBubble } from "@/components/models/chat-bubble";
import { vendorLabel } from "@/components/models/model-identity";
import { VendorLogo } from "@/components/models/vendor-logo";
import { Loader } from "@/components/ui/loader";
import { fetchCatalogue, type CatalogueModel } from "@/lib/catalogue";
import {
  clearPlaygroundThread,
  loadPlaygroundThread,
  PlaygroundError,
  savePlaygroundThread,
  streamPlaygroundChat,
  type PlaygroundStoredMessage,
} from "@/lib/playground";
import { cn } from "@/lib/utils";

const DEFAULT_MODEL_SLUG = "claude-sonnet-5";
const SELECTED_MODEL_KEY = "orbit.playground.selected-model";

export function PlaygroundPage() {
  const [models, setModels] = useState<CatalogueModel[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(DEFAULT_MODEL_SLUG);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<PlaygroundStoredMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const skipSaveRef = useRef(true);
  const skipLoadRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogue()
      .then((data) => {
        if (cancelled) return;
        setModels(data.models);
        const stored = window.localStorage.getItem(SELECTED_MODEL_KEY);
        const next =
          pickModel(data.models, stored) ??
          pickModel(data.models, DEFAULT_MODEL_SLUG) ??
          data.models[0];
        if (next) setSelectedSlug(next.slug);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load models.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => models?.find((model) => model.slug === selectedSlug) ?? models?.[0] ?? null,
    [models, selectedSlug]
  );

  const groupedModels = useMemo(() => groupByVendor(models ?? []), [models]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => {
    if (!selected) return;
    skipSaveRef.current = true;
    if (skipLoadRef.current) {
      skipLoadRef.current = false;
      setMessages([]);
    } else {
      setMessages(loadPlaygroundThread(selected.slug));
    }
    setError(null);
  }, [selected?.slug]);

  useEffect(() => {
    if (!selected) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    savePlaygroundThread(selected.slug, messages);
  }, [selected?.slug, messages]);

  function selectModel(slug: string) {
    if (slug === selectedSlug) return;
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
    clearPlaygroundThread(selectedSlug);
    skipLoadRef.current = true;
    skipSaveRef.current = true;
    setMessages([]);
    setSelectedSlug(slug);
    window.localStorage.setItem(SELECTED_MODEL_KEY, slug);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming || !selected) return;

    const userMessage: PlaygroundStoredMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const assistantId = crypto.randomUUID();
    const history = [...messages, userMessage];
    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setError(null);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamPlaygroundChat(
        selected.slug,
        history.map(({ role, content: value }) => ({ role, content: value })),
        (delta) => {
          setMessages((current) =>
            current.map((item) =>
              item.id === assistantId ? { ...item, content: item.content + delta } : item
            )
          );
        },
        controller.signal
      );
    } catch (err) {
      if (controller.signal.aborted) {
        setMessages((current) =>
          current.filter((item) => item.id !== assistantId || item.content.trim() !== "")
        );
      } else {
        const message =
          err instanceof PlaygroundError
            ? err.status === 402
              ? "Low on credits. Add credits to keep chatting."
              : err.status === 429
                ? "Too many requests. Wait a moment and try again."
                : err.message
            : "Could not reach this model.";
        setError(message);
        setMessages((current) =>
          current.filter((item) => item.id !== assistantId || item.content.trim() !== "")
        );
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setStreaming(false);
      textareaRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <p className="text-[13px] text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!models || !selected) {
    return <Loader />;
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      {empty ? null : (
        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-8">
            {messages.map((item) => (
              <ChatBubble
                key={item.id}
                message={item}
                vendor={selected.vendor}
                streaming={streaming}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "mx-auto flex w-full max-w-2xl flex-col px-4",
          empty ? "flex-1 items-center justify-center pb-24" : "pb-6"
        )}
      >
        {empty ? (
          <p className="mb-8 font-mono text-[28px] font-medium tracking-tight text-white">orbit</p>
        ) : null}

        {error ? (
          <p className="mb-3 w-full text-[13px] text-red-400">
            {error}
            {error.includes("credits") ? (
              <>
                {" "}
                <Link href="/billing/credits" className="underline underline-offset-2">
                  Add credits
                </Link>
              </>
            ) : null}
          </p>
        ) : null}

        <form
          onSubmit={onSubmit}
          className="w-full rounded-[28px] border border-white/10 bg-[#141414] px-4 pt-3.5 pb-3"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              event.target.style.height = "auto";
              event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`;
            }}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask anything"
            disabled={streaming}
            className="max-h-40 min-h-12 w-full resize-none bg-transparent text-[15px] leading-relaxed text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <ModelSwitcher
              selected={selected}
              groups={groupedModels}
              onSelect={selectModel}
              disabled={streaming}
            />
            {streaming ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                aria-label="Stop generating"
                className="flex size-9 items-center justify-center rounded-full bg-[#d6c7b2] text-black transition-colors hover:bg-[#e4d6c2]"
              >
                <SquareIcon size={12} weight="fill" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex size-9 items-center justify-center rounded-full bg-[#d6c7b2] text-black transition-colors hover:bg-[#e4d6c2] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
              >
                <ArrowUpIcon size={16} weight="bold" />
              </button>
            )}
          </div>
        </form>
        <p className="mt-3 text-center text-[12px] text-zinc-500">
          This is a temporary chat and will be cleared when you switch models.
        </p>
      </div>
    </div>
  );
}

function ModelSwitcher({
  selected,
  groups,
  onSelect,
  disabled,
}: {
  selected: CatalogueModel;
  groups: { vendor: string; models: CatalogueModel[] }[];
  onSelect: (slug: string) => void;
  disabled: boolean;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] text-zinc-300 transition-colors hover:bg-white/5 disabled:opacity-50"
        >
          <VendorLogo vendor={selected.vendor} className="size-5" />
          <span className="max-w-[160px] truncate">{selected.name}</span>
          <CaretDownIcon size={12} className="text-zinc-500" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 max-h-80 w-72 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 p-1 shadow-xl"
        >
          {groups.map((group) => (
            <div key={group.vendor} className="py-1">
              <p className="px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                {vendorLabel(group.vendor)}
              </p>
              {group.models.map((model) => (
                <DropdownMenu.Item
                  key={model.id}
                  onSelect={() => onSelect(model.slug)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10",
                    model.slug === selected.slug && "bg-white/5"
                  )}
                >
                  <VendorLogo vendor={model.vendor} className="size-5" />
                  <span className="min-w-0 truncate">{model.name}</span>
                </DropdownMenu.Item>
              ))}
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function pickModel(models: CatalogueModel[], slug: string | null) {
  if (!slug) return undefined;
  return models.find((model) => model.slug === slug);
}

function groupByVendor(models: CatalogueModel[]) {
  const groups: { vendor: string; models: CatalogueModel[] }[] = [];
  const index = new Map<string, number>();
  for (const model of models) {
    const existing = index.get(model.vendor);
    if (existing === undefined) {
      index.set(model.vendor, groups.length);
      groups.push({ vendor: model.vendor, models: [model] });
    } else {
      groups[existing].models.push(model);
    }
  }
  return groups;
}
