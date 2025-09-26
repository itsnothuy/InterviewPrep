"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AIHumanForm from "@/components/utils/ai-or-human-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import list from "../lotties/list.json";
import ai from "../lotties/ai.json";
import human from "../lotties/human.json";
import Link from "next/link";
import { custom } from "zod";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex flex-col items-center p-5 space-y-7 bg-bg text-text min-h-screen pt-20">
      <div className="flex flex-col items-center p-6 h-fit w-1/2 text-center">
        <h2 className="text-5xl font-extrabold opacity-85 text-text">Prepare for</h2>
        <h1 className="text-6xl font-extrabold p-5 bg-hero-gradient bg-clip-text text-transparent">
          Mock Interview
        </h1>
        <p className="text-muted mt-2">
        It&apos;s so easy. Just one click and you are on the way to practice!
        </p>
      </div>
      <div className="flex flex-row justify-between w-full max-w-6xl gap-10">
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="text-center p-3 mb-5">
            <h1 className="text-3xl font-semibold text-text">Create a Room</h1>
          </div>
          <Card className="shadow-glow hover:shadow-glow transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between bg-surface border border-surface">
            <CardContent>
              <div className="flex justify-center items-center ml-10">
                <Lottie
                  animationData={list}
                  className="max-w-xs"
                  loop={true}
                />
              </div>
              <div className="text-center">
                <p className="text-text">
                  Start your interview preparation by creating your own practice
                  room. Customize the session to either AI interview or
                  peer-to-peer interview.
                </p>
              </div>
              <div>
                <ul className="grid gap-2 py-4 text-text">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-violet flex-shrink-0" />
                    <span className="flex-1 text-base">
                      Choose the interview type that you prefer.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-violet flex-shrink-0" />
                    <span className="flex-1 text-base">
                      Invite peers or use AI to simulate a realistic interview
                      environment.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mr-2 inline-block h-4 w-4 text-violet flex-shrink-0" />
                    <span className="flex-1 text-base">
                      Manage your practice sessions with built-in tools for
                      scheduling, tracking progress, and reviewing past sessions.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="interviewCoder" className="rounded-md w-fit" onClick={() => setOpenDialog(true)}>Create Room</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <div className="text-center p-3 mb-5">
            <h1 className="text-3xl font-semibold text-text">Join a Room</h1>
          </div>
          <div className="space-y-5 w-full">
            <Card className="shadow-glow hover:shadow-glow transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between bg-surface border border-surface">
              <CardHeader>
                <CardTitle className="text-text">AI Interview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row mb-4">
                <div className="w-1/3 flex justify-center items-center">
                  <Lottie
                    animationData={ai}
                    className="max-w-full"
                    loop={true}
                  />
                </div>
                <div className="w-2/3 pl-3">
                  <p className="text-text">
                    Jump into an AI-powered interview session designed to
                    challenge and refine your skills. Our advanced AI simulates
                    a realistic interview, providing instant feedback on your
                    answers, helping you improve with every response.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="interviewCoder" className="rounded-md w-fit">
                  <Link href="/ai/create-room">Join AI Interview</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-glow hover:shadow-glow transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between bg-surface border border-surface">
              <CardHeader>
                <CardTitle className="text-text">Human Interview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row mb-4">
                <div className="w-1/3 flex justify-center items-center">
                  <Lottie
                    animationData={human}
                    className="max-w-full"
                    loop={true}
                  />
                </div>
                <div className="w-2/3 pl-3">
                  <p className="text-text">
                    Practice with real people by joining a peer-to-peer
                    interview session! Experience a live interview environment,
                    exchange feedback, and learn from others as you prepare for
                    your next big opportunity.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="interviewCoder" className="rounded-md w-fit">
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
      className="text-violet"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default Dashboard;
