import { getStoredOrganizationId } from "@/lib/api";

export type PlaygroundMessage = {
  role: "user" | "assistant";
  content: string;
};

export class PlaygroundError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PlaygroundError";
    this.status = status;
  }
}

export async function streamPlaygroundChat(
  modelSlug: string,
  messages: PlaygroundMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
) {
  const organizationId = getStoredOrganizationId();
  const response = await fetch(`/api/playground/models/${encodeURIComponent(modelSlug)}/chat`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
      ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
    },
    body: JSON.stringify({
      messages,
      stream: true,
      max_tokens: 2048,
    }),
    signal,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // keep the status fallback
    }
    throw new PlaygroundError(message, response.status);
  }

  if (!response.body) {
    throw new PlaygroundError("empty response", response.status);
  }

  await readContentDeltas(response.body, onDelta);
}

async function readContentDeltas(body: ReadableStream<Uint8Array>, onDelta: (text: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let separator = buffer.indexOf("\n\n");
    while (separator !== -1) {
      const block = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      emitDelta(block, onDelta);
      separator = buffer.indexOf("\n\n");
    }
  }

  if (buffer.trim()) {
    emitDelta(buffer, onDelta);
  }
}

function emitDelta(block: string, onDelta: (text: string) => void) {
  let event = "message";
  const dataLines: string[] = [];
  for (const rawLine of block.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }
  if (event !== "contentBlockDelta" || dataLines.length === 0) return;

  try {
    const payload = JSON.parse(dataLines.join("\n")) as {
      delta?: { text?: string };
    };
    const text = payload.delta?.text;
    if (typeof text === "string" && text.length > 0) {
      onDelta(text);
    }
  } catch {
    // ignore malformed frames
  }
}
