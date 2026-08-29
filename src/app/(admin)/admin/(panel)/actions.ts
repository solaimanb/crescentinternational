"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { eq } from "drizzle-orm";
import { getAllCategories } from "@/lib/catalog/categories";
import { category, product, siteSetting } from "@/lib/catalog-schema";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { uploadMediaFile } from "@/lib/storage";
import {
  bannerFormSchema,
  categoryFormSchema,
  productFormSchema,
  siteSettingsFormSchema,
} from "@/lib/forms/schemas";
import {
  contactContentSchema,
  footerContentSchema,
  homeBannersSchema,
  homeContentSchema,
  pageContentSchema,
} from "@/lib/content/schema";

export type ActionState = { error: string } | null;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateCatalog(slug?: string) {
  updateTag("catalog");
  revalidatePath("/", "layout");
  revalidatePath("/all-products");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/banners");
  if (slug) {
    revalidatePath(`/products/${slug}`);
    revalidatePath(`/admin/products/${slug}`);
  }
}

async function upsertCategory(values: typeof category.$inferInsert) {
  const [existing] = await db.select().from(category).where(eq(category.slug, values.slug)).limit(1);

  if (existing) {
    await db.update(category).set(values).where(eq(category.slug, values.slug));
    return;
  }

  await db.insert(category).values(values);
}

async function upsertProduct(values: typeof product.$inferInsert) {
  const [existing] = await db.select().from(product).where(eq(product.slug, values.slug)).limit(1);

  if (existing) {
    await db.update(product).set(values).where(eq(product.slug, values.slug));
    return;
  }

  await db.insert(product).values(values);
}

async function uploadCatalogImages(files: File[], prefix: string) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const urls: string[] = [];

  for (const file of files) {
    if (file.size === 0) {
      continue;
    }
    if (!allowed.includes(file.type)) {
      throw new Error("Use a JPEG, PNG, WebP, GIF, or SVG image.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Images must be 5MB or smaller.");
    }
    urls.push(await uploadMediaFile(file, prefix));
  }

  return urls;
}

export async function saveProductAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const existingImages = formData
    .getAll("images")
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  const newFiles = formData
    .getAll("newImages")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const parsed = productFormSchema.safeParse({
    slug: field(formData, "slug"),
    name: field(formData, "name"),
    categorySlug: field(formData, "categorySlug"),
    priceRange: field(formData, "priceRange"),
    shortDescription: field(formData, "shortDescription"),
    description: field(formData, "description"),
    contactWhatsapp: field(formData, "contactWhatsapp"),
    contactEmail: field(formData, "contactEmail"),
    contactPhone: field(formData, "contactPhone"),
    contactTemp: field(formData, "contactTemp"),
    seoHashtags: field(formData, "seoHashtags"),
    images: existingImages,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product." };
  }

  const { slug: existingSlug, name, categorySlug, seoHashtags, ...rest } = parsed.data;
  const catalogs = await getAllCategories();
  const catalog = catalogs.find((item) => item.slug === categorySlug);
  if (!catalog) {
    return { error: "Choose a category that exists." };
  }

  const slug = existingSlug.trim() || slugify(name);

  let uploaded: string[] = [];
  try {
    uploaded = await uploadCatalogImages(newFiles, `products/${slug || "draft"}`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not upload images." };
  }

  await upsertProduct({
    slug,
    name,
    category: catalog.name,
    categorySlug,
    priceRange: rest.priceRange,
    shortDescription: rest.shortDescription,
    images: [...rest.images, ...uploaded],
    contactWhatsapp: rest.contactWhatsapp,
    contactEmail: rest.contactEmail,
    contactPhone: rest.contactPhone,
    contactTemp: rest.contactTemp,
    seoHashtags: seoHashtags
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    description: rest.description,
  });

  revalidateCatalog(slug);
  redirect("/admin/products" as Route);
}

export async function deleteProductAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const normalized = field(formData, "slug").trim();
  if (!normalized) {
    return { error: "Missing product slug." };
  }

  await db.delete(product).where(eq(product.slug, normalized));
  revalidateCatalog(normalized);
  redirect("/admin/products" as Route);
}

