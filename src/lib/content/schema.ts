import { z } from "zod";
import { isAllowedImageUrl, isSafeCmsHref, isSafeHttpUrl } from "@/lib/content-safety";

const cmsHrefSchema = z.string().refine(isSafeCmsHref);
const httpUrlSchema = z.string().refine(isSafeHttpUrl);
const imageUrlSchema = z.string().refine(isAllowedImageUrl);

const contactOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const homeBannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  image: imageUrlSchema,
  imageAlt: z.string(),
  sortOrder: z.number().int(),
});

export const homeBannersSchema = z.object({
  items: z.array(homeBannerSchema),
});

export const homeContentSchema = z.object({
  logoImage: z.union([z.literal(""), imageUrlSchema]),
  logoImageAlt: z.string(),
  wheelTitle: z.string(),
  wheelCtaLabel: z.string(),
  wheelCtaHref: cmsHrefSchema,
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
  defaultWhatsappHref: httpUrlSchema,
  defaultTempHref: z.string().regex(/^tel:\+?[0-9().\-\s]+$/),
  whatsappOptions: z.array(contactOptionSchema),
  phoneOptions: z.array(contactOptionSchema),
  emailOptions: z.array(contactOptionSchema),
});

export const footerContentSchema = z.object({
  brandName: z.string(),
  description: z.string(),
  homeButtonLabel: z.string(),
  homeButtonHref: cmsHrefSchema,
  categoriesButtonLabel: z.string(),
  categoriesButtonHref: cmsHrefSchema,
  contactButtonLabel: z.string(),
  contactButtonHref: cmsHrefSchema,
  aboutButtonLabel: z.string(),
  aboutButtonHref: cmsHrefSchema,
  findUsLabel: z.string(),
  mapPlaceLabel: z.string(),
  mapUrl: httpUrlSchema,
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
