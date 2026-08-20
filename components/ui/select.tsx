"use client";

import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";

export type SelectOption<T extends string | number = string> = {
  value: T;
  label: string;
};

export function Select<T extends string | number>({
  value,
  onValueChange,
  options,
  placeholder = "Select",
  disabled = false,
  displayValue,
  ariaLabel,
  className,
  contentClassName,
  align = "start",
  variant = "field",
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  displayValue?: string;
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  variant?: "field" | "compact";
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "outline-none disabled:cursor-not-allowed disabled:opacity-50",
            variant === "field"
              ? "flex h-9 w-full items-center justify-between rounded-lg border border-white/10 bg-black px-3 text-left text-[13px] font-normal text-white hover:border-white/15 focus:border-white/20"
              : "inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[13px] text-zinc-200 transition-colors hover:bg-white/5",
            className
          )}
        >
          <span className="min-w-0 truncate">
            {displayValue ?? selected?.label ?? placeholder}
          </span>
          <CaretDownIcon size={12} className="shrink-0 text-zinc-500" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={6}
          className={cn(
            "z-[70] overflow-hidden rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl",
            variant === "field"
              ? "w-[var(--radix-dropdown-menu-trigger-width)]"
              : "min-w-[var(--radix-dropdown-menu-trigger-width)]",
            contentClassName
          )}
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={String(option.value)}
              onSelect={() => onValueChange(option.value)}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
            >
              {option.label}
              {option.value === value ? (
                <CheckIcon size={12} className="shrink-0 text-zinc-400" />
              ) : (
                <span className="size-3 shrink-0" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
