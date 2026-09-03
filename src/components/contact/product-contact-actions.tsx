"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContactContent, ContactOption, ProductContact } from "@/lib/content/types";

type ProductContactActionsProps = {
  contactContent: ContactContent;
  productContact: ProductContact;
};

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
    // not a URL — fall through to digit extraction below
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
  const [activeModal, setActiveModal] = useState("");

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  const activeConfig = activeModal in modalConfig ? modalConfig[activeModal as keyof typeof modalConfig] : null;

  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-slate-900 md:text-2xl">{contactContent.purchaseSectionTitle}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveModal("whatsapp")}
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          {contactContent.whatsappButtonLabel}
        </button>
        <button
          type="button"
          onClick={() => setActiveModal("email")}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {contactContent.emailButtonLabel}
        </button>
        <button
          type="button"
          onClick={() => setActiveModal("phone")}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {contactContent.phoneButtonLabel}
        </button>
        <button
          type="button"
          onClick={() => setActiveModal("temp")}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          {contactContent.tempButtonLabel}
        </button>
      </div>

      {activeConfig ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent px-4 backdrop-blur-[70px]"
          data-lenis-prevent
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveModal("");
            }
          }}
        >
          <div className="w-full max-w-md rounded-xs p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-white">{activeConfig.title}</h3>
              <button
                type="button"
                onClick={() => setActiveModal("")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/60 bg-transparent text-sm font-bold text-white transition hover:bg-white/15"
                aria-label="Close contact options"
              >
                X
              </button>
            </div>

            <div className="space-y-2">
              {activeConfig.options.map((item, index) => (
                <a
                  key={`${item.label}-${item.value}-${index}`}
                  href={activeConfig.hrefBuilder(item.value)}
                  target={activeConfig.target}
                  rel={activeConfig.target === "_blank" ? "noopener noreferrer" : undefined}
                  onClick={() => setActiveModal("")}
                  className="block rounded-xs border border-white/70 bg-white/85 px-3 py-2 transition hover:border-white hover:bg-white/95"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-600">{item.value}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
