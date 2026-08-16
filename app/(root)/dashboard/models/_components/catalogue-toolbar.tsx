"use client";

import {
  CaretDownIcon,
  FunnelIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  SortAscendingIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { DropdownMenu } from "radix-ui";

import type { CatalogueTagSummary } from "@/lib/catalogue";
import { tagLabel } from "@/lib/tags";

export type SortKey = "newest" | "name";
export type ViewKey = "list" | "table";

const SORT_LABEL: Record<SortKey, string> = {
  newest: "Newest",
  name: "Name (A–Z)",
};

export function CatalogueToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  tag,
  onTagChange,
  tagOptions,
  view,
  onViewChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  tag: string;
  onTagChange: (value: string) => void;
  tagOptions: CatalogueTagSummary[];
  view: ViewKey;
  onViewChange: (value: ViewKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <MagnifyingGlassIcon
            size={14}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search models"
            className="h-8 w-full rounded-lg border border-white/10 bg-[#0b0b0c] pl-8 pr-3 text-[13px] text-white outline-none placeholder:text-zinc-400 focus:border-white/20"
          />
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b0b0c] px-2.5 text-[13px] text-zinc-300 transition-colors outline-none hover:border-white/20 hover:text-white aria-expanded:border-white/20"
            >
              <SortAscendingIcon size={14} className="text-zinc-400" />
              {SORT_LABEL[sort]}
              <CaretDownIcon size={11} className="text-zinc-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={6}
              className="z-50 min-w-[10rem] rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl"
            >
              {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                <DropdownMenu.Item
                  key={key}
                  onSelect={() => onSortChange(key)}
                  className="cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
                >
                  {SORT_LABEL[key]}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b0b0c] px-2.5 text-[13px] text-zinc-300 transition-colors outline-none hover:border-white/20 hover:text-white aria-expanded:border-white/20"
            >
              <FunnelIcon size={14} className="text-zinc-400" />
              {tag ? tagLabel(tag) : "All tags"}
              <CaretDownIcon size={11} className="text-zinc-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={6}
              className="z-50 max-h-72 min-w-[12rem] overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl"
            >
              <DropdownMenu.Item
                onSelect={() => onTagChange("")}
                className="cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
              >
                All tags
              </DropdownMenu.Item>
              {tagOptions.map((option) => (
                <DropdownMenu.Item
                  key={option.tag}
                  onSelect={() => onTagChange(option.tag)}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
                >
                  {tagLabel(option.tag)}
                  <span className="text-xs text-zinc-400">{option.count}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-white/10 bg-[#0b0b0c] p-0.5">
          <ViewToggleButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
            icon={ListBulletsIcon}
            label="List"
          />
          <ViewToggleButton
            active={view === "table"}
            onClick={() => onViewChange("table")}
            icon={TableIcon}
            label="Table"
          />
        </div>
      </div>
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ListBulletsIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors ${
        active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-300"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
