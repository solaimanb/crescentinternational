import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CategorySettings, Product } from "@/lib/catalog/types";

function catalogSearchHref(category: string) {
  return category ? (`/all-products?category=${category}` as Route) : "/all-products";
}

export default function CatalogSidebar({
  categories,
  products,
  selectedCategory,
  query,
  featuredTitle,
  featuredProducts,
}: {
  categories: CategorySettings[];
  products: Product[];
  selectedCategory: string;
  query: string;
  featuredTitle: string;
  featuredProducts: Product[];
}) {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.categorySlug, (counts.get(product.categorySlug) ?? 0) + 1);
  }

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <form action="/all-products" className="relative">
        {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search products"
          className="rounded-xs bg-background pr-2.5 pl-8"
          aria-label="Search products"
        />
      </form>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Categories</h2>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              href={query ? (`/all-products?q=${encodeURIComponent(query)}` as Route) : "/all-products"}
              className={`flex items-center justify-between py-1.5 text-sm ${selectedCategory ? "text-foreground hover:text-primary" : "font-semibold text-foreground"}`}
            >
              <span>All</span>
              <span className="text-muted-foreground">({products.length})</span>
            </Link>
          </li>
          {categories.map((category) => {
            const count = counts.get(category.slug) ?? 0;
            const href = query
              ? (`/all-products?category=${category.slug}&q=${encodeURIComponent(query)}` as Route)
              : catalogSearchHref(category.slug);
            const active = selectedCategory === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  href={href}
                  className={`flex items-center justify-between py-1.5 text-sm ${active ? "font-semibold text-foreground" : "text-foreground hover:text-primary"}`}
                >
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">({count})</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {featuredProducts.length > 0 ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{featuredTitle}</h2>
          <ul className="mt-3 space-y-3">
            {featuredProducts.map((product) => (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}` as Route} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xs bg-muted">
                    {product.images[0] ? (
                      <Image
                        suppressHydrationWarning
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{product.priceRange}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
