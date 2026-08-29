"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { auth } from "@/lib/auth";
import { loginFormSchema } from "@/lib/forms/schemas";

export async function loginAction(
  _previous: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const parsed = loginFormSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials." };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });
  } catch {
    return { error: "Invalid email or password." };
  }

  redirect("/admin" as Route);
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/admin/login" as Route);
}
