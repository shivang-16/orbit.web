"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { apiFetch } from "@/lib/api";

type UserSyncValue = {
  synced: boolean;
};

const UserSyncContext = createContext<UserSyncValue | null>(null);

export function UserSyncProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn || !userId) {
      setSynced(false);
      return;
    }

    let cancelled = false;
    setSynced(false);
    void apiFetch("/users/sync", { method: "POST" }).finally(() => {
      if (!cancelled) setSynced(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId]);

  return (
    <UserSyncContext.Provider value={{ synced: Boolean(synced && isSignedIn) }}>
      {children}
    </UserSyncContext.Provider>
  );
}

export function useUserSync() {
  const value = useContext(UserSyncContext);
  if (!value) {
    throw new Error("useUserSync must be used within UserSyncProvider");
  }
  return value;
}
