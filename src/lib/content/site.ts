import "server-only";

import { unstable_cache } from "next/cache";
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

// The idiomatic unstable_cache pattern wraps the function once at module scope
// so Next.js can deduplicate the cached function reference across renders,
// rather than re-creating a new closure on every getSetting() call.
// Each setting ID gets its own stable cache key via the keyParts array.
function makeCachedSetting(id: string) {
  return unstable_cache(
    async () => {
      const [row] = await db.select().from(siteSetting).where(eq(siteSetting.id, id)).limit(1);
      return row ?? null;
    },
    ["catalog-setting", id],
    { revalidate: 3600, tags: ["catalog"] },
  );
}

const getCachedSetting: Record<string, ReturnType<typeof makeCachedSetting>> = {};

function getSetting(id: string) {
  // Memoize the cached function per id so the same stable reference is reused
  // across the module lifetime, matching the docs' recommended pattern.
  getCachedSetting[id] ??= makeCachedSetting(id);
  return getCachedSetting[id]();
}

export async function getHomeBanners(): Promise<HomeBanner[]> {
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
  const row = await getSetting("home");
  if (!row) {
    return null;
  }
  const parsed = homeContentSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}

export async function getContactContent(): Promise<ContactContent | null> {
  const row = await getSetting("contact");
  if (!row) {
    return null;
  }
  const parsed = contactContentSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}

export async function getTermsContent(): Promise<{ title: string; body: string } | null> {
  const row = await getSetting("terms");
  if (!row) {
    return null;
  }
  const parsed = pageContentSchema.safeParse(row.data);
  return parsed.success ? { title: parsed.data.title, body: row.body } : null;
}

export { getAllCategories as getCategoryContent } from "@/lib/catalog/categories";

export async function getAboutContent(): Promise<{ title: string; body: string } | null> {
  const row = await getSetting("about");
  if (!row) {
    return null;
  }
  const parsed = pageContentSchema.safeParse(row.data);
  return parsed.success ? { title: parsed.data.title, body: row.body } : null;
}

export async function getFooterContent(): Promise<FooterContent | null> {
  const row = await getSetting("footer");
  if (!row) {
    return null;
  }
  const parsed = footerContentSchema.safeParse(row.data);
  return parsed.success ? parsed.data : null;
}
