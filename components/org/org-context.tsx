"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getStoredOrganizationId, setStoredOrganizationId } from "@/lib/api";
import { fetchOrganizations, sortOrganizations, defaultOrganization, type Organization, type OrgEntitlement } from "@/lib/organizations";
import { useUserSync } from "@/components/auth/sync-user";

type OrgContextValue = {
  organizations: Organization[];
  activeOrganization: Organization | null;
  entitlement: OrgEntitlement | null;
  setActiveOrganizationId: (id: string) => void;
  addOrganization: (org: Organization, entitlement?: OrgEntitlement) => void;
  updateOrganization: (org: Organization) => void;
  loading: boolean;
};

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const { synced } = useUserSync();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganizationId, setActiveId] = useState<string | null>(null);
  const [entitlement, setEntitlement] = useState<OrgEntitlement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!synced) {
      setLoading(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchOrganizations()
      .then((data) => {
        if (cancelled) return;
        const orgs = sortOrganizations(data.organizations);
        setOrganizations(orgs);
        setEntitlement(data.entitlement);
        const preferred = defaultOrganization(orgs);
        const stored = getStoredOrganizationId();
        const next =
          orgs.find((org) => org.id === stored)?.id ?? preferred?.id ?? orgs[0]?.id ?? null;
        if (next) {
          setActiveId(next);
          setStoredOrganizationId(next);
        } else {
          setActiveId(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setOrganizations([]);
        setEntitlement(null);
        setActiveId(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [synced]);

  const setActiveOrganizationId = useCallback((id: string) => {
    setActiveId(id);
    setStoredOrganizationId(id);
  }, []);

  const addOrganization = useCallback((org: Organization, nextEntitlement?: OrgEntitlement) => {
    setOrganizations((current) => sortOrganizations([...current, org]));
    if (nextEntitlement) {
      setEntitlement(nextEntitlement);
    }
    setActiveId(org.id);
    setStoredOrganizationId(org.id);
  }, []);

  const updateOrganization = useCallback((org: Organization) => {
    setOrganizations((current) => sortOrganizations(current.map((item) => (item.id === org.id ? { ...item, ...org } : item))));
  }, []);

  const activeOrganization = useMemo(
    () => organizations.find((org) => org.id === activeOrganizationId) ?? null,
    [organizations, activeOrganizationId]
  );

  const value = useMemo(
    () => ({
      organizations,
      activeOrganization,
      entitlement,
      setActiveOrganizationId,
      addOrganization,
      updateOrganization,
      loading,
    }),
    [organizations, activeOrganization, entitlement, setActiveOrganizationId, addOrganization, updateOrganization, loading]
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
