import { getHumanRoomById } from "@/data-access/human-rooms";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LanguagesList } from "@/components/languages-list";
import { splitLanguages } from "@/lib/utils";
import { HumanVideo } from "./video-player";

export default async function HumanRoomPage(props: {
  params: { roomId: string };
}) {
  const roomId = props.params.roomId;
  const room = await getHumanRoomById(roomId);
  if (!room) {
    return <div>No room of this ID found</div>;
  }
  return (
    <div className="grid grid-cols-4 min-h-screen">
      <div className="col-span-3 p-4 pr-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-h-screen">
          <HumanVideo room={room} />
        </div>
      </div>

      <div className="col-span-1 p-4 pl-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-4">
          <h1 className="text-base">{room?.name}</h1>

          {room.githubRepo && (
            <Link
              href={room?.githubRepo}
              className="flex items-center gap-2 text-center text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon />
              Github Project
            </Link>
          )}

          <p className="text-base text-gray-600">{room?.description}</p>

          <LanguagesList languages={splitLanguages(room?.language || "")} />
        </div>
      </div>
    </div>
  );
}
