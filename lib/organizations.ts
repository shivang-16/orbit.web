import { apiFetch } from "@/lib/api";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationList = {
  organizations: Organization[];
  total: number;
};

export function fetchOrganizations() {
  return apiFetch("/organizations") as Promise<OrganizationList>;
}

export async function createOrganization(name: string, description: string) {
  const raw = (await apiFetch("/organizations", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  })) as { organization: Organization };
  return raw.organization;
}
