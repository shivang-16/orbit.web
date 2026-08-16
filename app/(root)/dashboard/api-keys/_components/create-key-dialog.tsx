"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { Dialog, DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { createAPIKey, type APIKeyExpiration, type CreateAPIKeyResponse } from "@/lib/api-keys";

const EXPIRATION_OPTIONS: { value: APIKeyExpiration; label: string }[] = [
  { value: "never", label: "No expiration" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
];

export function CreateKeyDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [expiration, setExpiration] = useState<APIKeyExpiration>("never");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreateAPIKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setName("");
    setExpiration("never");
    setSubmitting(false);
    setError(null);
    setCreated(null);
    setCopied(false);
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await createAPIKey(name.trim(), expiration);
      setCreated(result);
      onCreated();
    } catch {
      setError("Could not create this key.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copySecret() {
    if (!created) return;
    await navigator.clipboard.writeText(created.secret);
    setCopied(true);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Dialog.Trigger asChild>
        <Button>
          <PlusIcon size={14} weight="bold" />
          New Key
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0b0c] p-5 shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-[15px] font-medium text-white">
              {created ? "API key created" : "Create API key"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon-xs" className="text-zinc-400">
                <XIcon size={16} />
              </Button>
            </Dialog.Close>
          </div>

          {created ? (
            <div className="mt-4 space-y-3">
              <p className="text-[13px] text-zinc-300">
                Copy this key now. Orbit stores only a hash, so it will not be shown again.
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black px-3 py-2">
                <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-white">
                  {created.secret}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={copySecret}
                  className="text-zinc-300"
                >
                  {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                </Button>
              </div>
              <div className="flex justify-end">
                <Dialog.Close asChild>
                  <Button>Done</Button>
                </Dialog.Close>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-[13px] text-zinc-300">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='e.g. "Chatbot Key"'
                  className="mt-1.5 h-9 w-full rounded-lg border border-white/10 bg-black px-3 text-[13px] text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="text-[13px] text-zinc-300">Expiration</span>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="mt-1.5 w-full justify-between px-3 text-[13px] font-normal"
                    >
                      {EXPIRATION_OPTIONS.find((option) => option.value === expiration)?.label}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="start"
                      sideOffset={6}
                      className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl"
                    >
                      {EXPIRATION_OPTIONS.map((option) => (
                        <DropdownMenu.Item
                          key={option.value}
                          onSelect={() => setExpiration(option.value)}
                          className="cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] text-white outline-none data-[highlighted]:bg-white/10"
                        >
                          {option.label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </label>

              {error ? <p className="text-[13px] text-red-400">{error}</p> : null}

              <div className="flex justify-end">
                <Button type="button" onClick={handleCreate} disabled={submitting}>
                  {submitting ? <Loader size="sm" className="py-0" /> : "Create"}
                </Button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
