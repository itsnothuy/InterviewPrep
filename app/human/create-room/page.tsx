"use client";
import Lottie from "lottie-react";
import { CreateRoomForm } from "./create-room-form";
import animationData from "../../lotties/Video.json";

export default function CreateRoom() {
  return (
    <div className="container mx-auto pt-12 pb-24 flex">
      <div className="flex flex-col gap-8 w-1/2">
        <h1 className="text-4xl font-bold">Create Room</h1>
        <CreateRoomForm></CreateRoomForm>
      </div>
      <div className="w-1/2">
        <Lottie animationData={animationData}></Lottie>
      </div>
    </div>
  );
}
