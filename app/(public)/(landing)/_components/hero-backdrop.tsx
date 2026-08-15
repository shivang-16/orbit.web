// Each streak idles for most of its cycle, so passes stay occasional rather than
// forming a constant stream. Negative delays desynchronise them on load.
const STREAKS = [
  { left: "-6%", height: 220, opacity: 0.5, duration: "5s", delay: "-1.2s" },
  { left: "8%", height: 320, opacity: 0.35, duration: "7s", delay: "-4s" },
  { left: "19%", height: 180, opacity: 0.6, duration: "5.5s", delay: "-2.4s" },
  { left: "27%", height: 400, opacity: 0.28, duration: "8.5s", delay: "-6s" },
  { left: "38%", height: 260, opacity: 0.45, duration: "6.5s", delay: "-3.2s" },
  { left: "47%", height: 340, opacity: 0.55, duration: "7.5s", delay: "-0.8s" },
  { left: "56%", height: 200, opacity: 0.32, duration: "5.2s", delay: "-4.4s" },
  { left: "66%", height: 380, opacity: 0.5, duration: "8s", delay: "-2.8s" },
  { left: "74%", height: 240, opacity: 0.38, duration: "6.8s", delay: "-5.6s" },
  { left: "85%", height: 300, opacity: 0.58, duration: "6s", delay: "-2s" },
  { left: "93%", height: 420, opacity: 0.3, duration: "9s", delay: "-4.8s" },
];

export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {STREAKS.map((streak) => (
        <span
          key={streak.left}
          style={{ left: streak.left, opacity: streak.opacity }}
          className="absolute top-0 origin-top rotate-[26deg]"
        >
          <span
            style={{
              height: streak.height,
              animationDuration: streak.duration,
              animationDelay: streak.delay,
            }}
            className="animate-shooting-star relative block w-px bg-linear-to-b from-transparent to-white will-change-transform"
          >
            <span className="absolute bottom-0 left-1/2 size-[3px] -translate-x-1/2 translate-y-px rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.5)]" />
          </span>
        </span>
      ))}
    </div>
  );
}
