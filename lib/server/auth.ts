/**
 * Server-only authentication helpers.
 * This module MUST NOT be imported from client components.
 */
import "server-only";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { NextResponse } from "next/server";

export type AuthSession = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

/**
 * Get the current session. Returns null if not authenticated.
 */
export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return null;
  }
  return session as AuthSession;
}

/**
 * Require authentication. Throws an error if not authenticated.
 * Use in API routes with try/catch.
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Create a standardized unauthorized response.
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Create a standardized forbidden response.
 */
export function forbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Create a standardized bad request response.
 */
export function badRequestResponse(message: string = "Bad Request") {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Create a standardized internal server error response.
 */
export function serverErrorResponse(message: string = "Internal Server Error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
