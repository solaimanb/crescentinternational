import Link from "next/link";
import type { Metadata } from "next";
import CatalogSidebar from "@/components/catalog/catalog-sidebar";
import ProductCard from "@/components/catalog/product-card";
import { ProductGrid, ProductGridItem } from "@/components/catalog/product-grid";
import { PaginationNav } from "@/components/pagination-nav";
import { JsonLd } from "@/components/seo-json-ld";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/catalog/products";
import { getWheelProducts } from "@/lib/catalog/groups";
import { getCategoryContent, getHomeContent } from "@/lib/content/site";
import { paginate } from "@/lib/paginate";
import { absoluteUrl, brandMetadata, catalogHref } from "@/lib/seo";

const PAGE_SIZE = 12;

function queryString(params: { category?: string; q?: string }) {
  const query: Record<string, string> = {};
  if (params.category) {
    query.category = params.category;
  }
  if (params.q) {
    query.q = params.q;
  }
  return query;
}

function filterProducts(
  products: Awaited<ReturnType<typeof getAllProducts>>,
  selectedCategory: string,
  q: string,
) {
  const needle = q.toLowerCase();
  return products.filter((product) => {
    if (selectedCategory && product.categorySlug !== selectedCategory) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return (
      product.name.toLowerCase().includes(needle) ||
      product.shortDescription.toLowerCase().includes(needle) ||
      product.slug.toLowerCase().includes(needle)
    );
  });
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/all-products">): Promise<Metadata> {
  const params = await searchParams;
  const selectedCategory = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const [products, categories, { description }] = await Promise.all([
    getAllProducts(),
    getCategoryContent(),
    brandMetadata(),
  ]);
  const category = categories.find((item) => item.slug === selectedCategory);
  const unknownCategory = Boolean(selectedCategory) && !category;
  const filteredProducts = filterProducts(products, selectedCategory, q);
  const { page } = paginate(filteredProducts, params.page, PAGE_SIZE);

  return {
    title: category?.name ?? "Catalogue",
    description: category?.description || description,
    alternates: {
      canonical: unknownCategory ? "/all-products" : catalogHref(selectedCategory, page, q ? { q } : {}),
    },
    robots: unknownCategory || q ? { index: false, follow: true } : undefined,
  };
}

export default async function AllProductsPage({
  searchParams,
}: PageProps<"/all-products">) {
  const params = await searchParams;
  const selectedCategory = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const [products, categories, homeContent] = await Promise.all([
    getAllProducts(),
    getCategoryContent(),
    getHomeContent(),
  ]);

  const filteredProducts = filterProducts(products, selectedCategory, q);
  const { page, totalPages, items: pagedProducts } = paginate(filteredProducts, params.page, PAGE_SIZE);
  const selectedCategoryName =
    categories.find((item) => item.slug === selectedCategory)?.name || "All Categories";
  const start = filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filteredProducts.length);
  const listQuery = queryString({ category: selectedCategory, q });
  const categoryDefinitions = categories.map((category) => ({ slug: category.slug, name: category.name }));
  const featuredProducts = homeContent
    ? getWheelProducts(products, homeContent.wheelProductsPerCategory, categoryDefinitions).slice(0, 3)
    : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: selectedCategoryName,
          url: absoluteUrl(
            categories.some((item) => item.slug === selectedCategory)
              ? catalogHref(selectedCategory, page, q ? { q } : {})
              : catalogHref("", page, q ? { q } : {}),
          ),
        }}
      />

      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">Catalogue</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{selectedCategoryName}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
        <CatalogSidebar
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          query={q}
          featuredTitle={homeContent?.wheelTitle ?? ""}
          featuredProducts={featuredProducts}
        />

        <div>
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length === 0
                ? "No products match this view."
                : `Showing ${start}–${end} of ${filteredProducts.length}`}
            </p>
            <Button nativeButton={false} variant="link" className="h-auto p-0" render={<Link href="/" />}>
              Back to Home
            </Button>
          </div>

          {pagedProducts.length > 0 ? (
            <ProductGrid className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {pagedProducts.map((product) => (
                <ProductGridItem key={product.slug}>
                  <ProductCard product={product} />
                </ProductGridItem>
              ))}
            </ProductGrid>
          ) : null}

          <PaginationNav
            className="mt-6"
            pathname="/all-products"
            page={page}
            totalPages={totalPages}
            query={listQuery}
          />
        </div>
      </div>
    </div>
  );
}
