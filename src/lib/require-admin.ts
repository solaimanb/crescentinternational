import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export function isAdminUser(user: { role?: string | null; banned?: boolean | null }) {
  if (user.banned) {
    return false;
  }

  return user.role === "admin";
}

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !isAdminUser(session.user)) {
    redirect("/admin/login");
  }

  return session;
}
