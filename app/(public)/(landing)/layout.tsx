import { SiteHeader } from "@/components/layout/site-header";

import { Footer } from "./_components/footer";

export default function LandingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <div className="overflow-x-clip">
        {children}
        <Footer />
      </div>
    </>
  );
}
