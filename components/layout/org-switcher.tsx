"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CaretUpDownIcon, CheckIcon, PlusIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "radix-ui";

import { CreateOrgDialog } from "@/components/org/create-org-dialog";
import { useOrg } from "@/components/org/org-context";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

export function OrgSwitcher() {
  const { organizations, activeOrganization, entitlement, setActiveOrganizationId, loading } = useOrg();
  const [createOpen, setCreateOpen] = useState(false);
  const atCreateLimit = Boolean(entitlement && !entitlement.can_create_organization);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-auto w-full justify-between px-2.5 py-2 font-medium"
          >
            {activeOrganization?.name ? (
              <span className="truncate">{activeOrganization.name}</span>
            ) : loading ? (
              <Loader size="sm" className="py-0" />
            ) : (
              <span className="truncate">Select organization</span>
            )}
            <CaretUpDownIcon size={14} className="shrink-0 text-zinc-400" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl"
          >
            {organizations.map((org) => (
              <DropdownMenu.Item
                key={org.id}
                onSelect={() => setActiveOrganizationId(org.id)}
                className="flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm text-white outline-none data-[highlighted]:bg-white/10"
              >
                <span className="truncate">{org.name}</span>
                {org.id === activeOrganization?.id ? <CheckIcon size={14} /> : null}
              </DropdownMenu.Item>
            ))}

            <DropdownMenu.Separator className="my-1 h-px bg-white/10" />

            {loading ? null : atCreateLimit ? (
              <DropdownMenu.Item asChild>
                <Link
                  href="/pricing"
                  className="flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm text-zinc-300 outline-none data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
                >
                  Upgrade to create orgs
                  <ArrowRightIcon size={14} className="shrink-0 text-zinc-400" />
                </Link>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item
                onSelect={(event) => {
                  event.preventDefault();
                  setCreateOpen(true);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-zinc-300 outline-none data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
              >
                <PlusIcon size={14} />
                Create organization
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
