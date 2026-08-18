import { apiFetch } from "@/lib/api";

export type APIKeyExpiration = "never" | "30d" | "90d" | "1y";

export type APIKey = {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  key_preview: string;
  status: "active" | "inactive";
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
};

export type APIKeyList = {
  keys: APIKey[];
  total: number;
};

export type CreateAPIKeyResponse = {
  key: APIKey;
  secret: string;
};

export function fetchAPIKeys() {
  return apiFetch("/api-keys") as Promise<APIKeyList>;
}

export function createAPIKey(name: string, expiration: APIKeyExpiration) {
  return apiFetch("/api-keys", {
    method: "POST",
    body: JSON.stringify({ name, expiration }),
  }) as Promise<CreateAPIKeyResponse>;
}

export function deleteAPIKey(id: string) {
  return apiFetch(`/api-keys/${id}`, { method: "DELETE" });
}

export function formatKeyDate(value: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
