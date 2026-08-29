import { z } from "zod";

const contactOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const homeBannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  sortOrder: z.number().int(),
});

export const homeBannersSchema = z.object({
  items: z.array(homeBannerSchema),
});

export const homeContentSchema = z.object({
  logoImage: z.string(),
  logoImageAlt: z.string(),
  wheelTitle: z.string(),
  wheelCtaLabel: z.string(),
  wheelCtaHref: z.string(),
  wheelProductsPerCategory: z.number().int().nonnegative(),
});

export const contactContentSchema = z.object({
  title: z.string(),
  intro: z.string(),
  phoneLabel: z.string(),
  phoneValue: z.string(),
  emailLabel: z.string(),
  emailValue: z.string(),
  purchaseSectionTitle: z.string(),
  whatsappButtonLabel: z.string(),
  emailButtonLabel: z.string(),
  phoneButtonLabel: z.string(),
  tempButtonLabel: z.string(),
  whatsappPopupTitle: z.string(),
  emailPopupTitle: z.string(),
  phonePopupTitle: z.string(),
  defaultWhatsappHref: z.string(),
  defaultTempHref: z.string(),
  whatsappOptions: z.array(contactOptionSchema),
  phoneOptions: z.array(contactOptionSchema),
  emailOptions: z.array(contactOptionSchema),
});

export const footerContentSchema = z.object({
  brandName: z.string(),
  description: z.string(),
  homeButtonLabel: z.string(),
  homeButtonHref: z.string(),
  categoriesButtonLabel: z.string(),
  categoriesButtonHref: z.string(),
  contactButtonLabel: z.string(),
  contactButtonHref: z.string(),
  aboutButtonLabel: z.string(),
  aboutButtonHref: z.string(),
  findUsLabel: z.string(),
  mapPlaceLabel: z.string(),
  mapUrl: z.string(),
  phoneLabel: z.string(),
  phones: z.array(z.string()),
  emailLabel: z.string(),
  emails: z.array(z.string()),
  addressLabel: z.string(),
  addressValue: z.string(),
  footerNote: z.string(),
});

export const pageContentSchema = z.object({
  title: z.string(),
});
