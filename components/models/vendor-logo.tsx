import { MoonStarsIcon, OpenAiLogoIcon, SparkleIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const VENDOR_TILE: Record<string, string> = {
  anthropic: "bg-[#d97757]/15 text-[#e0906f]",
  openai: "bg-white/10 text-white",
  moonshot: "bg-[#6366f1]/15 text-indigo-300",
};

export function VendorLogo({
  vendor,
  className,
}: {
  vendor: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md",
        VENDOR_TILE[vendor] ?? "bg-white/10 text-zinc-300",
        className
      )}
      aria-hidden
    >
      <VendorGlyph vendor={vendor} />
    </span>
  );
}

function VendorGlyph({ vendor }: { vendor: string }) {
  if (vendor === "openai") {
    return <OpenAiLogoIcon size={14} />;
  }
  if (vendor === "moonshot") {
    return <MoonStarsIcon size={14} weight="fill" />;
  }
  if (vendor === "anthropic") {
    return <SparkleIcon size={14} weight="fill" />;
  }
  return <span className="text-[11px] font-semibold uppercase">{vendor.charAt(0)}</span>;
}
