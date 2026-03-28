"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AIHumanForm from "@/components/utils/ai-or-human-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import ai from "../lotties/ai.json";
import human from "../lotties/human.json";
import Link from "next/link";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center p-5 space-y-7 text-text min-h-screen pt-20"
    >
      {/* Background layer with animated GIF */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/code-matrix.gif')",
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* Content layer with higher z-index */}
      <div className="relative z-10 flex flex-col items-center p-6 h-fit w-1/2 text-center">
        <h2 className="text-5xl font-extrabold opacity-85 text-text">Prepare for</h2>
        <h1 className="text-6xl font-extrabold p-5 bg-hero-gradient bg-clip-text text-transparent">
          Mock Interview
        </h1>
        <p className="text-text mt-2">
          It&apos;s so easy. Just one click and you are on the way to practice!
        </p>
      </div>

      {/* evenly split columns (keep original flex layout, just fix the sizing math) */}
      <div className="relative z-10 flex flex-row w-full max-w-6xl gap-20">
        {/* Left column */}
        <div className="flex flex-col items-center justify-center flex-1 min-w-0">
          <div className="text-center p-3 mb-5">
            <h1 className="text-3xl font-semibold text-text">Create a Room</h1>
          </div>

          {/* REPLACED: now Human Interview card goes here */}
          <Card className="w-full shadow-glow hover:shadow-glow transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between bg-surface border border-surface">
            <CardHeader>
              <CardTitle className="text-text">Human Interview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row mb-4">
              <div className="w-1/3 flex justify-center items-center">
                <Lottie animationData={human} className="max-w-full" loop={true} />
              </div>
              <div className="w-2/3 pl-3">
                <p className="text-text">
                  Practice with real people by joining a peer-to-peer interview session! Experience
                  a live interview environment, exchange feedback, and learn from others as you
                  prepare for your next big opportunity.
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

        {/* Right column */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="text-center p-3 mb-5">
            <h1 className="text-3xl font-semibold text-text">Join a Room</h1>
          </div>

          {/* Keep AI Interview card (unchanged) */}
          <Card className="w-full shadow-glow hover:shadow-glow transition-all cursor-pointer hover:translate-y-1 flex-grow flex flex-col justify-between bg-surface border border-surface">
            <CardHeader>
              <CardTitle className="text-text">AI Interview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row mb-4">
              <div className="w-1/3 flex justify-center items-center">
                <Lottie animationData={ai} className="max-w-full" loop={true} />
              </div>
              <div className="w-2/3 pl-3">
                <p className="text-text">
                  Jump into an AI-powered interview session designed to challenge and refine your skills.
                  Our advanced AI simulates a realistic interview, providing instant feedback on your answers,
                  helping you improve with every response.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="interviewCoder" className="rounded-md w-fit">
                <Link href="/ai/create-room">Join AI Interview</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {openDialog && (
        <AIHumanForm openDialog={openDialog} setOpenDialog={setOpenDialog} />
      )}
    </motion.div>
  );
};

export default Dashboard;
