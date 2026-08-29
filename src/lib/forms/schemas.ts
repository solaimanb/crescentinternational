import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const categoryFormSchema = z.object({
  slug: z.string(),
  name: z.string().min(1, "Name is required."),
  description: z.string(),
  order: z.string().min(1, "Order is required."),
  homepageDesktopCount: z.string().min(1, "Desktop count is required."),
  homepageMobileCount: z.string().min(1, "Mobile count is required."),
});

export const productFormSchema = z.object({
  slug: z.string(),
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
  images: z.array(z.string()),
});

export const bannerFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  subtitle: z.string(),
  imageAlt: z.string(),
  sortOrder: z.string().min(1, "Order is required."),
  image: z.string(),
});

export const siteSettingsFormSchema = z.object({
  brandName: z.string().min(1, "Brand name is required."),
  brandDescription: z.string(),
  address: z.string(),
  phones: z.string(),
  emails: z.string(),
  mapUrl: z.string(),
  mapPlaceLabel: z.string(),
  findUsLabel: z.string(),
  footerNote: z.string(),
  homeButtonLabel: z.string(),
  homeButtonHref: z.string(),
  categoriesButtonLabel: z.string(),
  categoriesButtonHref: z.string(),
  contactButtonLabel: z.string(),
  contactButtonHref: z.string(),
  aboutButtonLabel: z.string(),
  aboutButtonHref: z.string(),
  footerPhoneLabel: z.string(),
  footerEmailLabel: z.string(),
  logoImage: z.string(),
  logoImageAlt: z.string(),
  wheelTitle: z.string(),
  wheelCtaLabel: z.string(),
  wheelCtaHref: z.string(),
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
  defaultWhatsappHref: z.string(),
  defaultTempHref: z.string(),
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
