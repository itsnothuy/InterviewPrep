/**
 * @deprecated This module is deprecated. Use `@/lib/server/db` instead.
 * 
 * This file now re-exports from the server-only module.
 * If you see a build error, it means you're importing from a client component,
 * which is not allowed for security reasons (database access must stay server-side).
 */
import "server-only";

// Re-export everything from the server module for backwards compatibility
export { db } from "@/lib/server/db";
