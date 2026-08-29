"use client";

import { startTransition, useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormTextarea } from "../../../_components/rhf-fields";
import { settingFormSchema, type SettingFormValues } from "@/lib/forms/schemas";
import { saveSettingAction, type ActionState } from "../../actions";

export function SettingsForm({
  id,
  data,
  body,
  showBody = false,
}: {
  id: string;
  data: Record<string, unknown>;
  body?: string;
  showBody?: boolean;
}) {
  const [state, formAction] = useActionState(saveSettingAction, null as ActionState);
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      id,
      data: JSON.stringify(data, null, 2),
      body: body ?? "",
    },
  });

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        const payload = new FormData();
        payload.set("id", values.id);
        payload.set("data", values.data);
        payload.set("body", values.body);
        startTransition(() => {
          formAction(payload);
        });
      })}
    >
      <input type="hidden" {...form.register("id")} />
      {!showBody ? <input type="hidden" {...form.register("body")} /> : null}
      <FieldGroup>
        <FormTextarea control={form.control} name="data" label="Settings" className="min-h-80 font-mono text-xs" />
        {showBody ? <FormTextarea control={form.control} name="body" label="Page body" className="min-h-40" /> : null}
      </FieldGroup>
      {state?.error ? <FieldError>{state.error}</FieldError> : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
