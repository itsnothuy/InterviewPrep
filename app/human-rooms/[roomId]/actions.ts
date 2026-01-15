"use server";

import { authConfig, getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { StreamChat } from "stream-chat";
import { getHumanRoomById } from "@/data-access/human-rooms";

// P1.6: Structured error response type
type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// P0.5: Validate room ID format
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export async function generateTokenAction(): Promise<ActionResponse<string>> {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return {
        success: false,
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    if (!session.user?.id) {
      return {
        success: false,
        error: "Invalid session data",
        code: "INVALID_SESSION"
      };
    }

    const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const api_secret = process.env.GET_STREAM_SECRET_KEY;

    if (!api_key || !api_secret) {
      return {
        success: false,
        error: "Server configuration error",
        code: "CONFIG_ERROR"
      };
    }

    const serverClient = StreamChat.getInstance(api_key, api_secret);
    const token = serverClient.createToken(session.user.id);
    
    return {
      success: true,
      data: token
    };
  } catch (error) {
    console.error("Token generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate token",
      code: "TOKEN_GENERATION_FAILED"
    };
  }
}
