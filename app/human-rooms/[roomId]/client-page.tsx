// app/human-rooms/[roomId]/client-page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getHumanRoomById } from "@/data-access/human-rooms";
import HumanRoomContent from "@/components/human/HumanRoomContent";

export default function HumanRoomPageClient() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();

  useEffect(() => {
    async function fetchRoom() {
      try {
        const result = await getHumanRoomById(roomId);
        setRoom(result);
      } catch (error) {
        console.error("Failed to fetch room", error);
      } finally {
        setLoading(false);
      }
    }
    if (roomId) fetchRoom();
  }, [roomId]);

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>No room of this ID found</div>;

  return <HumanRoomContent room={room} />;
}