export async function saveCategoryAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = categoryFormSchema.safeParse({
    slug: field(formData, "slug"),
    name: field(formData, "name"),
    description: field(formData, "description"),
    order: field(formData, "order"),
    homepageDesktopCount: field(formData, "homepageDesktopCount"),
    homepageMobileCount: field(formData, "homepageMobileCount"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid category." };
  }

  const slug = parsed.data.slug.trim() || slugify(parsed.data.name);
  if (!slug) {
    return { error: "Name is required." };
  }

  const sortOrder = Number(parsed.data.order);
  const homepageDesktopCount = Number(parsed.data.homepageDesktopCount);
  const homepageMobileCount = Number(parsed.data.homepageMobileCount);

  if (!Number.isInteger(sortOrder) || sortOrder < 1) {
    return { error: "Order must be a positive number." };
  }

  if (!Number.isInteger(homepageDesktopCount) || homepageDesktopCount < 1 || homepageDesktopCount > 12) {
    return { error: "Homepage desktop count must be between 1 and 12." };
  }

  if (!Number.isInteger(homepageMobileCount) || homepageMobileCount < 1 || homepageMobileCount > 6) {
    return { error: "Homepage mobile count must be between 1 and 6." };
  }

  await upsertCategory({
    slug,
    name: parsed.data.name,
    description: parsed.data.description,
    sortOrder,
    homepageDesktopCount,
    homepageMobileCount: Math.min(homepageMobileCount, homepageDesktopCount),
  });

  revalidateCatalog();
  redirect("/admin/categories" as Route);
}

export async function deleteCategoryAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const normalized = field(formData, "slug").trim();
  if (!normalized) {
    return { error: "Missing category slug." };
  }

  await db.delete(category).where(eq(category.slug, normalized));
  revalidateCatalog();
  redirect("/admin/categories" as Route);
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function optionLines(value: string) {
  return lines(value).map((line) => {
    const separator = line.indexOf("|");
    if (separator === -1) {
      return { label: line, value: line };
    }

    return {
      label: line.slice(0, separator).trim(),
      value: line.slice(separator + 1).trim(),
    };
  });
}

async function upsertSetting(id: string, data: Record<string, unknown>, body = "") {
  const [existing] = await db.select().from(siteSetting).where(eq(siteSetting.id, id)).limit(1);
  if (existing) {
    await db.update(siteSetting).set({ data, body }).where(eq(siteSetting.id, id));
    return;
  }

  await db.insert(siteSetting).values({ id, data, body });
}

export async function saveSiteSettingsAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const raw: Record<string, string> = {};
  for (const key of Object.keys(siteSettingsFormSchema.shape)) {
    raw[key] = field(formData, key);
  }

  const parsed = siteSettingsFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  const values = parsed.data;
  const wheelProductsPerCategory = Number(values.wheelProductsPerCategory);
  if (!Number.isFinite(wheelProductsPerCategory) || wheelProductsPerCategory < 0) {
    return { error: "Featured count must be a number." };
  }

  const home = homeContentSchema.safeParse({
    logoImage: values.logoImage,
    logoImageAlt: values.logoImageAlt,
    wheelTitle: values.wheelTitle,
    wheelCtaLabel: values.wheelCtaLabel,
    wheelCtaHref: values.wheelCtaHref,
    wheelProductsPerCategory,
  });
  const contact = contactContentSchema.safeParse({
    title: values.contactTitle,
    intro: values.contactIntro,
    phoneLabel: values.contactPhoneLabel,
    phoneValue: values.contactPhoneValue,
    emailLabel: values.contactEmailLabel,
    emailValue: values.contactEmailValue,
    purchaseSectionTitle: values.purchaseSectionTitle,
    whatsappButtonLabel: values.whatsappButtonLabel,
    emailButtonLabel: values.emailButtonLabel,
    phoneButtonLabel: values.phoneButtonLabel,
    tempButtonLabel: values.tempButtonLabel,
    whatsappPopupTitle: values.whatsappPopupTitle,
    emailPopupTitle: values.emailPopupTitle,
    phonePopupTitle: values.phonePopupTitle,
    defaultWhatsappHref: values.defaultWhatsappHref,
    defaultTempHref: values.defaultTempHref,
    whatsappOptions: optionLines(values.whatsappOptions),
    phoneOptions: optionLines(values.phoneOptions),
    emailOptions: optionLines(values.emailOptions),
  });
  const footer = footerContentSchema.safeParse({
    brandName: values.brandName,
    description: values.brandDescription,
    homeButtonLabel: values.homeButtonLabel,
    homeButtonHref: values.homeButtonHref,
    categoriesButtonLabel: values.categoriesButtonLabel,
    categoriesButtonHref: values.categoriesButtonHref,
    contactButtonLabel: values.contactButtonLabel,
    contactButtonHref: values.contactButtonHref,
    aboutButtonLabel: values.aboutButtonLabel,
    aboutButtonHref: values.aboutButtonHref,
    findUsLabel: values.findUsLabel,
    mapPlaceLabel: values.mapPlaceLabel,
    mapUrl: values.mapUrl,
    phoneLabel: values.footerPhoneLabel,
    phones: lines(values.phones),
    emailLabel: values.footerEmailLabel,
    emails: lines(values.emails),
    addressLabel: "Address",
    addressValue: values.address,
    footerNote: values.footerNote,
  });
  const about = pageContentSchema.safeParse({ title: values.aboutTitle });
  const terms = pageContentSchema.safeParse({ title: values.termsTitle });

  if (!home.success || !contact.success || !footer.success || !about.success || !terms.success) {
    return { error: "Settings could not be saved." };
  }

  await upsertSetting("home", home.data);
  await upsertSetting("contact", contact.data);
  await upsertSetting("footer", footer.data);
  await upsertSetting("about", about.data, values.aboutBody);
  await upsertSetting("terms", terms.data, values.termsBody);

  updateTag("catalog");
  revalidatePath("/", "layout");
  revalidatePath("/about-us");
  revalidatePath("/contact-us");
  revalidatePath("/terms-and-conditions");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  redirect("/admin/settings" as Route);
}

