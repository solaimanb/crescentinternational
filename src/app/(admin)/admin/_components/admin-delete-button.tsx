"use client";

import { startTransition, useActionState } from "react";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import type { ActionState } from "@/app/(admin)/admin/(panel)/actions";

export function AdminDeleteButton({
  action,
  fieldName,
  fieldValue,
  title,
  description,
  confirmLabel = "Delete",
  triggerLabel = "Delete",
  size = "sm",
}: {
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
  fieldName: string;
  fieldValue: string;
  title: string;
  description: string;
  confirmLabel?: string;
  triggerLabel?: string;
  size?: "sm" | "default" | "xs";
}) {
  const [state, formAction, pending] = useActionState(action, null as ActionState);

  return (
    <div className="space-y-2">
      {state?.error ? <FieldError>{state.error}</FieldError> : null}
      <ConfirmAlertDialog
        trigger={
          <Button type="button" size={size} variant="destructive">
            {triggerLabel}
          </Button>
        }
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        pending={pending}
        onConfirm={() => {
          const data = new FormData();
          data.set(fieldName, fieldValue);
          startTransition(() => {
            formAction(data);
          });
        }}
      />
    </div>
  );
}
