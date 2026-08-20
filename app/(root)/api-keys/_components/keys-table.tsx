"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { formatKeyDate, type APIKey } from "@/lib/api-keys";

export function KeysTable({
  keys,
  search,
  onSearchChange,
  canDelete,
  onDelete,
}: {
  keys: APIKey[];
  search: string;
  onSearchChange: (value: string) => void;
  canDelete: boolean;
  onDelete: (id: string) => Promise<void>;
}) {
  const query = search.trim().toLowerCase();
  const filtered = keys.filter(
    (key) =>
      key.status !== "inactive" && key.name.toLowerCase().includes(query),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-xs">
        <MagnifyingGlassIcon
          size={14}
          className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name..."
          aria-label="Search API keys by name"
          className="h-8 w-full rounded-lg border border-white/10 bg-[#0b0b0c] pl-8 pr-3 text-[13px] text-white outline-none placeholder:text-zinc-400 focus:border-white/20"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0c]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-500">
                <th className="px-4 py-2.5 font-normal">Key</th>
                <th className="px-4 py-2.5 font-normal">Expires</th>
                <th className="px-4 py-2.5 font-normal">Last used</th>
                {canDelete ? (
                  <th className="w-12 px-4 py-2.5 text-right font-normal">
                    <span className="sr-only">Actions</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {filtered.map((key) => (
                <tr
                  key={key.id}
                  className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{key.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] tracking-wide text-zinc-500">
                      {key.key_preview}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                    {formatKeyDate(key.expires_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                    {formatKeyDate(key.last_used_at)}
                  </td>
                  {canDelete ? (
                    <td className="px-4 py-3 text-right">
                      <DeleteKeyButton name={key.name} onConfirm={() => onDelete(key.id)} />
                    </td>
                  ) : null}
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={canDelete ? 4 : 3} className="px-4 py-10 text-center text-zinc-500">
                    {keys.length === 0 ? "No API keys yet." : "No keys match that name."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <p className="border-t border-white/10 px-4 py-2.5 text-xs text-zinc-500">
          {filtered.length} key{filtered.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

function DeleteKeyButton({
  name,
  onConfirm,
}: {
  name: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      setError("Could not delete this key.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSubmitting(false);
          setError(null);
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
          aria-label={`Delete ${name}`}
        >
          <TrashSimpleIcon size={14} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0b0c] p-5 shadow-2xl outline-none">
          <Dialog.Title className="text-[15px] font-medium text-white">
            Delete API key
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-[13px] text-zinc-400">
            <span className="text-zinc-200">{name}</span> will be marked inactive
            and stop working immediately. This cannot be undone.
          </Dialog.Description>
          {error ? <p className="mt-3 text-[13px] text-red-400">{error}</p> : null}
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" disabled={submitting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? <Loader size="sm" className="py-0" /> : "Delete"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
