"use client";

import { startTransition, useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormInput, FormTextarea } from "../../../_components/rhf-fields";
import type { CategorySettings } from "@/lib/catalog/types";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/forms/schemas";
import { deleteCategoryAction, saveCategoryAction, type ActionState } from "../../actions";

function categoryFormData(values: CategoryFormValues) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, String(value ?? ""));
  }
  return data;
}

export function CategoryForm({ category }: { category?: CategorySettings }) {
  const [state, formAction, pending] = useActionState(saveCategoryAction, null as ActionState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteCategoryAction, null as ActionState);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      slug: category?.slug ?? "",
      name: category?.name ?? "",
      description: category?.description ?? "",
      order: String(category?.order ?? ""),
      homepageDesktopCount: String(category?.homepageDesktopCount ?? ""),
      homepageMobileCount: String(category?.homepageMobileCount ?? ""),
    },
  });

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          startTransition(() => {
            formAction(categoryFormData(values));
          });
        })}
      >
        <input type="hidden" {...form.register("slug")} />
        <FieldGroup>
          <FormInput control={form.control} name="name" label="Name" />
          <FormTextarea control={form.control} name="description" label="Description" />
          <FormInput control={form.control} name="order" label="Order" type="number" min={1} />
          <FormInput control={form.control} name="homepageDesktopCount" label="Homepage desktop count" type="number" min={1} />
          <FormInput control={form.control} name="homepageMobileCount" label="Homepage mobile count" type="number" min={1} />
        </FieldGroup>
        {state?.error ? <FieldError>{state.error}</FieldError> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save category"}
        </Button>
      </form>

      {category ? (
        <div className="space-y-2">
          {deleteState?.error ? <FieldError>{deleteState.error}</FieldError> : null}
          <ConfirmAlertDialog
            trigger={
              <Button type="button" variant="destructive">
                Delete
              </Button>
            }
            title={`Delete ${category.name}?`}
            description="This removes the category from the catalogue."
            confirmLabel="Delete"
            pending={deletePending}
            onConfirm={() => {
              const data = new FormData();
              data.set("slug", category.slug);
              startTransition(() => {
                deleteAction(data);
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
