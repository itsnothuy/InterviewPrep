/**
 * Server-only database client.
 * This module MUST NOT be imported from client components.
 * The "server-only" import ensures build-time errors if imported from client.
 */
import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/utils/schema";

// Use non-public env var - this is server-only
const connectionString = process.env.DRIZZLE_DB_URL;

if (!connectionString) {
  throw new Error(
    "DRIZZLE_DB_URL environment variable is not set. " +
    "Please add it to your .env file (NOT as NEXT_PUBLIC_*)."
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
