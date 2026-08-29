import { setDefaultResultOrder } from "node:dns";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { category, product, siteSetting } from "../src/lib/catalog-schema";
import { seedCategories, seedProducts, seedSettings } from "./catalog-data";

setDefaultResultOrder("ipv4first");
config({ path: ".env.local" });

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const db = drizzle(neon(url));

  await db.delete(product);
  await db.delete(category);
  await db.delete(siteSetting);

  await db.insert(category).values(seedCategories);
  await db.insert(product).values(seedProducts);
  await db.insert(siteSetting).values(seedSettings);

  console.log(
    `Seeded ${seedCategories.length} categories, ${seedProducts.length} products, ${seedSettings.length} settings.`,
  );
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
