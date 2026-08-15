import type { ReactNode } from "react";

import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-black">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardNavbar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
