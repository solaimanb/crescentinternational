import Link from "next/link";
import type { Metadata, Route } from "next";
import ProductCard from "@/components/catalog/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { getAllProducts } from "@/lib/catalog/products";
import { getCategoryContent } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "All Products | Crescent International",
};

const PAGE_SIZE = 12;

export default async function AllProductsPage({
  searchParams,
}: PageProps<"/all-products">) {
  const params = await searchParams;
  const selectedCategory = typeof params.category === "string" ? params.category : "";
  const [products, categories] = await Promise.all([getAllProducts(), getCategoryContent()]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products;

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const page = Math.min(Math.max(Number(params.page) || 1, 1), totalPages);
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedCategoryName =
    categories.find((item) => item.slug === selectedCategory)?.name || "All Categories";

  function hrefFor(target: number) {
    const query = new URLSearchParams();
    if (selectedCategory) {
      query.set("category", selectedCategory);
    }
    if (target > 1) {
      query.set("page", String(target));
    }
    const search = query.toString();
    return (search ? `/all-products?${search}` : "/all-products") as Route;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {pagedProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {totalPages > 1 ? (
        <Pagination className="mt-6">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
              <PaginationItem key={item}>
                <PaginationLink href={hrefFor(item)} isActive={item === page}>
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
