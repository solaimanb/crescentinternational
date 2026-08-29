import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { siteSetting } from "@/lib/catalog-schema";
import {
  contactContentSchema,
  footerContentSchema,
  homeBannersSchema,
  homeContentSchema,
  pageContentSchema,
} from "@/lib/content/schema";
import type { ContactContent, FooterContent, HomeBanner, HomeContent } from "@/lib/content/types";
import { db } from "@/lib/db";

async function getSetting(id: string) {
  const [row] = await db.select().from(siteSetting).where(eq(siteSetting.id, id)).limit(1);
  return row ?? null;
}

export async function getHomeBanners(): Promise<HomeBanner[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const row = await getSetting("banners");
  if (!row) {
    return [];
  }
  const parsed = homeBannersSchema.safeParse(row.data);
  if (!parsed.success) {
    return [];
  }
  return [...parsed.data.items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getHomeBannerById(id: string): Promise<HomeBanner | null> {
  const banners = await getHomeBanners();
  return banners.find((banner) => banner.id === id) ?? null;
}

export async function getHomeContent(): Promise<HomeContent | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const row = await getSetting("home");
  if (!row) {
    return null;
  }
  const parsed = homeContentSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}

export async function getContactContent(): Promise<ContactContent | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const row = await getSetting("contact");
  if (!row) {
    return null;
  }
  const parsed = contactContentSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}

export async function getTermsContent(): Promise<{ title: string; body: string } | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const row = await getSetting("terms");
  if (!row) {
    return null;
  }
  const parsed = pageContentSchema.safeParse(row.data);
  return parsed.success ? { title: parsed.data.title, body: row.body } : null;
}

export { getAllCategories as getCategoryContent } from "@/lib/catalog/categories";

export async function getAboutContent(): Promise<{ title: string; body: string } | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const row = await getSetting("about");
  if (!row) {
    return null;
  }
  const parsed = pageContentSchema.safeParse(row.data);
  return parsed.success ? { title: parsed.data.title, body: row.body } : null;
}

export async function getFooterContent(): Promise<FooterContent | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const row = await getSetting("footer");
  if (!row) {
    return null;
  }
  const parsed = footerContentSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}
