export function PlanIcon({ slug }: { slug: string }) {
  const paths: Record<string, string> = {
    starter:
      "M12 3v3M8 8l4-2 4 2M6 12l6-3 6 3M5 16l7-3 7 3M4 20l8-3 8 3",
    builder:
      "M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7l7-4zM12 8v8M8.5 11.5 12 13l3.5-1.5",
    pro: "M4 18c2-6 4-10 8-14 4 4 6 8 8 14M8 18c1.2-3 2.4-5 4-7 1.6 2 2.8 4 4 7",
    business:
      "M12 4c4 3 6 7 6 12H6c0-5 2-9 6-12zM8 20h8M10 12h4",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-8 text-white"
      aria-hidden
    >
      <path d={paths[slug] ?? paths.starter} />
    </svg>
  );
}
