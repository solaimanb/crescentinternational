import "server-only";

import { asc } from "drizzle-orm";
import { category, product } from "@/lib/catalog-schema";
import { db } from "@/lib/db";

export type OverviewMatrix = {
  totals: {
    categories: number;
    products: number;
    productsWithImages: number;
  };
  categories: {
    slug: string;
    name: string;
    products: number;
    withImages: number;
    homepageDesktopCount: number;
    homepageMobileCount: number;
  }[];
};

export async function getOverviewMatrix(): Promise<OverviewMatrix> {
  const [categories, products] = await Promise.all([
    db
      .select({
        slug: category.slug,
        name: category.name,
        homepageDesktopCount: category.homepageDesktopCount,
        homepageMobileCount: category.homepageMobileCount,
      })
      .from(category)
      .orderBy(asc(category.sortOrder), asc(category.name)),
    db.select({ categorySlug: product.categorySlug, images: product.images }).from(product),
  ]);

  const byCategory = new Map<string, { products: number; withImages: number }>();
  let productsWithImages = 0;

  for (const row of products) {
    const withImage = row.images.length > 0;
    if (withImage) {
      productsWithImages += 1;
    }
    const current = byCategory.get(row.categorySlug) ?? { products: 0, withImages: 0 };
    current.products += 1;
    if (withImage) {
      current.withImages += 1;
    }
    byCategory.set(row.categorySlug, current);
  }

  return {
    totals: {
      categories: categories.length,
      products: products.length,
      productsWithImages,
    },
    categories: categories.map((item) => {
      const counts = byCategory.get(item.slug) ?? { products: 0, withImages: 0 };
      return {
        slug: item.slug,
        name: item.name,
        products: counts.products,
        withImages: counts.withImages,
        homepageDesktopCount: item.homepageDesktopCount,
        homepageMobileCount: item.homepageMobileCount,
      };
    }),
  };
}
