// "use client";

// import { Room } from "@/utils/schema";
// import {
//   Call,
//   CallControls,
//   CallParticipantsList,
//   SpeakerLayout,
//   StreamCall,
//   StreamTheme,
//   StreamVideo,
//   StreamVideoClient,
//   getOrCreateInstance,
//   User,
// } from "@stream-io/video-react-sdk";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import { generateTokenAction } from "../../app/human-rooms/[roomId]/actions";
// import { useRouter } from "next/navigation";

// const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

// export function HumanVideo({ room }: { room: Room }) {
//   const router = useRouter();
//   const session = useSession();
//   const [client, setClient] = useState<StreamVideoClient | null>(null);
//   const [call, setCall] = useState<Call | null>(null);
//   useEffect(() => {
//     if (!session.data) return;
//     if (!room) return;
//     if (!session.data) return;
//     const userId = session.data?.user?.id;
//     const client = new StreamVideoClient({
//       apiKey,
//       user: {
//         id: userId,
//         name: session?.data?.user?.name ?? undefined,
//         image: session?.data?.user?.image ?? undefined,
//       },
//       tokenProvider: () => generateTokenAction(),
//     });
//     setClient(client);
//     const call = client.call("default", room.id);
//     call.join({ create: true });
//     setCall(call);

//     return () => {
//       call
//         .leave()
//         .then(() => client.disconnectUser())
//         .catch(console.error);
//     };
//   }, [session, room]);
//   return (
//     client &&
//     call && (
//       <StreamVideo client={client}>
//         <StreamTheme>
//           <StreamCall call={call}>
//             <SpeakerLayout></SpeakerLayout>
//             <CallControls
//               onLeave={() => {
//                 router.push("/human");
//               }}
//             ></CallControls>
//             <CallParticipantsList
//               onClose={() => undefined}
//             ></CallParticipantsList>
//           </StreamCall>
//         </StreamTheme>
//       </StreamVideo>
//     )
//   );
// }



// components/human/video-player.tsx
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
  StreamVideoClient,       // <= static method lives here
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { generateTokenAction } from "../../app/human-rooms/[roomId]/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

export function HumanVideo({ room }: { room: Room }) {
  const router = useRouter();
  const session = useSession();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  // P1.8: Caption and transcript support
  const [showTranscript, setShowTranscript] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  useEffect(() => {
    if (!session.data || !room) return;

    const userId = session.data.user.id;
    // ← use the static method on StreamVideoClient
    const streamClient = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: {
        id: userId,
        name: session.data.user.name ?? undefined,
        image: session.data.user.image ?? undefined,
      },
      // P1.6: Handle structured error response
      tokenProvider: async () => {
        const result = await generateTokenAction();
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
    });
    setClient(streamClient);

    const newCall = streamClient.call("default", room.id);
    newCall.join({ create: true });
    setCall(newCall);

    return () => {
      newCall.leave().catch(console.error);
      // you can optionally disconnect the user here
      // streamClient.disconnectUser();
    };
  }, [session.data, room]);

  if (!client || !call) return null;
  
  // P1.8: Mock transcript for demonstration (in production, this would come from speech-to-text API)
  const mockTranscript = [
    { timestamp: "00:00:05", speaker: session.data?.user?.name || "You", text: "Hello, welcome to this interview session." },
    { timestamp: "00:00:12", speaker: "Interviewer", text: "Thank you for joining. Let's start with a brief introduction." },
    { timestamp: "00:00:20", speaker: session.data?.user?.name || "You", text: "I'm a software engineer with 5 years of experience in React and TypeScript." },
  ];
  
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Video player with captions */}
      <div className="flex-1 relative">
        <StreamVideo client={client}>
          <StreamTheme>
            <StreamCall call={call}>
              <SpeakerLayout />
              <CallControls onLeave={() => router.push("/human")} />
              <CallParticipantsList onClose={() => undefined} />
              
              {/* P1.8: Live caption overlay (positioned at bottom of video) */}
              {captionsEnabled && (
                <div 
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md max-w-[80%] text-center"
                  role="region"
                  aria-live="polite"
                  aria-label="Live captions"
                >
                  <p className="text-sm">
                    <span className="font-semibold">{session.data?.user?.name || "Speaker"}:</span>{" "}
                    This is where live captions would appear during the call
                  </p>
                </div>
              )}
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      </div>
      
      {/* P1.8: Caption controls and transcript */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCaptionsEnabled(!captionsEnabled)}
          aria-label={captionsEnabled ? "Disable captions" : "Enable captions"}
        >
          {captionsEnabled ? "🔊 Captions On" : "🔇 Captions Off"}
        </Button>
        
        <Collapsible open={showTranscript} onOpenChange={setShowTranscript} className="flex-1">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Session Transcript</CardTitle>
              </CardHeader>
              <CardContent className="max-h-40 overflow-y-auto space-y-2">
                {mockTranscript.map((entry, index) => (
                  <div key={index} className="text-xs border-l-2 border-carbon-border-medium pl-2">
                    <div className="text-carbon-text-tertiary">{entry.timestamp}</div>
                    <div className="font-semibold text-carbon-text-primary">{entry.speaker}</div>
                    <div className="text-carbon-text-secondary">{entry.text}</div>
                  </div>
                ))}
                <p className="text-xs text-carbon-text-tertiary italic mt-4">
                  💡 Note: Live transcription requires integration with a speech-to-text service (e.g., Google Cloud Speech-to-Text, AWS Transcribe)
                </p>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
