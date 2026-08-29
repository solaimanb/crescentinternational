import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "@/lib/auth-schema";
import * as catalogSchema from "@/lib/catalog-schema";

export const db = drizzle(neon(process.env.DATABASE_URL!), {
  schema: { ...authSchema, ...catalogSchema },
});
