import "server-only";

import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { category as categoryTable } from "@/lib/catalog-schema";
import type { CategorySettings } from "@/lib/catalog/types";
import { db } from "@/lib/db";

function rowToCategory(row: typeof categoryTable.$inferSelect): CategorySettings {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    order: row.sortOrder,
    homepageDesktopCount: row.homepageDesktopCount,
    homepageMobileCount: row.homepageMobileCount,
  };
}

export async function getAllCategories(): Promise<CategorySettings[]> {
  return unstable_cache(
    async () => {
      const rows = await db
        .select()
        .from(categoryTable)
        .orderBy(asc(categoryTable.sortOrder), asc(categoryTable.name));

      return rows.map(rowToCategory);
    },
    ["catalog-categories"],
    { revalidate: 3600, tags: ["catalog"] },
  )();
}

export async function getCategoryBySlug(slug: string): Promise<CategorySettings | null> {
  return unstable_cache(
    async () => {
      const [row] = await db.select().from(categoryTable).where(eq(categoryTable.slug, slug)).limit(1);
      return row ? rowToCategory(row) : null;
    },
    ["catalog-category", slug],
    { revalidate: 3600, tags: ["catalog"] },
  )();
}
