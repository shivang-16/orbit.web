"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowUpIcon, FlaskIcon, SquareIcon, XIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { ChatBubble } from "@/components/models/chat-bubble";
import { Button } from "@/components/ui/button";
import {
  clearPlaygroundThread,
  loadPlaygroundThread,
  PlaygroundError,
  savePlaygroundThread,
  streamPlaygroundChat,
  type PlaygroundStoredMessage,
} from "@/lib/playground";
import { cn } from "@/lib/utils";

const DEFAULT_WIDTH = 480;
const MIN_WIDTH = 380;
const MAX_WIDTH_RATIO = 0.85;

type ChatItem = PlaygroundStoredMessage;

export function PlaygroundDrawer({
  open,
  onOpenChange,
  modelSlug,
  modelName,
  vendor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelSlug: string;
  modelName: string;
  vendor: string;
}) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const skipSaveRef = useRef(true);

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

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => {
    skipSaveRef.current = true;
    setMessages(loadPlaygroundThread(modelSlug));
    setError(null);
  }, [modelSlug]);

  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    savePlaygroundThread(modelSlug, messages);
  }, [modelSlug, messages]);

  useEffect(() => {
    if (open) {
      textareaRef.current?.focus();
      return;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;

    const userMessage: ChatItem = { id: crypto.randomUUID(), role: "user", content };
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
        modelSlug,
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

  function newChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    skipSaveRef.current = true;
    clearPlaygroundThread(modelSlug);
    setMessages([]);
    setInput("");
    setError(null);
    setStreaming(false);
    textareaRef.current?.focus();
  }

  function stop() {
    abortRef.current?.abort();
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

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
            <div className="min-w-0">
              <Dialog.Title className="text-[16px] font-medium text-white">Playground</Dialog.Title>
              <Dialog.Description className="mt-0.5 truncate text-[13px] text-zinc-400">
                {modelName}
              </Dialog.Description>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {messages.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={newChat}
                  className="h-7 px-2 text-[12px] text-zinc-400 hover:text-white"
                >
                  New chat
                </Button>
              ) : null}
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon-xs" className="shrink-0 text-zinc-400">
                  <XIcon size={16} />
                </Button>
              </Dialog.Close>
            </div>
          </div>

          <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                  <FlaskIcon size={18} />
                </span>
                <p className="mt-3 text-[14px] text-zinc-400">Enter a prompt to try {modelName}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((item) => (
                  <ChatBubble key={item.id} message={item} vendor={vendor} streaming={streaming} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 pt-3 pb-4">
            {error ? (
              <p className="mb-2 text-[13px] text-red-400">
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

            <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-black px-3 py-2.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  event.target.style.height = "auto";
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 144)}px`;
                }}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Enter your message..."
                disabled={streaming}
                className="max-h-36 min-h-10 w-full resize-none bg-transparent text-[14px] leading-relaxed text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
              />
              <div className="mt-1 flex justify-end">
                {streaming ? (
                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Stop generating"
                    className="flex size-8 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-zinc-200"
                  >
                    <SquareIcon size={11} weight="fill" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="flex size-8 items-center justify-center rounded-full bg-lime-400 text-black transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
                  >
                    <ArrowUpIcon size={14} weight="bold" />
                  </button>
                )}
              </div>
            </form>

            <p className="mt-3 text-center text-[11px] text-zinc-500">
              Responses are AI-generated. Verify before relying on them.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
