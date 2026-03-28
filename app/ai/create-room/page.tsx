"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import CreateRoomForm from "./create-room-form";

// PERF-003 FIX: Lazy load both Lottie component and animation data
const Lottie = dynamic(() => import("lottie-react"), { 
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function CreateRoom() {
  // PERF-003 FIX: Lazy load the animation JSON data
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    // Dynamically import the animation data only when component mounts
    import("../../lotties/ai-create-room.json")
      .then((module) => {
        setAnimationData(module.default);
      })
      .catch((err) => {
        console.error("Failed to load animation:", err);
      });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between p-5 space-y-7 lg:space-y-0 lg:space-x-10 bg-bg text-text min-h-screen pt-20">
      <div className="w-full lg:w-1/2 rounded-lg p-5">
        <CreateRoomForm />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
        {animationData ? (
          <Lottie animationData={animationData} />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
