/**
 * @deprecated This module is deprecated. Use `@/lib/server/gemini` instead.
 * 
 * This file now re-exports from the server-only module.
 * If you see a build error, it means you're importing from a client component,
 * which is not allowed for security reasons (API keys must stay server-side).
 */
import "server-only";

import { startGeminiChat } from "@/lib/server/gemini";

// Re-export for backwards compatibility with existing server-side code
export const chatSession = startGeminiChat();
