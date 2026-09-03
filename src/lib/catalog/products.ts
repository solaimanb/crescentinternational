import "server-only";

import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import type { Product } from "@/lib/catalog/types";
import { getAllCategories } from "@/lib/catalog/categories";
import { product as productTable } from "@/lib/catalog-schema";
import { db } from "@/lib/db";

function rowToProduct(row: typeof productTable.$inferSelect): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    categorySlug: row.categorySlug,
    priceRange: row.priceRange,
    shortDescription: row.shortDescription,
    images: row.images,
    contactWhatsapp: row.contactWhatsapp,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    contactTemp: row.contactTemp,
    seoHashtags: row.seoHashtags,
    description: row.description,
  };
}

function sortProducts(products: Product[], categories: { slug: string; order: number }[]): Product[] {
  const categoryOrderLookup = new Map(categories.map((item) => [item.slug, item.order]));

  return [...products].sort((a, b) => {
    const aIndex = categoryOrderLookup.get(a.categorySlug) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = categoryOrderLookup.get(b.categorySlug) ?? Number.MAX_SAFE_INTEGER;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    return a.name.localeCompare(b.name);
  });
}

export async function getAllProducts(): Promise<Product[]> {
  return unstable_cache(
    async () => {
      const [categories, rows] = await Promise.all([getAllCategories(), db.select().from(productTable)]);
      return sortProducts(rows.map(rowToProduct), categories);
    },
    ["catalog-products"],
    { revalidate: 3600, tags: ["catalog"] },
  )();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return unstable_cache(
    async () => {
      const [row] = await db.select().from(productTable).where(eq(productTable.slug, slug)).limit(1);
      return row ? rowToProduct(row) : null;
    },
    ["catalog-product", slug],
    { revalidate: 3600, tags: ["catalog"] },
  )();
}
