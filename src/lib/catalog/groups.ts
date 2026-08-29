import type { CategoryDefinition, CategoryGroup, Product } from "@/lib/catalog/types";

export function getCategoryGroups(products: Product[], categories: CategoryDefinition[]): CategoryGroup[] {
  return categories.map((catalog) => ({
    ...catalog,
    products: products.filter((item) => item.categorySlug === catalog.slug),
  }));
}

export function getWheelProducts(
  products: Product[],
  productsPerCategory: number,
  categories: CategoryDefinition[],
): Product[] {
  return categories.flatMap((catalog) =>
    products.filter((item) => item.categorySlug === catalog.slug).slice(0, productsPerCategory),
  );
}
