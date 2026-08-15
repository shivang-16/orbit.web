import { UserButton } from "@clerk/nextjs";

export function DashboardNavbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-white/10 bg-black px-6">
      <UserButton
        appearance={{ elements: { userButtonAvatarBox: "size-7" } }}
      />
    </header>
  );
}
