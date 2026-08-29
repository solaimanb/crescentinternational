"use client";

import { startTransition, useActionState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormInput, FormTextarea } from "../../../_components/rhf-fields";
import type { CategorySettings, Product } from "@/lib/catalog/types";
import { productFormSchema, type ProductFormValues } from "@/lib/forms/schemas";
import { deleteProductAction, saveProductAction, type ActionState } from "../../actions";

function productFormData(values: ProductFormValues, files: FileList | null) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (key === "images" && Array.isArray(value)) {
      for (const src of value) {
        data.append("images", src);
      }
      continue;
    }
    data.set(key, String(value ?? ""));
  }
  if (files) {
    for (const file of files) {
      data.append("newImages", file);
    }
  }
  return data;
}

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: CategorySettings[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(saveProductAction, null as ActionState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteProductAction, null as ActionState);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      slug: product?.slug ?? "",
      name: product?.name ?? "",
      categorySlug:
        product?.categorySlug && categories.some((item) => item.slug === product.categorySlug)
          ? product.categorySlug
          : (categories[0]?.slug ?? ""),
      priceRange: product?.priceRange ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      contactWhatsapp: product?.contactWhatsapp ?? "",
      contactEmail: product?.contactEmail ?? "",
      contactPhone: product?.contactPhone ?? "",
      contactTemp: product?.contactTemp ?? "",
      seoHashtags: product?.seoHashtags.join(", ") ?? "",
      images: product?.images ?? [],
    },
  });

  const images = useWatch({ control: form.control, name: "images" }) ?? [];

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          startTransition(() => {
            formAction(productFormData(values, fileRef.current?.files ?? null));
          });
        })}
      >
        <input type="hidden" {...form.register("slug")} />
        <FieldGroup>
          <FormInput control={form.control} name="name" label="Name" />
          <Controller
            name="categorySlug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(String(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.slug} value={item.slug}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
          <FormInput control={form.control} name="priceRange" label="Price range" />
          <FormTextarea control={form.control} name="shortDescription" label="Short description" />
          <FormTextarea control={form.control} name="description" label="Description" />
          <FormInput control={form.control} name="contactWhatsapp" label="WhatsApp" />
          <FormInput control={form.control} name="contactEmail" label="Email" type="email" />
          <FormInput control={form.control} name="contactPhone" label="Phone" />
          <FormInput control={form.control} name="contactTemp" label="Works phone" />
          <FormInput control={form.control} name="seoHashtags" label="SEO hashtags" />
          <Field>
            <FieldLabel htmlFor="newImages">Images</FieldLabel>
            <Input id="newImages" ref={fileRef} type="file" accept="image/*" multiple />
            <div className="mt-2 space-y-2">
              {images.map((src) => (
                <div key={src} className="flex items-center justify-between gap-2 rounded-lg border px-2 py-1 text-xs">
                  <span className="truncate">{src}</span>
                  <ConfirmAlertDialog
                    trigger={
                      <Button type="button" size="xs" variant="ghost">
                        Remove
                      </Button>
                    }
                    title="Remove this image?"
                    description="It is dropped from this product when you save."
                    confirmLabel="Remove"
                    onConfirm={() =>
                      form.setValue(
                        "images",
                        images.filter((item) => item !== src),
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Field>
        </FieldGroup>

        {categories.length === 0 ? <FieldError>Create a category before adding products.</FieldError> : null}
        {state?.error ? <FieldError>{state.error}</FieldError> : null}

        <Button type="submit" disabled={form.formState.isSubmitting || categories.length === 0}>
          {form.formState.isSubmitting ? "Saving..." : "Save product"}
        </Button>
      </form>

      {product ? (
        <div className="space-y-2">
          {deleteState?.error ? <FieldError>{deleteState.error}</FieldError> : null}
          <ConfirmAlertDialog
            trigger={
              <Button type="button" variant="destructive">
                Delete
              </Button>
            }
            title={`Delete ${product.name}?`}
            description="This removes the product from the catalogue."
            confirmLabel="Delete"
            pending={deletePending}
            onConfirm={() => {
              const data = new FormData();
              data.set("slug", product.slug);
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
