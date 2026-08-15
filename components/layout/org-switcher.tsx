"use client";

import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "radix-ui";

const DEFAULT_ORGANIZATION = "Default Organization";

export function OrgSwitcher() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-white/10 px-2.5 py-2 text-sm font-medium text-white transition-colors outline-none hover:border-white/20 hover:bg-white/5 aria-expanded:border-white/20 aria-expanded:bg-white/5"
        >
          <span className="truncate">{DEFAULT_ORGANIZATION}</span>
          <CaretUpDownIcon size={14} className="shrink-0 text-zinc-500" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl"
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm text-white outline-none data-[highlighted]:bg-white/10"
          >
            {DEFAULT_ORGANIZATION}
            <CheckIcon size={14} />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
