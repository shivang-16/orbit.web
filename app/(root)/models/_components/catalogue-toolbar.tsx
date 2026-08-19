"use client";

import {
  BuildingsIcon,
  CaretDownIcon,
  FunnelIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { DropdownMenu } from "radix-ui";

import { vendorLabel } from "@/components/models/model-identity";
import { Button } from "@/components/ui/button";
import type { CatalogueTagSummary } from "@/lib/catalogue";
import { tagLabel } from "@/lib/tags";

export type ViewKey = "list" | "table";

export type CatalogueVendorSummary = {
  vendor: string;
  count: number;
};

export function CatalogueToolbar({
  search,
  onSearchChange,
  vendor,
  onVendorChange,
  vendorOptions,
  tag,
  onTagChange,
  tagOptions,
  view,
  onViewChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  vendor: string;
  onVendorChange: (value: string) => void;
  vendorOptions: CatalogueVendorSummary[];
  tag: string;
  onTagChange: (value: string) => void;
  tagOptions: CatalogueTagSummary[];
  view: ViewKey;
  onViewChange: (value: ViewKey) => void;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="relative min-w-0 flex-1 md:max-w-xs">
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

        <ViewToggle
          view={view}
          onViewChange={onViewChange}
          iconOnly
          className="md:hidden"
        />

        <div className="hidden items-center gap-2 md:flex">
          <VendorFilter
            vendor={vendor}
            onVendorChange={onVendorChange}
            vendorOptions={vendorOptions}
          />
          <TagFilter tag={tag} onTagChange={onTagChange} tagOptions={tagOptions} />
        </div>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <VendorFilter
          vendor={vendor}
          onVendorChange={onVendorChange}
          vendorOptions={vendorOptions}
        />
        <TagFilter tag={tag} onTagChange={onTagChange} tagOptions={tagOptions} />
      </div>

      <ViewToggle
        view={view}
        onViewChange={onViewChange}
        className="hidden md:flex"
      />
    </div>
  );
}

function VendorFilter({
  vendor,
  onVendorChange,
  vendorOptions,
}: {
  vendor: string;
  onVendorChange: (value: string) => void;
  vendorOptions: CatalogueVendorSummary[];
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button type="button" variant="outline" className="text-zinc-300">
          <BuildingsIcon size={14} className="text-zinc-400" />
          {vendor ? vendorLabel(vendor) : "All vendors"}
          <CaretDownIcon size={11} className="text-zinc-400" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 max-h-72 min-w-[12rem] overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl"
        >
          <DropdownMenu.Item
            onSelect={() => onVendorChange("")}
            className="cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
          >
            All vendors
          </DropdownMenu.Item>
          {vendorOptions.map((option) => (
            <DropdownMenu.Item
              key={option.vendor}
              onSelect={() => onVendorChange(option.vendor)}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
            >
              {vendorLabel(option.vendor)}
              <span className="text-xs text-zinc-400">{option.count}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function TagFilter({
  tag,
  onTagChange,
  tagOptions,
}: {
  tag: string;
  onTagChange: (value: string) => void;
  tagOptions: CatalogueTagSummary[];
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button type="button" variant="outline" className="text-zinc-300">
          <FunnelIcon size={14} className="text-zinc-400" />
          {tag ? tagLabel(tag) : "All tags"}
          <CaretDownIcon size={11} className="text-zinc-400" />
        </Button>
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
  );
}

function ViewToggle({
  view,
  onViewChange,
  iconOnly = false,
  className,
}: {
  view: ViewKey;
  onViewChange: (value: ViewKey) => void;
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center rounded-lg border border-white/10 bg-[#0b0b0c] p-0.5 ${className ?? ""}`}
    >
      <ViewToggleButton
        active={view === "list"}
        onClick={() => onViewChange("list")}
        icon={ListBulletsIcon}
        label="List"
        iconOnly={iconOnly}
      />
      <ViewToggleButton
        active={view === "table"}
        onClick={() => onViewChange("table")}
        icon={TableIcon}
        label="Table"
        iconOnly={iconOnly}
      />
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
  iconOnly,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ListBulletsIcon;
  label: string;
  iconOnly: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={iconOnly ? "icon-sm" : "sm"}
      onClick={onClick}
      aria-label={label}
      className={active ? "bg-white/10 text-white" : "text-zinc-400"}
    >
      <Icon size={13} />
      {iconOnly ? null : label}
    </Button>
  );
}
