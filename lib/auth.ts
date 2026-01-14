import { db } from "@/utils/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions, getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";

export const authConfig: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user id to token on first sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user = { ...session.user, id: token.id as string };
      }
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authConfig);
}
