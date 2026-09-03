import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/require-admin";
import { AdminLoginForm } from "./_components/login-form";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && isAdminUser(session.user)) {
    redirect("/admin" as Route);
  }

  return <AdminLoginForm />;
}
