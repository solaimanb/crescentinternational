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

export async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !isAdminUser(session.user)) {
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
