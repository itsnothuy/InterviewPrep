import { db } from "@/utils/db";
import { room } from "@/utils/schema";
import { eq, like, desc, count } from "drizzle-orm";
import { unstable_noStore } from "next/cache";

/**
 * Retrieve human interview rooms with pagination support.
 * @param search - Optional search term to filter by language
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of rooms per page
 * @returns Object containing rooms array, total count, current page, and page size
 */
export async function getHumanRooms(
  search: string | undefined,
  page: number = 1,
  pageSize: number = 9
) {
  unstable_noStore();
  
  // Calculate offset for pagination
  const offset = (page - 1) * pageSize;
  
  // Build where clause if search term provided
  const where = search ? like(room.language, `%${search}%`) : undefined;
  
  // Fetch rooms with pagination
  const rooms = await db.query.room.findMany({ 
    where,
    limit: pageSize,
    offset: offset,
    orderBy: [desc(room.createdAt)]
  });
  
  // Get total count for pagination
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(room)
    .where(where || undefined);
  
  return {
    rooms,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

/**
 * Retrieve a single human interview room by its ID.
 */
export async function getHumanRoomById(roomId: string) {
  unstable_noStore();
  return await db.query.room.findFirst({ where: eq(room.id, roomId) });
}
