"use client";

import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import { ArrowSquareOutIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const afterAuth = { forceRedirectUrl: "/dashboard" };

export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton {...afterAuth}>
          <Button type="button" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton {...afterAuth}>
          <Button type="button" variant="pill" className="pr-1 pl-3.5">
            Start for free
            <span className="flex size-6 items-center justify-center rounded-full bg-black text-white">
              <ArrowUpRightIcon size={14} weight="bold" />
            </span>
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button asChild variant="pill" className="px-3.5">
          <Link href="/dashboard">
            Dashboard
            <ArrowSquareOutIcon size={14} weight="bold" />
          </Link>
        </Button>
      </Show>
    </>
  );
}
