"use client";

import Image from "next/image";
import { startTransition, useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormInput, FormTextarea } from "../../../_components/rhf-fields";
import type { HomeBanner } from "@/lib/content/types";
import { bannerFormSchema, type BannerFormValues } from "@/lib/forms/schemas";
import { deleteBannerAction, saveBannerAction, type ActionState } from "../../actions";

function bannerFormData(values: BannerFormValues, file: File | undefined) {
  const data = new FormData();
  data.set("id", values.id);
  data.set("title", values.title);
  data.set("subtitle", values.subtitle);
  data.set("imageAlt", values.imageAlt);
  data.set("sortOrder", values.sortOrder);
  data.set("image", values.image);
  if (file) {
    data.set("imageFile", file);
  }
  return data;
}

export function BannerForm({ banner }: { banner?: HomeBanner }) {
  const [state, formAction, pending] = useActionState(saveBannerAction, null as ActionState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteBannerAction, null as ActionState);
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      id: banner?.id ?? "",
      title: banner?.title ?? "",
      subtitle: banner?.subtitle ?? "",
      imageAlt: banner?.imageAlt ?? "",
      sortOrder: String(banner?.sortOrder ?? 1),
      image: banner?.image ?? "",
    },
  });

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        noValidate
        onSubmit={form.handleSubmit((values, event) => {
          const uploadInput = event?.currentTarget.elements.namedItem("imageFile");
          const file = uploadInput instanceof HTMLInputElement ? uploadInput.files?.[0] : undefined;
          startTransition(() => {
            formAction(bannerFormData(values, file));
          });
        })}
      >
        <input type="hidden" {...form.register("id")} />
        <input type="hidden" {...form.register("image")} />
        <FieldGroup>
          <FormInput control={form.control} name="title" label="Title" />
          <FormTextarea control={form.control} name="subtitle" label="Subtitle" />
          <FormInput control={form.control} name="imageAlt" label="Image alt text" />
          <FormInput control={form.control} name="sortOrder" label="Order" type="number" min={1} />
          <Field>
            <FieldLabel htmlFor="imageFile">Image</FieldLabel>
            {banner?.image ? (
              <AspectRatio ratio={21 / 8} className="mb-3 overflow-hidden rounded-xs bg-muted">
                <Image src={banner.image} alt={banner.imageAlt || banner.title} fill sizes="640px" className="object-cover" />
              </AspectRatio>
            ) : null}
            <Input id="imageFile" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          </Field>
        </FieldGroup>
        {state?.error ? <FieldError>{state.error}</FieldError> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save banner"}
        </Button>
      </form>

      {banner ? (
        <div className="space-y-2">
          {deleteState?.error ? <FieldError>{deleteState.error}</FieldError> : null}
          <ConfirmAlertDialog
            trigger={
              <Button type="button" variant="destructive">
                Delete
              </Button>
            }
            title={`Delete ${banner.title}?`}
            description="This removes the banner from the homepage."
            confirmLabel="Delete"
            pending={deletePending}
            onConfirm={() => {
              const data = new FormData();
              data.set("id", banner.id);
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
