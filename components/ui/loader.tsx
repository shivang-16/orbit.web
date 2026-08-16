import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-3.5 border-2",
  md: "size-6 border-2",
} as const;

type LoaderProps = {
  className?: string;
  size?: keyof typeof SIZES;
};

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex items-center justify-center",
        size === "md" && "py-16",
        className
      )}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-white/15 border-t-white",
          SIZES[size]
        )}
      />
    </div>
  );
}
