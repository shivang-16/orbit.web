export const ACTIVE_ORG_STORAGE_KEY = "orbit.activeOrganizationId";

export function getStoredOrganizationId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACTIVE_ORG_STORAGE_KEY) ?? "";
}

export function setStoredOrganizationId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, id);
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
    throw new Error(`API ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
