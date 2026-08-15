import {
  FileTextIcon,
  ImageIcon,
  SpeakerHighIcon,
  TextAaIcon,
  VideoCameraIcon,
  type Icon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type ModalityMeta = {
  label: string;
  icon: Icon;
  className: string;
};

const MODALITY_META: Record<string, ModalityMeta> = {
  text: {
    label: "Text",
    icon: TextAaIcon,
    className: "bg-blue-500/15 text-blue-400",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    className: "bg-fuchsia-500/15 text-fuchsia-400",
  },
  audio: {
    label: "Audio",
    icon: SpeakerHighIcon,
    className: "bg-emerald-500/15 text-emerald-400",
  },
  video: {
    label: "Video",
    icon: VideoCameraIcon,
    className: "bg-orange-500/15 text-orange-400",
  },
};

const FALLBACK_META: ModalityMeta = {
  label: "Other",
  icon: FileTextIcon,
  className: "bg-zinc-500/15 text-zinc-400",
};

export function ModalityBadge({ modality, size = 18 }: { modality: string; size?: number }) {
  const meta = MODALITY_META[modality] ?? FALLBACK_META;
  const ModalityIcon = meta.icon;

  return (
    <span
      title={meta.label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md",
        meta.className
      )}
      style={{ width: size, height: size }}
    >
      <ModalityIcon size={size * 0.6} weight="bold" />
    </span>
  );
}

export function ModalityBadgeList({
  modalities,
  size,
  className,
}: {
  modalities: string[];
  size?: number;
  className?: string;
}) {
  if (modalities.length === 0) return <span className="text-zinc-600">—</span>;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {modalities.map((value) => (
        <ModalityBadge key={value} modality={value} size={size} />
      ))}
    </span>
  );
}
