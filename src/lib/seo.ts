import type { Metadata } from "next";
import { getFooterContent } from "@/lib/content/site";
import { pageHref } from "@/lib/paginate";

export function siteUrl() {
  return new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000");
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl()).toString();
}

export function metaSnippet(value: string, length = 160) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= length) {
    return text;
  }
  return `${text.slice(0, length - 1).trimEnd()}…`;
}

export async function brandMetadata(): Promise<{ brand: string; description: string }> {
  const footer = await getFooterContent();
  return {
    brand: footer?.brandName ?? "",
    description: footer?.description ?? "",
  };
}

export function catalogHref(category = "", page = 1) {
  return pageHref("/all-products", page, category ? { category } : {});
}

export function openGraphImage(url: string, alt: string): NonNullable<Metadata["openGraph"]>["images"] {
  return [{ url, alt }];
}
