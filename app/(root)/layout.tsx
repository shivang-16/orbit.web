import { Suspense, type ReactNode } from "react";

import { CheckoutOnLoad } from "@/components/billing/checkout-on-load";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { OrgProvider } from "@/components/org/org-context";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
  return (
    <OrgProvider>
      <div className="flex h-svh overflow-hidden bg-black">
        <DashboardSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Suspense fallback={null}>
            <CheckoutOnLoad />
          </Suspense>
          <DashboardNavbar />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </OrgProvider>
  );
}
