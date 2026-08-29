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

export const settingFormSchema = z.object({
  id: z.string().min(1),
  data: z.string().refine((value) => {
    try {
      const parsed: unknown = JSON.parse(value);
      return Boolean(parsed) && typeof parsed === "object" && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Settings must be a JSON object."),
  body: z.string(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type SettingFormValues = z.infer<typeof settingFormSchema>;
