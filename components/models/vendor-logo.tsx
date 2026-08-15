import { cn } from "@/lib/utils";

const VENDOR_LOGOS: Record<string, string> = {
  anthropic: "/vendors/anthropic.svg",
  openai: "/vendors/openai.svg",
  moonshot: "/vendors/moonshot.png",
  mistral: "/vendors/mistral.png",
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
        vendor === "openai" ? "bg-white/10 text-white" : "bg-transparent",
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
