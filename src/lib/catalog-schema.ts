import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const category = pgTable("category", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(1),
  homepageDesktopCount: integer("homepage_desktop_count").notNull().default(4),
  homepageMobileCount: integer("homepage_mobile_count").notNull().default(4),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const product = pgTable("product", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  categorySlug: text("category_slug").notNull(),
  priceRange: text("price_range").notNull(),
  shortDescription: text("short_description").notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  contactWhatsapp: text("contact_whatsapp").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactTemp: text("contact_temp").notNull().default(""),
  seoHashtags: jsonb("seo_hashtags").$type<string[]>().notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const siteSetting = pgTable("site_setting", {
  id: text("id").primaryKey(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  body: text("body").notNull().default(""),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
