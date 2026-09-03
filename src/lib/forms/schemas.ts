import { z } from "zod";
import { isAllowedImageUrl, isSafeCmsHref, isSafeHttpUrl, isValidSlug } from "@/lib/content-safety";

const optionalSlugSchema = z
  .string()
  .max(96, "Slug must be 96 characters or fewer.")
  .refine((value) => !value || isValidSlug(value), "Slug may only contain lowercase letters, numbers, and hyphens.");

const cmsHrefSchema = z.string().refine(isSafeCmsHref, "Use an internal path or an HTTP(S) URL.");
const httpUrlSchema = z.string().refine(isSafeHttpUrl, "Use an HTTP(S) URL.");
const imageUrlSchema = z.string().refine(isAllowedImageUrl, "Use an approved HTTPS image URL.");

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const categoryFormSchema = z.object({
  slug: optionalSlugSchema,
  name: z.string().min(1, "Name is required."),
  description: z.string(),
  order: z.string().min(1, "Order is required."),
  homepageDesktopCount: z.string().min(1, "Desktop count is required."),
  homepageMobileCount: z.string().min(1, "Mobile count is required."),
});

export const productFormSchema = z.object({
  slug: optionalSlugSchema,
  name: z.string().min(1, "Name is required."),
  categorySlug: z.string().min(1, "Choose a category."),
  priceRange: z.string().min(1, "Price range is required."),
  shortDescription: z.string().min(1, "Short description is required."),
  description: z.string().min(1, "Description is required."),
  contactWhatsapp: z.string(),
  contactEmail: z.union([z.literal(""), z.email("Enter a valid email.")]),
  contactPhone: z.string(),
  contactTemp: z.string(),
  seoHashtags: z.string(),
  images: z.array(imageUrlSchema),
});

export const bannerFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  subtitle: z.string(),
  imageAlt: z.string(),
  sortOrder: z.string().min(1, "Order is required."),
  image: z.union([z.literal(""), imageUrlSchema]),
});

export const siteSettingsFormSchema = z.object({
  brandName: z.string().min(1, "Brand name is required."),
  brandDescription: z.string(),
  address: z.string(),
  phones: z.string(),
  emails: z.string(),
  mapUrl: httpUrlSchema,
  mapPlaceLabel: z.string(),
  findUsLabel: z.string(),
  footerNote: z.string(),
  homeButtonLabel: z.string(),
  homeButtonHref: cmsHrefSchema,
  categoriesButtonLabel: z.string(),
  categoriesButtonHref: cmsHrefSchema,
  contactButtonLabel: z.string(),
  contactButtonHref: cmsHrefSchema,
  aboutButtonLabel: z.string(),
  aboutButtonHref: cmsHrefSchema,
  footerPhoneLabel: z.string(),
  footerEmailLabel: z.string(),
  logoImage: z.union([z.literal(""), imageUrlSchema]),
  logoImageAlt: z.string(),
  wheelTitle: z.string(),
  wheelCtaLabel: z.string(),
  wheelCtaHref: cmsHrefSchema,
  wheelProductsPerCategory: z.string().min(1, "Featured count is required."),
  contactTitle: z.string(),
  contactIntro: z.string(),
  contactPhoneLabel: z.string(),
  contactPhoneValue: z.string(),
  contactEmailLabel: z.string(),
  contactEmailValue: z.string(),
  purchaseSectionTitle: z.string(),
  whatsappButtonLabel: z.string(),
  emailButtonLabel: z.string(),
  phoneButtonLabel: z.string(),
  tempButtonLabel: z.string(),
  whatsappPopupTitle: z.string(),
  emailPopupTitle: z.string(),
  phonePopupTitle: z.string(),
  defaultWhatsappHref: httpUrlSchema,
  defaultTempHref: z.string().regex(/^tel:\+?[0-9().\-\s]+$/, "Use a tel: URL."),
  whatsappOptions: z.string(),
  phoneOptions: z.string(),
  emailOptions: z.string(),
  aboutTitle: z.string(),
  aboutBody: z.string(),
  termsTitle: z.string(),
  termsBody: z.string(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
export type BannerFormValues = z.infer<typeof bannerFormSchema>;
