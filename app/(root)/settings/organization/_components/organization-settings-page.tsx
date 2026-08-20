"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { MagnifyingGlassIcon, PencilSimpleIcon } from "@phosphor-icons/react";

import { useOrg } from "@/components/org/org-context";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  fetchMembers,
  updateOrganization,
  type MemberList,
  type Organization,
  type OrgMember,
} from "@/lib/organizations";

import { AddMemberDialog } from "./add-member-dialog";

export function OrganizationSettingsPage() {
  const { activeOrganization, updateOrganization: patchOrg } = useOrg();
  const { user } = useUser();
  const [data, setData] = useState<MemberList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!activeOrganization) {
      setData(null);
      return;
    }
    setData(null);
    fetchMembers()
      .then((next) => {
        setData(next);
        setError(null);
      })
      .catch(() => {
        setError("Could not load organization.");
      });
  }, [activeOrganization]);

  useEffect(() => {
    load();
  }, [load]);

  const isAdmin = data?.role === "admin";
  const isOwner = Boolean(user?.id && activeOrganization?.created_by === user.id);
  const myRole = isOwner ? "Owner" : data?.role === "admin" ? "Admin" : "Member";

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[12px] text-zinc-500">Settings</p>
      <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white">Organization</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        Details and members for {activeOrganization?.name ?? "this organization"}.
      </p>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : !activeOrganization || data === null ? (
        <Loader />
      ) : (
        <div className="mt-6 space-y-4">
          <OrgDetailsCard
            name={activeOrganization.name}
            description={activeOrganization.description}
            role={myRole}
            canEdit={isAdmin}
            onSaved={patchOrg}
          />
          <MembersCard
            members={data.members}
            ownerId={activeOrganization.created_by}
            canAdd={Boolean(isAdmin && data.entitlement.can_add_member)}
            atLimit={Boolean(
              isAdmin && !data.entitlement.can_add_member && !data.entitlement.unlimited_members
            )}
            isOwner={isOwner}
            seatCopy={memberLimitCopy(data)}
            onAdded={load}
          />
        </div>
      )}
    </div>
  );
}

function OrgDetailsCard({
  name,
  description,
  role,
  canEdit,
  onSaved,
}: {
  name: string;
  description: string;
  role: string;
  canEdit: boolean;
  onSaved: (org: Organization) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftDescription, setDraftDescription] = useState(description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setDraftName(name);
      setDraftDescription(description);
    }
  }, [name, description, editing]);

  async function save() {
    if (!draftName.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const org = await updateOrganization(draftName.trim(), draftDescription.trim());
      onSaved(org);
      setEditing(false);
    } catch {
      setError("Could not save organization details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 className="text-[15px] font-medium text-white">Organization details</h2>
        {canEdit && !editing ? (
          <Button type="button" variant="outline" onClick={() => setEditing(true)}>
            <PencilSimpleIcon size={14} />
            Edit
          </Button>
        ) : null}
        {editing ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? <Loader size="sm" className="py-0" /> : "Save"}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10">
        <DetailRow label="Name">
          {editing ? (
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-black px-3 text-[13px] text-white outline-none focus:border-white/20"
            />
          ) : (
            <p className="rounded-lg border border-white/10 bg-black px-3 py-2 text-[13px] text-white">
              {name}
            </p>
          )}
        </DetailRow>
        <DetailRow label="Description">
          {editing ? (
            <textarea
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-black px-3 py-2 text-[13px] text-white outline-none focus:border-white/20"
            />
          ) : (
            <p className="rounded-lg border border-white/10 bg-black px-3 py-2 text-[13px] text-white">
              {description.trim() ? description : <span className="text-zinc-500">No description</span>}
            </p>
          )}
        </DetailRow>
        <DetailRow label="My role">
          <p className="rounded-lg border border-white/10 bg-black px-3 py-2 text-[13px] text-white">{role}</p>
        </DetailRow>
      </div>

      {error ? <p className="border-t border-white/10 px-4 py-3 text-[13px] text-red-400">{error}</p> : null}
    </section>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-white/5 px-4 py-3 first:border-t-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center">
      <p className="text-[12px] tracking-wide text-zinc-500 uppercase">{label}</p>
      {children}
    </div>
  );
}

function MembersCard({
  members,
  ownerId,
  canAdd,
  atLimit,
  isOwner,
  seatCopy,
  onAdded,
}: {
  members: OrgMember[];
  ownerId: string;
  canAdd: boolean;
  atLimit: boolean;
  isOwner: boolean;
  seatCopy: string;
  onAdded: () => void;
}) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      members.filter((member) => {
        if (!query) return true;
        return (
          member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
        );
      }),
    [members, query]
  );

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0c]">
      <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-medium text-white">Members ({members.length})</h2>
          {seatCopy ? <p className="mt-0.5 text-[12px] text-zinc-500">{seatCopy}</p> : null}
        </div>
        {canAdd ? (
          <AddMemberDialog onAdded={onAdded} />
        ) : atLimit && isOwner ? (
          <Button asChild>
            <Link href="/pricing">Upgrade to add members</Link>
          </Button>
        ) : atLimit ? (
          <p className="text-[12px] text-zinc-500">Ask the owner to upgrade to add members</p>
        ) : null}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="relative">
          <MagnifyingGlassIcon
            size={14}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by name or email..."
            aria-label="Filter members by name or email"
            className="h-9 w-full rounded-lg border border-white/10 bg-black pl-8 pr-3 text-[13px] text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto border-t border-white/10">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/10 text-xs tracking-wide text-zinc-500 uppercase">
              <th className="px-4 py-2.5 font-normal">Name</th>
              <th className="px-4 py-2.5 font-normal">Email</th>
              <th className="px-4 py-2.5 font-normal">Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-4 py-3 font-medium text-white">{member.name || member.email}</td>
                <td className="px-4 py-3 text-zinc-400">{member.email}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {member.user_id === ownerId ? "Owner" : member.role === "admin" ? "Admin" : "Member"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-500">
                  No members match that filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function memberLimitCopy(data: MemberList) {
  if (data.entitlement.unlimited_members) {
    return `${data.entitlement.member_count} members`;
  }
  const max = data.entitlement.max_members_per_org;
  if (max == null) return "";
  return `${data.entitlement.member_count} of ${max} seats used`;
}
