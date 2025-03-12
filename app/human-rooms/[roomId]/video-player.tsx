"use client";

import { Room } from "@/utils/schema";
import {
  Call,
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { generateTokenAction } from "./actions";
import { useRouter } from "next/navigation";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

export function HumanVideo({ room }: { room: Room }) {
  const router = useRouter();
  const session = useSession();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  useEffect(() => {
    if (!session.data) return;
    if (!room) return;
    if (!session.data) return;
    const userId = session.data?.user?.id;
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: userId,
        name: session?.data?.user?.name ?? undefined,
        image: session?.data?.user?.image ?? undefined,
      },
      tokenProvider: () => generateTokenAction(),
    });
    setClient(client);
    const call = client.call("default", room.id);
    call.join({ create: true });
    setCall(call);

    return () => {
      call
        .leave()
        .then(() => client.disconnectUser())
        .catch(console.error);
    };
  }, [session, room]);
  return (
    client &&
    call && (
      <StreamVideo client={client}>
        <StreamTheme>
          <StreamCall call={call}>
            <SpeakerLayout></SpeakerLayout>
            <CallControls
              onLeave={() => {
                router.push("/human");
              }}
            ></CallControls>
            <CallParticipantsList
              onClose={() => undefined}
            ></CallParticipantsList>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    )
  );
}
