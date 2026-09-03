import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { category, product, siteSetting } from "../src/lib/catalog-schema";
import { seedCategories, seedProducts, seedSettings } from "./catalog-data";

config({ path: ".env.local" });

async function seed() {
  if (process.env.SEED_CONFIRM !== "replace-catalogue") {
    throw new Error("Set SEED_CONFIRM=replace-catalogue before replacing catalogue data.");
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const db = drizzle(neon(url));

  await db.batch([
    db.delete(product),
    db.delete(category),
    db.delete(siteSetting),
    db.insert(category).values(seedCategories),
    db.insert(product).values(seedProducts),
    db.insert(siteSetting).values(seedSettings),
  ]);

  console.log(
    `Seeded ${seedCategories.length} categories, ${seedProducts.length} products, ${seedSettings.length} settings.`,
  );
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
