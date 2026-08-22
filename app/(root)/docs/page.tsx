import { redirect } from "next/navigation";

import { ORBIT_DOCS } from "@/lib/docs";

export default function DocumentationPage() {
  redirect(ORBIT_DOCS.home);
}
