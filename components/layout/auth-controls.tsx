"use client";

import { SignInButton, Show } from "@clerk/nextjs";
import { SignInIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const afterAuth = { forceRedirectUrl: "/dashboard" };

const actionButtonClassName =
  "h-8 gap-2 rounded-md bg-white px-3 text-[13px] font-medium text-black hover:bg-zinc-200";

export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton {...afterAuth}>
          <Button type="button" className={actionButtonClassName}>
            <SignInIcon size={15} weight="bold" />
            Sign in
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <Button asChild className={actionButtonClassName}>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </Show>
    </>
  );
}
