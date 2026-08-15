// Negative delays start most streaks mid-flight so the sky is never empty on load.
const STREAKS = [
  { left: "-2%", height: 260, opacity: 0.55, duration: "8s", delay: "-2s" },
  { left: "4%", height: 420, opacity: 0.38, duration: "11s", delay: "-7s" },
  { left: "11%", height: 300, opacity: 0.5, duration: "6.5s", delay: "-4s" },
  { left: "17%", height: 540, opacity: 0.32, duration: "12s", delay: "-1s" },
  { left: "23%", height: 340, opacity: 0.48, duration: "9s", delay: "-6s" },
  { left: "29%", height: 240, opacity: 0.36, duration: "7s", delay: "-3.5s" },
  { left: "36%", height: 620, opacity: 0.58, duration: "13s", delay: "-9s" },
  { left: "43%", height: 380, opacity: 0.34, duration: "8.5s", delay: "-0.5s" },
  { left: "49%", height: 500, opacity: 0.46, duration: "10s", delay: "-5s" },
  { left: "56%", height: 280, opacity: 0.4, duration: "6s", delay: "-2.5s" },
  { left: "62%", height: 460, opacity: 0.6, duration: "11.5s", delay: "-8s" },
  { left: "69%", height: 320, opacity: 0.36, duration: "7.5s", delay: "-4.5s" },
  { left: "75%", height: 560, opacity: 0.5, duration: "12.5s", delay: "-10s" },
  { left: "81%", height: 400, opacity: 0.42, duration: "9.5s", delay: "-1.5s" },
  { left: "87%", height: 300, opacity: 0.56, duration: "6.8s", delay: "-5.5s" },
  { left: "93%", height: 480, opacity: 0.36, duration: "11s", delay: "-3s" },
  { left: "98%", height: 360, opacity: 0.46, duration: "8.2s", delay: "-6.5s" },
  { left: "104%", height: 520, opacity: 0.38, duration: "13.5s", delay: "-2.2s" },
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
            className="animate-shooting-star block w-[2px] bg-linear-to-b from-transparent via-white to-transparent shadow-[0_0_8px_1px_rgba(255,255,255,0.45)] will-change-transform"
          />
        </span>
      ))}
    </div>
  );
}
