"use client";

import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { createOrganization } from "@/lib/organizations";
import { useOrg } from "@/components/org/org-context";

export function CreateOrgDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addOrganization } = useOrg();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setDescription("");
    setSubmitting(false);
    setError(null);
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const org = await createOrganization(name.trim(), description.trim());
      addOrganization(org);
      onOpenChange(false);
      reset();
    } catch {
      setError("Could not create this organization.");
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0b0c] p-5 shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-[15px] font-medium text-white">
              Create organization
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <XIcon size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-[13px] text-zinc-300">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder='e.g. "Acme Research"'
                className="mt-1.5 h-9 w-full rounded-lg border border-white/10 bg-black px-3 text-[13px] text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="text-[13px] text-zinc-300">
                Description <span className="text-zinc-500">(optional)</span>
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What this organization is for"
                rows={3}
                className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-black px-3 py-2 text-[13px] text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
              />
            </label>

            {error ? <p className="text-[13px] text-red-400">{error}</p> : null}

            <div className="flex justify-end">
              <Button type="button" onClick={handleCreate} disabled={submitting}>
                {submitting ? <Loader size="sm" className="py-0" /> : "Create"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
