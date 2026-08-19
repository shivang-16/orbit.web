import { VendorLogo } from "@/components/models/vendor-logo";

const VENDOR_LABEL: Record<string, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  moonshot: "Moonshot AI",
  mistral: "Mistral AI",
  deepseek: "DeepSeek",
  google: "Google",
  meta: "Meta",
  minimax: "MiniMax",
  qwen: "Qwen",
};

export function vendorLabel(vendor: string) {
  return VENDOR_LABEL[vendor] ?? vendor;
}

export function ModelIdentity({
  name,
  vendor,
  showVendor = true,
}: {
  name: string;
  vendor: string;
  showVendor?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <VendorLogo vendor={vendor} />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm text-white">{name}</p>
        {showVendor ? (
          <p className="truncate text-xs text-zinc-400">{vendorLabel(vendor)}</p>
        ) : null}
      </div>
    </div>
  );
}
