import { apiFetch } from "@/lib/api";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_by: string;
  plan_slug?: string;
  created_at: string;
  updated_at: string;
};

export function isDefaultOrganization(org: Organization) {
  return org.name === "Default Organization" || /^default-[0-9a-f]{8}$/i.test(org.slug);
}

export function sortOrganizations(orgs: Organization[]) {
  return [...orgs].sort((left, right) => {
    const delta = defaultOrgRank(left) - defaultOrgRank(right);
    if (delta !== 0) return delta;
    return Date.parse(left.created_at) - Date.parse(right.created_at);
  });
}

export function defaultOrganization(orgs: Organization[]) {
  return sortOrganizations(orgs)[0] ?? null;
}

function defaultOrgRank(org: Organization) {
  if (org.name === "Default Organization") return 0;
  if (/^default-[0-9a-f]{8}$/i.test(org.slug)) return 1;
  return 2;
}

export type OrgEntitlement = {
  plan_slug: string;
  organization_count: number;
  max_organizations: number | null;
  max_members_per_org: number | null;
  unlimited_organizations: boolean;
  unlimited_members: boolean;
  can_create_organization: boolean;
};

export type OrganizationList = {
  organizations: Organization[];
  total: number;
  entitlement: OrgEntitlement;
};

export type OrgMember = {
  id: string;
  organization_id: string;
  user_id: string;
  email: string;
  name: string;
  image_url: string;
  role: "admin" | "member";
  created_at: string;
};

export type MemberEntitlement = {
  plan_slug: string;
  member_count: number;
  max_members_per_org: number | null;
  unlimited_members: boolean;
  can_add_member: boolean;
};

export type MemberList = {
  members: OrgMember[];
  total: number;
  role: "admin" | "member";
  entitlement: MemberEntitlement;
};

export function fetchOrganizations() {
  return apiFetch("/organizations") as Promise<OrganizationList>;
}

export async function createOrganization(name: string, description: string) {
  const raw = (await apiFetch("/organizations", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  })) as { organization: Organization; entitlement: OrgEntitlement };
  return raw;
}

export function fetchMembers() {
  return apiFetch("/organizations/members") as Promise<MemberList>;
}

export function addMember(email: string, role: "admin" | "member" = "member") {
  return apiFetch("/organizations/members", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  }) as Promise<{ member: OrgMember; entitlement: MemberEntitlement }>;
}

export async function updateOrganization(name: string, description: string) {
  const raw = (await apiFetch("/organizations", {
    method: "PATCH",
    body: JSON.stringify({ name, description }),
  })) as { organization: Organization };
  return raw.organization;
}