async function loadBannerItems() {
  const [row] = await db.select().from(siteSetting).where(eq(siteSetting.id, "banners")).limit(1);
  if (!row) {
    return [];
  }
  const parsed = homeBannersSchema.safeParse(row.data);
  return parsed.success ? parsed.data.items : [];
}

export async function saveBannerAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = bannerFormSchema.safeParse({
    id: field(formData, "id"),
    title: field(formData, "title"),
    subtitle: field(formData, "subtitle"),
    imageAlt: field(formData, "imageAlt"),
    sortOrder: field(formData, "sortOrder"),
    image: field(formData, "image"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid banner." };
  }

  const sortOrder = Number(parsed.data.sortOrder);
  if (!Number.isFinite(sortOrder) || sortOrder < 1) {
    return { error: "Order must be a number." };
  }

  const file = formData.get("imageFile");
  let image = parsed.data.image;
  if (file instanceof File && file.size > 0) {
    try {
      const [uploaded] = await uploadCatalogImages([file], `banners/${parsed.data.id || "draft"}`);
      if (uploaded) {
        image = uploaded;
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Could not upload image." };
    }
  }

  if (!image) {
    return { error: "Add a banner image." };
  }

  const id = parsed.data.id || crypto.randomUUID();
  const next = {
    id,
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    image,
    imageAlt: parsed.data.imageAlt,
    sortOrder,
  };
  const remaining = (await loadBannerItems()).filter((item) => item.id !== id);
  remaining.push(next);
  remaining.sort((a, b) => a.sortOrder - b.sortOrder);

  await upsertSetting("banners", { items: remaining });
  revalidateCatalog();
  revalidatePath("/admin/banners");
  redirect(`/admin/banners/${id}` as Route);
}

export async function deleteBannerAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = field(formData, "id").trim();
  if (!id) {
    return { error: "Missing banner." };
  }

  const items = (await loadBannerItems()).filter((item) => item.id !== id);
  await upsertSetting("banners", { items });
  revalidateCatalog();
  revalidatePath("/admin/banners");
  redirect("/admin/banners" as Route);
}
