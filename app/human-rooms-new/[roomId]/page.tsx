import { getHumanRoomById } from "@/data-access/human-rooms";
import HumanRoomContentNew from "@/components/human/HumanRoomContentNew";
import { RoomLayout } from "@/components/human/RoomLayout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HumanRoomNewPage(props: {
  params: { roomId: string };
}) {
  // P0.1: Verify user authentication
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const roomId = props.params.roomId;
  
  // P0.5: Validate room ID format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(roomId)) {
    return (
      <RoomLayout room={null} isLoading={false} isError={true} error={new Error("Invalid room ID format")}>
        <div />
      </RoomLayout>
    );
  }

  const room = await getHumanRoomById(roomId);
  
  // P0.1: Verify room ownership
  if (room && room.userId !== session.user.id) {
    return (
      <RoomLayout room={null} isLoading={false} isError={true} error={new Error("Access denied")}>
        <div />
      </RoomLayout>
    );
  }

  // Use RoomLayout wrapper to handle all states
  return (
    <RoomLayout room={room || null} isLoading={false} isError={false}>
      {room && <HumanRoomContentNew room={room} />}
    </RoomLayout>
  );
}
