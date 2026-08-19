import { cn } from "@/lib/utils";

const VENDOR_LOGOS: Record<string, string> = {
  anthropic: "/vendors/anthropic.svg",
  openai: "/vendors/openai.svg",
  moonshot: "/vendors/moonshot.svg",
  mistral: "/vendors/mistral.svg",
  deepseek: "/vendors/deepseek.svg",
  google: "/vendors/google.svg",
  meta: "/vendors/meta.svg",
  minimax: "/vendors/minimax.svg",
  qwen: "/vendors/qwen.svg",
};

export function VendorLogo({
  vendor,
  className,
}: {
  vendor: string;
  className?: string;
}) {
  const src = VENDOR_LOGOS[vendor];
  const initial = vendor.charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md",
        vendor === "openai" || vendor === "google"
          ? "bg-white/10 text-white"
          : "bg-transparent",
        className
      )}
      aria-hidden
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-contain" />
      ) : (
        <span className="text-[11px] font-semibold uppercase text-zinc-300">{initial}</span>
      )}
    </span>
  );
}
