"use client";

import { startTransition, useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { loginFormSchema, type LoginFormValues } from "@/lib/forms/schemas";
import { FormInput } from "../../_components/rhf-fields";
import { loginAction } from "../actions";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-start justify-center bg-muted px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            noValidate
            onSubmit={form.handleSubmit((values) => {
              const data = new FormData();
              data.set("email", values.email);
              data.set("password", values.password);
              startTransition(() => {
                formAction(data);
              });
            })}
          >
            <FieldGroup>
              <FormInput control={form.control} name="email" label="Email" type="email" autoComplete="email" />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
            </FieldGroup>
            {state?.error ? <FieldError>{state.error}</FieldError> : null}
            <Button type="submit" disabled={form.formState.isSubmitting} size="lg" className="w-full">
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
