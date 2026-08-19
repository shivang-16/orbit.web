import { Suspense, type ReactNode } from "react";

import { CheckoutOnLoad } from "@/components/billing/checkout-on-load";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrgProvider } from "@/components/org/org-context";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
  return (
    <OrgProvider>
      <DashboardShell>
        <Suspense fallback={null}>
          <CheckoutOnLoad />
        </Suspense>
        <main className="min-h-0 flex-1 overflow-x-clip overflow-y-auto">{children}</main>
      </DashboardShell>
    </OrgProvider>
  );
}
