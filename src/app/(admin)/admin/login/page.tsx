import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/require-admin";
import { AdminLoginForm } from "./_components/login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>}>
      <AdminLoginGate />
    </Suspense>
  );
}

async function AdminLoginGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && isAdminUser(session.user)) {
    redirect("/admin" as Route);
  }

  return <AdminLoginForm />;
}
