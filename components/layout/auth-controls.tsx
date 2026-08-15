"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { ArrowUpRight } from "lucide-react";

export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <button
            type="button"
            className="hidden h-8 items-center px-2 text-sm text-zinc-400 transition-colors hover:text-white sm:flex"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton>
          <button
            type="button"
            className="group flex h-8 items-center gap-2 rounded-full bg-white pr-1 pl-3.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Start for free
            <span className="flex size-6 items-center justify-center rounded-full bg-black text-white">
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
            </span>
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
