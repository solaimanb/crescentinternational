"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ContactContent, ContactOption, ProductContact } from "@/lib/content/types";

type ProductContactActionsProps = {
  contactContent: ContactContent;
  productContact: ProductContact;
};

type ContactModal = "whatsapp" | "email" | "phone" | "temp";

function toPhoneHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "#";
  }

  if (trimmed.startsWith("tel:")) {
    return trimmed;
  }

  return `tel:${trimmed.replace(/\s+/g, "")}`;
}

function toEmailHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "#";
  }

  if (trimmed.startsWith("mailto:")) {
    return trimmed;
  }

  return `mailto:${trimmed}`;
}

const WHATSAPP_HOSTS = new Set(["wa.me", "api.whatsapp.com", "www.wa.me"]);

function toWhatsappHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "#";
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" && WHATSAPP_HOSTS.has(url.hostname)) {
      return trimmed;
    }
  } catch {
    // not a URL
  }

  const digits = trimmed.replace(/\D+/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

function withFallback(options: ContactOption[], fallback: ContactOption): ContactOption[] {
  return options.some((option) => option.value === fallback.value) ? options : [...options, fallback];
}

export default function ProductContactActions({
  contactContent,
  productContact,
}: ProductContactActionsProps) {
  const [activeModal, setActiveModal] = useState<ContactModal | "">("");

  const whatsappOptions = useMemo(() => {
    const options: ContactOption[] = [...contactContent.whatsappOptions];

    if (productContact.whatsappHref && productContact.whatsappHref !== contactContent.defaultWhatsappHref) {
      options.unshift({
        label: "Product WhatsApp",
        value: productContact.whatsappHref,
      });
    }

    return withFallback(options, { label: "WhatsApp", value: contactContent.defaultWhatsappHref });
  }, [contactContent.defaultWhatsappHref, contactContent.whatsappOptions, productContact.whatsappHref]);

  const phoneOptions = useMemo(() => {
    const options: ContactOption[] = [...contactContent.phoneOptions];

    if (productContact.phoneValue && productContact.phoneValue !== contactContent.phoneValue) {
      options.unshift({
        label: "Product Phone",
        value: productContact.phoneValue,
      });
    }

    return withFallback(options, { label: contactContent.phoneLabel, value: contactContent.phoneValue });
  }, [contactContent.phoneLabel, contactContent.phoneOptions, contactContent.phoneValue, productContact.phoneValue]);

  const emailOptions = useMemo(() => {
    const options: ContactOption[] = [...contactContent.emailOptions];

    if (productContact.emailValue && productContact.emailValue !== contactContent.emailValue) {
      options.unshift({
        label: "Product Email",
        value: productContact.emailValue,
      });
    }

    return withFallback(options, { label: contactContent.emailLabel, value: contactContent.emailValue });
  }, [contactContent.emailLabel, contactContent.emailOptions, contactContent.emailValue, productContact.emailValue]);

  const tempOptions = useMemo(() => {
    const options: ContactOption[] = [];

    if (productContact.tempValue && productContact.tempValue !== contactContent.defaultTempHref) {
      options.push({ label: "Product Works", value: productContact.tempValue });
    }

    return withFallback(options, { label: contactContent.tempButtonLabel, value: contactContent.defaultTempHref });
  }, [contactContent.defaultTempHref, contactContent.tempButtonLabel, productContact.tempValue]);

  const modalConfig = {
    whatsapp: {
      title: contactContent.whatsappPopupTitle,
      options: whatsappOptions,
      hrefBuilder: toWhatsappHref,
      target: "_blank" as const,
    },
    email: {
      title: contactContent.emailPopupTitle,
      options: emailOptions,
      hrefBuilder: toEmailHref,
      target: "_self" as const,
    },
    phone: {
      title: contactContent.phonePopupTitle,
      options: phoneOptions,
      hrefBuilder: toPhoneHref,
      target: "_self" as const,
    },
    temp: {
      title: contactContent.tempButtonLabel,
      options: tempOptions,
      hrefBuilder: toPhoneHref,
      target: "_self" as const,
    },
  };

  const activeConfig = activeModal ? modalConfig[activeModal] : null;

  return (
    <>
      <h2 className="mb-4 text-xl font-bold md:text-2xl">{contactContent.purchaseSectionTitle}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Button size="lg" onClick={() => setActiveModal("whatsapp")}>
          {contactContent.whatsappButtonLabel}
        </Button>
        <Button size="lg" variant="outline" onClick={() => setActiveModal("email")}>
          {contactContent.emailButtonLabel}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => setActiveModal("phone")}>
          {contactContent.phoneButtonLabel}
        </Button>
        <Button size="lg" variant="destructive" onClick={() => setActiveModal("temp")}>
          {contactContent.tempButtonLabel}
        </Button>
      </div>

      <Dialog
        open={Boolean(activeConfig)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveModal("");
          }
        }}
      >
        <DialogContent data-lenis-prevent>
          <DialogHeader>
            <DialogTitle>{activeConfig?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {activeConfig?.options.map((item, index) => (
              <Button
                key={`${item.label}-${item.value}-${index}`}
                nativeButton={false}
                variant="outline"
                className="h-auto w-full flex-col items-start py-2"
                render={
                  <a
                    href={activeConfig.hrefBuilder(item.value)}
                    target={activeConfig.target}
                    rel={activeConfig.target === "_blank" ? "noopener noreferrer" : undefined}
                  />
                }
                onClick={() => setActiveModal("")}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xs font-normal text-muted-foreground">{item.value}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
