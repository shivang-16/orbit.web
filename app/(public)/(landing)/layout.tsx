import { SiteHeader } from "@/components/layout/site-header";

export default function LandingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative flex min-h-svh flex-col bg-black">
      <SiteHeader />
      {children}
    </div>
  );
}
