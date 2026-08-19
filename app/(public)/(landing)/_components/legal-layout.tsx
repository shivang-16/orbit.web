type Props = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="relative w-full overflow-hidden bg-black pt-24 pb-8">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <p className="mb-3 text-[12px] text-white/35">Last updated: {lastUpdated}</p>
        <h1 className="mb-8 text-[28px] font-bold tracking-tight text-white sm:text-[38px]">
          {title}
        </h1>

        <article className="flex flex-col gap-8 text-[14px] leading-relaxed text-white/60">
          {children}
        </article>

        <div className="mt-12 border-t border-white/8 pt-8">
          <p className="text-[13px] text-white/40">
            Questions? Contact us at{" "}
            <a
              href="mailto:hello@tryorbit.cloud"
              className="text-white/70 transition-colors hover:text-white"
            >
              hello@tryorbit.cloud
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[18px] font-semibold text-white/90">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
