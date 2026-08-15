"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

import { apiFetch } from "@/lib/api";

export function SyncUser() {
  const { isSignedIn, userId } = useAuth();
  const started = useRef<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !userId || started.current === userId) {
      return;
    }

    started.current = userId;
    void apiFetch("/users/sync", { method: "POST" }).catch(() => {
      started.current = null;
    });
  }, [isSignedIn, userId]);

  return null;
}
