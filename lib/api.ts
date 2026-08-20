export const ACTIVE_ORG_STORAGE_KEY = "orbit.activeOrganizationId";

export function getStoredOrganizationId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACTIVE_ORG_STORAGE_KEY) ?? "";
}

export function setStoredOrganizationId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, id);
}

export class APIError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = "") {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch(path: string, init?: RequestInit) {
  const organizationId = getStoredOrganizationId();
  const response = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new APIError(response.status, errorMessage(body, response.status), errorCode(body));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function errorMessage(body: unknown, status: number) {
  if (isRecord(body) && typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }
  return `API ${status}`;
}

function errorCode(body: unknown) {
  if (isRecord(body) && typeof body.code === "string") {
    return body.code;
  }
  return "";
}
