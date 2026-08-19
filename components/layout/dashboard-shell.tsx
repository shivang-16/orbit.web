"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex h-svh overflow-hidden bg-black">
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-11 z-40 bg-black/60 lg:hidden"
        />
      ) : null}

      <div
        className={cn(
          "fixed top-11 bottom-0 left-0 z-50 w-64 transition-transform duration-200 ease-out lg:static lg:top-auto lg:bottom-auto lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardSidebar />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardNavbar
          menuOpen={open}
          onMenuClick={() => setOpen((current) => !current)}
        />
        {children}
      </div>
    </div>
  );
}
