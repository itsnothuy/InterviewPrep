"use server";

import { authConfig, getSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { StreamChat } from "stream-chat";

export async function generateTokenAction() {
  const session = await getServerSession(authConfig);

  if (!session) {
    throw new Error("No session found");
  }

  const api_key = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
  const api_secret = process.env.GET_STREAM_SECRET_KEY!;
  const serverClient = StreamChat.getInstance(api_key, api_secret);
  // const token = serverClient.createToken(session.user.id);
  const token = serverClient.createToken(session?.user?.id);
  console.log("token", token);
  return token;
}
