"use client";
import dynamic from "next/dynamic";
import { CreateRoomForm } from "./create-room-form";
import animationData from "../../lotties/teamwork.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CreateRoom() {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between p-5 space-y-7 lg:space-y-0 lg:space-x-10 bg-bg text-text min-h-screen pt-20">
      <div className="w-full lg:w-1/2 rounded-lg p-5 ">
        <CreateRoomForm></CreateRoomForm>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
        <Lottie animationData={animationData}></Lottie>
      </div>
    </div>
  );
}
