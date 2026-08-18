/**
 * Browser → /api/playground/models/:id/chat → orbit.api playground
 * (Clerk JWT). Streams SSE through without buffering so tokens arrive
 * as they are generated. The generic /api/proxy path reads the whole
 * backend body first, which would freeze a streamed completion.
 */

import { auth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

export const maxDuration = 300;
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return Response.json({ error: "NEXT_PUBLIC_API_BASE_URL is not set" }, { status: 500 });
  }

  const { id } = await context.params;
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Accept: "text/event-stream",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const organizationId = req.headers.get("x-organization-id");
  if (organizationId) {
    headers["X-Organization-Id"] = organizationId;
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${API_BASE_URL}/api/v1/playground/models/${encodeURIComponent(id)}/chat`, {
      method: "POST",
      headers,
      body: await req.text(),
      signal: req.signal,
    });
  } catch (err) {
    if (req.signal.aborted) {
      return new Response(null, { status: 499 });
    }
    return Response.json({ error: "Backend unreachable", detail: String(err) }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const contentType = backendRes.headers.get("content-type");
  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }
  responseHeaders.set("cache-control", "no-cache, no-transform");
  responseHeaders.set("x-accel-buffering", "no");

  return new Response(backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}
