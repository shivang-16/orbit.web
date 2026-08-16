"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getStoredOrganizationId, setStoredOrganizationId } from "@/lib/api";
import { fetchOrganizations, type Organization } from "@/lib/organizations";

type OrgContextValue = {
  organizations: Organization[];
  activeOrganization: Organization | null;
  setActiveOrganizationId: (id: string) => void;
  addOrganization: (org: Organization) => void;
  loading: boolean;
};

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganizationId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchOrganizations()
      .then((data) => {
        if (cancelled) return;
        const orgs = data.organizations;
        setOrganizations(orgs);
        const stored = getStoredOrganizationId();
        const next = orgs.find((org) => org.id === stored)?.id ?? orgs[0]?.id ?? null;
        if (next) {
          setActiveId(next);
          setStoredOrganizationId(next);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setActiveOrganizationId = useCallback((id: string) => {
    setActiveId(id);
    setStoredOrganizationId(id);
  }, []);

  const addOrganization = useCallback((org: Organization) => {
    setOrganizations((current) => [...current, org]);
    setActiveId(org.id);
    setStoredOrganizationId(org.id);
  }, []);

  const activeOrganization = useMemo(
    () => organizations.find((org) => org.id === activeOrganizationId) ?? null,
    [organizations, activeOrganizationId]
  );

  const value = useMemo(
    () => ({
      organizations,
      activeOrganization,
      setActiveOrganizationId,
      addOrganization,
      loading,
    }),
    [organizations, activeOrganization, setActiveOrganizationId, addOrganization, loading]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const value = useContext(OrgContext);
  if (!value) {
    throw new Error("useOrg must be used within OrgProvider");
  }
  return value;
}
