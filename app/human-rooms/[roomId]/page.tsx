import { getHumanRoomById } from "@/data-access/human-rooms";
import HumanRoomContent from "@/components/HumanRoomContent";

export default async function HumanRoomPage(props: {
  params: { roomId: string };
}) {
  const roomId = props.params.roomId;
  const room = await getHumanRoomById(roomId);
  if (!room) {
    return <div>No room of this ID found</div>;
  }
  return <HumanRoomContent room={room} />;
}
