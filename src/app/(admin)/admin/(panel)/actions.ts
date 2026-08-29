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
  categoryFormSchema,
  productFormSchema,
  settingFormSchema,
} from "@/lib/forms/schemas";

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

async function uploadProductImages(slug: string, files: File[]) {
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
    urls.push(await uploadMediaFile(file, `products/${slug || "draft"}`));
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
    uploaded = await uploadProductImages(slug, newFiles);
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

export async function saveSettingAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = settingFormSchema.safeParse({
    id: field(formData, "id"),
    data: field(formData, "data"),
    body: field(formData, "body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  const data = JSON.parse(parsed.data.data) as Record<string, unknown>;
  const { id, body } = parsed.data;

  const [existing] = await db.select().from(siteSetting).where(eq(siteSetting.id, id)).limit(1);
  if (existing) {
    await db.update(siteSetting).set({ data, body }).where(eq(siteSetting.id, id));
  } else {
    await db.insert(siteSetting).values({ id, data, body });
  }

  updateTag("catalog");
  revalidatePath("/", "layout");
  revalidatePath("/about-us");
  revalidatePath("/contact-us");
  revalidatePath("/terms-and-conditions");
  revalidatePath("/admin");
  redirect(`/admin/settings/${id}` as Route);
}
