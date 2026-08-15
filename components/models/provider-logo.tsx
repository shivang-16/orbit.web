import { cn } from "@/lib/utils";

const PROVIDER_LOGOS: Record<string, string> = {
  bedrock: "/providers/Bedrock.svg",
};

export function ProviderLogo({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  const src = PROVIDER_LOGOS[provider];
  const initial = provider.charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/5",
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
