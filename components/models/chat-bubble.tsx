import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { VendorLogo } from "@/components/models/vendor-logo";
import type { PlaygroundStoredMessage } from "@/lib/playground";

export function ChatBubble({
  message,
  vendor,
  streaming,
}: {
  message: PlaygroundStoredMessage;
  vendor: string;
  streaming: boolean;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-white/10 px-3.5 py-2 text-[14px] leading-relaxed whitespace-pre-wrap text-white">
          {message.content}
        </div>
      </div>
    );
  }

  const waiting = streaming && message.content === "";

  return (
    <div className="flex items-start gap-2.5">
      <VendorLogo vendor={vendor} className="mt-0.5 size-6" />
      <div className="min-w-0 flex-1 text-[14px] leading-relaxed text-zinc-200">
        {waiting ? (
          <span className="inline-flex gap-1 pt-2">
            <span className="size-1.5 animate-pulse rounded-full bg-zinc-500" />
            <span className="size-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:120ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:240ms]" />
          </span>
        ) : (
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.content}
          </Markdown>
        )}
      </div>
    </div>
  );
}

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-white underline underline-offset-2">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mt-3 mb-2 text-[16px] font-semibold text-white first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-3 mb-2 text-[15px] font-semibold text-white first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-3 mb-1.5 text-[14px] font-semibold text-white first:mt-0">{children}</h3>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mb-2 border-l-2 border-white/20 pl-3 text-zinc-400 last:mb-0">{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-white/10" />,
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-[13px]">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-white/10 px-2 py-1 text-left font-medium text-white">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-white/5 px-2 py-1 align-top">{children}</td>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg border border-white/10 bg-black px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-zinc-300 last:mb-0">
      {children}
    </pre>
  ),
  code: ({ className, children }: { className?: string; children?: ReactNode }) => {
    if (className) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12.5px] text-zinc-100">{children}</code>
    );
  },
};
