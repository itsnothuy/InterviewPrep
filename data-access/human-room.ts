import { db } from "@/utils/db";
import { room } from "@/utils/schema";
import { eq, like } from "drizzle-orm";
import { unstable_noStore } from "next/cache";

/**
 * Retrieve all human interview rooms, optionally filtered by a search term.
 */
export async function getHumanRooms(search: string | undefined) {
  unstable_noStore();
  const where = search ? like(room.language, `%${search}%`) : undefined;
  const rooms = await db.query.room.findMany({ where });
  return rooms;
}

/**
 * Retrieve a single human interview room by its ID.
 */
export async function getHumanRoomById(roomId: string) {
  unstable_noStore();
  return await db.query.room.findFirst({ where: eq(room.id, roomId) });
}
