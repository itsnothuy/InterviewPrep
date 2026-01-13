import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./utils/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Use non-public env var - drizzle-kit runs server-side only
    url: process.env.DRIZZLE_DB_URL!,
  },
  verbose: true,
  strict: true,
});
