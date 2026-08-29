"use client";

import { startTransition, useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormInput, FormTextarea } from "../../../_components/rhf-fields";
import type { ContactContent, FooterContent, HomeContent } from "@/lib/content/types";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "@/lib/forms/schemas";
import { saveSiteSettingsAction, type ActionState } from "../../actions";

function optionLines(options: { label: string; value: string }[]) {
  return options.map((option) => `${option.label} | ${option.value}`).join("\n");
}

function settingsFormData(values: SiteSettingsFormValues) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, String(value ?? ""));
  }
  return data;
}

export function SettingsForm({
  home,
  contact,
  footer,
  about,
  terms,
}: {
  home: HomeContent | null;
  contact: ContactContent | null;
  footer: FooterContent | null;
  about: { title: string; body: string } | null;
  terms: { title: string; body: string } | null;
}) {
  const [state, formAction] = useActionState(saveSiteSettingsAction, null as ActionState);
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: {
      brandName: footer?.brandName ?? "",
      brandDescription: footer?.description ?? "",
      address: footer?.addressValue ?? "",
      phones: footer?.phones.join("\n") ?? "",
      emails: footer?.emails.join("\n") ?? "",
      mapUrl: footer?.mapUrl ?? "",
      mapPlaceLabel: footer?.mapPlaceLabel ?? "",
      findUsLabel: footer?.findUsLabel ?? "",
      footerNote: footer?.footerNote ?? "",
      homeButtonLabel: footer?.homeButtonLabel ?? "",
      homeButtonHref: footer?.homeButtonHref ?? "",
      categoriesButtonLabel: footer?.categoriesButtonLabel ?? "",
      categoriesButtonHref: footer?.categoriesButtonHref ?? "",
      contactButtonLabel: footer?.contactButtonLabel ?? "",
      contactButtonHref: footer?.contactButtonHref ?? "",
      aboutButtonLabel: footer?.aboutButtonLabel ?? "",
      aboutButtonHref: footer?.aboutButtonHref ?? "",
      footerPhoneLabel: footer?.phoneLabel ?? "",
      footerEmailLabel: footer?.emailLabel ?? "",
      logoImage: home?.logoImage ?? "",
      logoImageAlt: home?.logoImageAlt ?? "",
      wheelTitle: home?.wheelTitle ?? "",
      wheelCtaLabel: home?.wheelCtaLabel ?? "",
      wheelCtaHref: home?.wheelCtaHref ?? "",
      wheelProductsPerCategory: String(home?.wheelProductsPerCategory ?? 2),
      contactTitle: contact?.title ?? "",
      contactIntro: contact?.intro ?? "",
      contactPhoneLabel: contact?.phoneLabel ?? "",
      contactPhoneValue: contact?.phoneValue ?? "",
      contactEmailLabel: contact?.emailLabel ?? "",
      contactEmailValue: contact?.emailValue ?? "",
      purchaseSectionTitle: contact?.purchaseSectionTitle ?? "",
      whatsappButtonLabel: contact?.whatsappButtonLabel ?? "",
      emailButtonLabel: contact?.emailButtonLabel ?? "",
      phoneButtonLabel: contact?.phoneButtonLabel ?? "",
      tempButtonLabel: contact?.tempButtonLabel ?? "",
      whatsappPopupTitle: contact?.whatsappPopupTitle ?? "",
      emailPopupTitle: contact?.emailPopupTitle ?? "",
      phonePopupTitle: contact?.phonePopupTitle ?? "",
      defaultWhatsappHref: contact?.defaultWhatsappHref ?? "",
      defaultTempHref: contact?.defaultTempHref ?? "",
      whatsappOptions: optionLines(contact?.whatsappOptions ?? []),
      phoneOptions: optionLines(contact?.phoneOptions ?? []),
      emailOptions: optionLines(contact?.emailOptions ?? []),
      aboutTitle: about?.title ?? "",
      aboutBody: about?.body ?? "",
      termsTitle: terms?.title ?? "",
      termsBody: terms?.body ?? "",
    },
  });

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        startTransition(() => {
          formAction(settingsFormData(values));
        });
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4 md:grid md:grid-cols-2">
            <FormInput control={form.control} name="brandName" label="Brand name" />
            <FormInput control={form.control} name="address" label="Address" />
            <FormTextarea control={form.control} name="brandDescription" label="Short description" className="md:col-span-2" />
            <FormTextarea control={form.control} name="phones" label="Phones (one per line)" />
            <FormTextarea control={form.control} name="emails" label="Emails (one per line)" />
            <FormInput control={form.control} name="mapUrl" label="Map URL" />
            <FormInput control={form.control} name="mapPlaceLabel" label="Map label" />
            <FormInput control={form.control} name="findUsLabel" label="Find-us heading" />
            <FormInput control={form.control} name="footerNote" label="Footer note" />
            <FormInput control={form.control} name="footerPhoneLabel" label="Phone heading" />
            <FormInput control={form.control} name="footerEmailLabel" label="Email heading" />
            <FormInput control={form.control} name="homeButtonLabel" label="Home link label" />
            <FormInput control={form.control} name="homeButtonHref" label="Home link URL" />
            <FormInput control={form.control} name="categoriesButtonLabel" label="Categories link label" />
            <FormInput control={form.control} name="categoriesButtonHref" label="Categories link URL" />
            <FormInput control={form.control} name="contactButtonLabel" label="Contact link label" />
            <FormInput control={form.control} name="contactButtonHref" label="Contact link URL" />
            <FormInput control={form.control} name="aboutButtonLabel" label="About link label" />
            <FormInput control={form.control} name="aboutButtonHref" label="About link URL" />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4 md:grid md:grid-cols-2">
            <FormInput control={form.control} name="logoImage" label="Logo image URL" />
            <FormInput control={form.control} name="logoImageAlt" label="Logo alt text" />
            <FormInput control={form.control} name="wheelTitle" label="Featured heading" />
            <FormInput control={form.control} name="wheelProductsPerCategory" label="Products per category" type="number" min={0} />
            <FormInput control={form.control} name="wheelCtaLabel" label="Featured link label" />
            <FormInput control={form.control} name="wheelCtaHref" label="Featured link URL" />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales contact</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4 md:grid md:grid-cols-2">
            <FormInput control={form.control} name="contactTitle" label="Page title" />
            <FormInput control={form.control} name="purchaseSectionTitle" label="Enquiry heading" />
            <FormTextarea control={form.control} name="contactIntro" label="Intro" className="md:col-span-2" />
            <FormInput control={form.control} name="contactPhoneLabel" label="Phone label" />
            <FormInput control={form.control} name="contactPhoneValue" label="Phone" />
            <FormInput control={form.control} name="contactEmailLabel" label="Email label" />
            <FormInput control={form.control} name="contactEmailValue" label="Email" />
            <FormInput control={form.control} name="whatsappButtonLabel" label="WhatsApp button" />
            <FormInput control={form.control} name="emailButtonLabel" label="Email button" />
            <FormInput control={form.control} name="phoneButtonLabel" label="Phone button" />
            <FormInput control={form.control} name="tempButtonLabel" label="Works button" />
            <FormInput control={form.control} name="whatsappPopupTitle" label="WhatsApp popup title" />
            <FormInput control={form.control} name="emailPopupTitle" label="Email popup title" />
            <FormInput control={form.control} name="phonePopupTitle" label="Phone popup title" />
            <FormInput control={form.control} name="defaultWhatsappHref" label="Default WhatsApp URL" />
            <FormInput control={form.control} name="defaultTempHref" label="Works URL" />
            <FormTextarea control={form.control} name="whatsappOptions" label="WhatsApp options (label | value)" />
            <FormTextarea control={form.control} name="phoneOptions" label="Phone options (label | value)" />
            <FormTextarea control={form.control} name="emailOptions" label="Email options (label | value)" className="md:col-span-2" />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FormInput control={form.control} name="aboutTitle" label="Title" />
            <FormTextarea control={form.control} name="aboutBody" label="Body" className="min-h-40" />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FormInput control={form.control} name="termsTitle" label="Title" />
            <FormTextarea control={form.control} name="termsBody" label="Body" className="min-h-40" />
          </FieldGroup>
        </CardContent>
      </Card>

      {state?.error ? <FieldError>{state.error}</FieldError> : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
