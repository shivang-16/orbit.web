"use client";

import { ImageIcon, SquaresFourIcon, TextAaIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export type ModalityKey = "all" | "text" | "image";

const TAB_META: { key: ModalityKey; label: string; icon: Icon }[] = [
  { key: "all", label: "All", icon: SquaresFourIcon },
  { key: "text", label: "Text", icon: TextAaIcon },
  { key: "image", label: "Image", icon: ImageIcon },
];

export function ModalityTabs({
  active,
  onChange,
  counts,
}: {
  active: ModalityKey;
  onChange: (value: ModalityKey) => void;
  counts: Record<ModalityKey, number>;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-white/10">
      {TAB_META.filter((tab) => counts[tab.key] > 0).map((tab) => {
        const TabIcon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] transition-colors ${
              isActive
                ? "border-white text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <TabIcon size={13} weight={isActive ? "bold" : "regular"} />
            {tab.label}
            <span className="text-xs text-zinc-600">{counts[tab.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
