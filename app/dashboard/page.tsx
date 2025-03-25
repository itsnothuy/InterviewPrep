"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AIHumanForm from "@/components/ai-or-human-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Lottie from "lottie-react";
import humanInterview from "../lotties/human-interview.json";
import createRoom from "../lotties/create-room.json";
import aiInterview from "../lotties/ai-interview.json";
import Link from "next/link";

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex flex-col items-center p-5 space-y-7">
      <div className="flex flex-col items-center p-6 h-fit w-1/2 text-center">
        <h2 className="text-5xl font-extrabold opacity-85">Prepare for</h2>
        <h1 className="text-6xl font-extrabold p-5 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Mock Interview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-5">
          It's so easy. Just one click and you are on the way to practice!
        </p>
      </div>
      <div className="flex flex-row justify-between w-full max-w-6xl gap-10">
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="text-center p-3 mb-5">
            <h1 className="text-3xl font-semibold">Create a Room</h1>
          </div>
          <Card className="shadow-md hover:shadow-lg transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between">
            <CardContent>
              <div className="flex justify-center items-center mb-4 mt-10">
                <Lottie
                  animationData={createRoom}
                  className="max-w-xs"
                  loop={true}
                />
              </div>
              <div className="text-center">
                <p>
                  Start your interview preparation by creating your own practice
                  room. Customize the session to either AI interview or
                  peer-to-peer interview.
                </p>
              </div>
              <div>
                <ul className="grid gap-2 py-4">
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Choose the interview type that you prefer.
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Invite peers or use AI to simulate a realistic interview
                    environment.
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Manage your practice sessions with built-in tools for
                    scheduling, tracking progress, and reviewing past sessions.
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={() => setOpenDialog(true)}>Create Room</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <div className="text-center p-3 mb-5">
            <h1 className="text-3xl font-semibold">Join a Room</h1>
          </div>
          <div className="space-y-5 w-full">
            <Card className="shadow-md hover:shadow-lg transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between">
              <CardHeader>
                <CardTitle>AI Interview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row mb-4">
                <div className="w-1/3 flex justify-center items-center">
                  <Lottie
                    animationData={aiInterview}
                    className="max-w-full"
                    loop={true}
                  />
                </div>
                <div className="w-2/3 pl-3">
                  <p>
                    Jump into an AI-powered interview session designed to
                    challenge and refine your skills. Our advanced AI simulates
                    a realistic interview, providing instant feedback on your
                    answers, helping you improve with every response.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Link href="/ai/create-room">Join AI Interview</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Human Interview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row mb-4">
                <div className="w-1/3 flex justify-center items-center">
                  <Lottie
                    animationData={humanInterview}
                    className="max-w-full"
                    loop={true}
                  />
                </div>
                <div className="w-2/3 pl-3">
                  <p>
                    Practice with real people by joining a peer-to-peer
                    interview session! Experience a live interview environment,
                    exchange feedback, and learn from others as you prepare for
                    your next big opportunity.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Link href="/human">Join Human Interview</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {openDialog && (
        <AIHumanForm openDialog={openDialog} setOpenDialog={setOpenDialog} />
      )}
    </div>
  );
};

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default Dashboard;
