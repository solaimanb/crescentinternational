import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog/products";
import { getCategoryContent } from "@/lib/content/site";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getCategoryContent()]);

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/all-products"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about-us"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact-us"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/terms-and-conditions"), changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const category of categories) {
    pages.push({
      url: absoluteUrl(`/all-products?category=${category.slug}`),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const product of products) {
    pages.push({
      url: absoluteUrl(`/products/${product.slug}`),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return pages;
}
