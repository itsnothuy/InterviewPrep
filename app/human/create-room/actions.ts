"use server";

import { db } from "@/utils/db";
import { room, Room } from "@/utils/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createRoomActions(roomData: Omit<Room, "id" | "userId">) {
  const sessions = await getSession();

  if (!sessions) {
    throw new Error("Unauthorized. You must be logged in to create a room.");
  }
  await db.insert(room).values({ ...roomData, userId: sessions.user.id });
  revalidatePath("/human");
}
