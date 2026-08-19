import { ModelCallout } from "./model-callout";
import { ModelGlobe } from "./model-globe";

const SIGNALS = [
  { label: "Price per token", detail: "Bedrock list rate" },
  { label: "Provider health", detail: "Live" },
  { label: "Context window", detail: "Fits the request" },
  { label: "Modality", detail: "Text or image" },
];

const STATS = [
  { label: "Models", value: "50+" },
  { label: "Vendors", value: "9" },
  { label: "Markup", value: "0%" },
  { label: "Region", value: "us-east-1" },
];

export function RouterSection() {
  return (
    <section className="relative bg-black px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.035em] lg:text-[clamp(1.75rem,3vw,2.5rem)]">
          <span className="text-white">
            An intelligent router before every request.
          </span>{" "}
          <span className="text-zinc-500">
            You name a model, Orbit picks the cheapest healthy way to serve it.
          </span>
        </h2>

        <div className="relative mt-8 overflow-hidden rounded-2xl bg-[#09090b] sm:mt-12">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
            <p className="shrink-0 text-[12.5px] text-zinc-500">Routing</p>
            <p className="truncate font-mono text-[11px] text-zinc-600 sm:text-[12px]">
              POST /v1/chat/completions
            </p>
          </div>

          <div className="grid gap-px bg-white/[0.04] lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="relative min-h-[320px] overflow-hidden bg-[#09090b] sm:min-h-[400px] lg:min-h-[460px]">
              <ModelGlobe />
              <GlobeHub />
              <ModelCallout />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#09090b] sm:h-40"
              />
            </div>

            <aside className="bg-[#09090b] p-4 sm:p-5">
              <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Checked per request
              </p>
              <ul className="mt-4 space-y-3">
                {SIGNALS.map((item) => (
                  <li key={item.label}>
                    <p className="text-[13px] text-zinc-300">{item.label}</p>
                    <p className="text-[12px] text-zinc-600">{item.detail}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/[0.06] pt-5">
                {STATS.map((item) => (
                  <div key={item.label}>
                    <p className="text-[11px] text-zinc-600">{item.label}</p>
                    <p className="mt-0.5 text-[15px] text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[12px] leading-relaxed text-zinc-500">
                If a provider is degraded, the next healthy one serves the
                request.
              </p>
            </aside>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-b from-transparent via-black/45 to-black lg:block"
          />
        </div>
      </div>
    </section>
  );
}

function GlobeHub() {
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className="absolute -inset-6 rounded-full bg-white/[0.03] blur-xl" />
      <span className="animate-orbit-pulse absolute -inset-3 rounded-full border border-white/10" />
      <span className="relative flex size-[62px] flex-col items-center justify-center rounded-full bg-[#0d0d10]/90 sm:size-[74px]">
        <span className="font-mono text-[11.5px] font-medium text-white sm:text-[12.5px]">
          orbit
        </span>
        <span className="mt-0.5 text-[10px] tracking-wide text-zinc-500">
          router
        </span>
      </span>
    </div>
  );
}

