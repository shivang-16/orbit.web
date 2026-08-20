"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Select } from "@/components/ui/select";
import { APIError } from "@/lib/api";
import { addMember } from "@/lib/organizations";

export function AddMemberDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setEmail("");
    setRole("member");
    setSubmitting(false);
    setError(null);
  }

  async function handleAdd() {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await addMember(email.trim(), role);
      onAdded();
      setOpen(false);
      reset();
    } catch (caught) {
      setError(addMemberError(caught));
      setSubmitting(false);
    }
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
        <Button type="button">
          <PlusIcon size={14} />
          Add member
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0b0c] p-5 shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-[15px] font-medium text-white">Add member</Dialog.Title>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon-xs" className="text-zinc-400">
                <XIcon size={16} />
              </Button>
            </Dialog.Close>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-[13px] text-zinc-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teammate@company.com"
                className="mt-1.5 h-9 w-full rounded-lg border border-white/10 bg-black px-3 text-[13px] text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
              />
              <p className="mt-1.5 text-[12px] text-zinc-500">
                They need an Orbit account with this email already.
              </p>
            </label>

            <div>
              <span className="text-[13px] text-zinc-300">Role</span>
              <Select
                className="mt-1.5"
                value={role}
                onValueChange={setRole}
                ariaLabel="Role"
                options={[
                  { value: "member", label: "Member" },
                  { value: "admin", label: "Admin" },
                ]}
              />
            </div>

            {error ? <p className="text-[13px] text-red-400">{error}</p> : null}

            <div className="flex justify-end">
              <Button type="button" onClick={handleAdd} disabled={submitting}>
                {submitting ? <Loader size="sm" className="py-0" /> : "Add"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function addMemberError(error: unknown) {
  if (error instanceof APIError) {
    if (error.code === "member_limit") {
      return "This organization is at its member limit. Upgrade to add more people.";
    }
    if (error.code === "user_not_found") {
      return "No Orbit user has that email yet. Ask them to sign up first.";
    }
    if (error.code === "already_member") {
      return "That person is already in this organization.";
    }
  }
  return "Could not add this member.";
}
