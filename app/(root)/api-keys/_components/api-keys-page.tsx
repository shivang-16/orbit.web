"use client";

import { useCallback, useEffect, useState } from "react";

import { useOrg } from "@/components/org/org-context";
import { Loader } from "@/components/ui/loader";
import { fetchAPIKeys, deleteAPIKey, type APIKey } from "@/lib/api-keys";

import { CreateKeyDialog } from "./create-key-dialog";
import { KeysTable } from "./keys-table";

export function ApiKeysPage() {
  const { activeOrganization } = useOrg();
  const [keys, setKeys] = useState<APIKey[] | null>(null);
  const [canDelete, setCanDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    if (!activeOrganization) {
      setKeys([]);
      setCanDelete(false);
      return;
    }
    setKeys(null);
    setCanDelete(false);
    fetchAPIKeys()
      .then((data) => {
        setKeys(data.keys);
        setCanDelete(Boolean(data.can_delete));
        setError(null);
      })
      .catch(() => {
        setError("Could not load API keys.");
      });
  }, [activeOrganization]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-white">API Keys</h1>
          <p className="mt-1 text-[13px] text-zinc-400">Create and manage your API keys.</p>
        </div>
        <CreateKeyDialog onCreated={load} />
      </div>

      {error ? (
        <p className="mt-6 text-[13px] text-red-400">{error}</p>
      ) : null}
      {success ? (
        <p className="mt-6 text-[13px] text-emerald-400">{success}</p>
      ) : null}
      {error ? null : keys === null ? (
        <Loader />
      ) : (
        <div className="mt-6">
          <KeysTable
            keys={keys}
            search={search}
            onSearchChange={setSearch}
            canDelete={canDelete}
            onDelete={async (id) => {
              await deleteAPIKey(id);
              setKeys((current) => current?.filter((key) => key.id !== id) ?? null);
              setError(null);
              setSuccess("Key removed successfully.");
            }}
          />
        </div>
      )}
    </div>
  );
}
