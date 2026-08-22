/**
 * Browser → /api/proxy/<path> → NEXT_PUBLIC_API_BASE_URL/api/v1/<path>
 *
 * Attaches the Clerk session JWT so the Go API can verify the user.
 * The browser never talks to orbit.api directly.
 */

import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
const API_VERSION_PREFIX = "/api/v1";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handleRequest(req: NextRequest, context: RouteContext) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_BASE_URL is not set" },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const targetPath = path.join("/");
  const targetUrl = `${API_BASE_URL}${API_VERSION_PREFIX}/${targetPath}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    Accept: req.headers.get("accept") ?? "application/json",
    "Content-Type": req.headers.get("content-type") ?? "application/json",
  };
  const organizationId = req.headers.get("x-organization-id");
  if (organizationId) {
    headers["X-Organization-Id"] = organizationId;
  }

  const { getToken } = await auth();
  const token = await getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: string | undefined;
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const text = await req.text();
    if (text) body = text;
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "follow",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Backend unreachable", detail: String(err) },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const contentType = backendRes.headers.get("content-type") ?? "";
  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }
  const disposition = backendRes.headers.get("content-disposition");
  if (disposition) {
    responseHeaders.set("content-disposition", disposition);
  }

  if (backendRes.status === 204 || backendRes.status === 205) {
    return new NextResponse(null, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  }

  const isBinary =
    contentType.includes("application/pdf") || contentType.includes("octet-stream");
  if (isBinary) {
    const buffer = await backendRes.arrayBuffer();
    return new NextResponse(buffer, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  }

  return new NextResponse(await backendRes.text(), {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
