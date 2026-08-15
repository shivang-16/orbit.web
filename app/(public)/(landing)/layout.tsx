import { SiteHeader } from "@/components/layout/site-header";

export default function LandingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
