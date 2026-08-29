import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/catalog/product-card";
import { getAllProducts } from "@/lib/catalog/products";
import { getCategoryContent } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "All Products | Crescent International",
};

export default async function AllProductsPage({
  searchParams,
}: PageProps<"/all-products">) {
  const params = await searchParams;
  const selectedCategory = typeof params.category === "string" ? params.category : "";
  const [products, categories] = await Promise.all([getAllProducts(), getCategoryContent()]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products;

  const selectedCategoryName =
    categories.find((item) => item.slug === selectedCategory)?.name || "All Categories";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Product Catalogue</p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{selectedCategoryName}</h1>
        </div>
        <Link href="/" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900">
          Back to Home
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/all-products"
          className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/all-products?category=${item.slug}`}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
