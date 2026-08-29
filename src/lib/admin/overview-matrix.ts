import "server-only";

import { asc } from "drizzle-orm";
import { category, product, siteSetting } from "@/lib/catalog-schema";
import { homeBannersSchema } from "@/lib/content/schema";
import { db } from "@/lib/db";

export type OverviewMatrix = {
  totals: {
    categories: number;
    products: number;
    productsWithImages: number;
    productsWithoutImages: number;
    banners: number;
    settings: number;
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
  const [categories, products, settings] = await Promise.all([
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
    db.select({ id: siteSetting.id, data: siteSetting.data }).from(siteSetting),
  ]);

  const bannersRow = settings.find((row) => row.id === "banners");
  const bannersParsed = bannersRow ? homeBannersSchema.safeParse(bannersRow.data) : null;
  const bannerCount = bannersParsed?.success ? bannersParsed.data.items.length : 0;

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
      productsWithoutImages: products.length - productsWithImages,
      banners: bannerCount,
      settings: settings.length,
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
