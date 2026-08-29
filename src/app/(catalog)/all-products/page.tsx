import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/catalog/product-card";
import { ProductGrid, ProductGridItem } from "@/components/catalog/product-grid";
import { PaginationNav } from "@/components/pagination-nav";
import { JsonLd } from "@/components/seo-json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/catalog/products";
import { getCategoryContent } from "@/lib/content/site";
import { paginate } from "@/lib/paginate";
import { absoluteUrl, brandMetadata, catalogHref } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: PageProps<"/all-products">): Promise<Metadata> {
  const params = await searchParams;
  const selectedCategory = typeof params.category === "string" ? params.category : "";
  const [products, categories, { description }] = await Promise.all([
    getAllProducts(),
    getCategoryContent(),
    brandMetadata(),
  ]);
  const category = categories.find((item) => item.slug === selectedCategory);
  const unknownCategory = Boolean(selectedCategory) && !category;
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products;
  const { page } = paginate(filteredProducts, params.page, 12);

  return {
    title: category?.name ?? "Catalogue",
    description: category?.description || description,
    alternates: {
      canonical: unknownCategory ? "/all-products" : catalogHref(selectedCategory, page),
    },
    robots: unknownCategory ? { index: false, follow: true } : undefined,
  };
}

export default async function AllProductsPage({
  searchParams,
}: PageProps<"/all-products">) {
  const params = await searchParams;
  const selectedCategory = typeof params.category === "string" ? params.category : "";
  const [products, categories] = await Promise.all([getAllProducts(), getCategoryContent()]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products;

  const { page, totalPages, items: pagedProducts } = paginate(
    filteredProducts,
    params.page,
    12,
  );

  const selectedCategoryName =
    categories.find((item) => item.slug === selectedCategory)?.name || "All Categories";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: selectedCategoryName,
          url: absoluteUrl(
            categories.some((item) => item.slug === selectedCategory)
              ? catalogHref(selectedCategory, page)
              : catalogHref("", page),
          ),
        }}
      />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Catalogue</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{selectedCategoryName}</h1>
        </div>
        <Button nativeButton={false} variant="link" render={<Link href="/" />}>
          Back to Home
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Badge variant={selectedCategory ? "outline" : "default"} render={<Link href="/all-products" />}>
          All
        </Badge>
        {categories.map((item) => (
          <Badge
            key={item.slug}
            variant={selectedCategory === item.slug ? "default" : "outline"}
            render={<Link href={`/all-products?category=${item.slug}`} />}
          >
            {item.name}
          </Badge>
        ))}
      </div>

      <ProductGrid className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {pagedProducts.map((product) => (
          <ProductGridItem key={product.slug}>
            <ProductCard product={product} />
          </ProductGridItem>
        ))}
      </ProductGrid>

      <PaginationNav
        className="mt-6"
        pathname="/all-products"
        page={page}
        totalPages={totalPages}
        query={selectedCategory ? { category: selectedCategory } : {}}
      />
    </div>
  );
}
