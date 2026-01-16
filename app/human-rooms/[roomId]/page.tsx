import { getHumanRoomById } from "@/data-access/human-rooms";
import HumanRoomContent from "@/components/human/HumanRoomContent";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HumanRoomPage(props: {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Invalid Room ID</h1>
          <p className="text-gray-600">The room ID format is invalid.</p>
        </div>
      </div>
    );
  }

  const room = await getHumanRoomById(roomId);
  
  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Room Not Found</h1>
          <p className="text-gray-600">No room with this ID exists.</p>
        </div>
      </div>
    );
  }

  // P0.1: Verify room ownership
  if (room.userId !== session.user.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this room.</p>
        </div>
      </div>
    );
  }

  // P1.3: Use h-screen for app shell pattern
  return (
    <div className="h-screen flex flex-col pt-16">
      <HumanRoomContent room={room} />
    </div>
  );
}
