"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Lottie from "lottie-react";
import growth from "../app/lotties/growth.json";

export function Info() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 1 }}
      className="container px-4 md:px-6"
    >
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-500/50 px-3 py-1 text-sm text-white">
              New Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-2 mt-2">
              Work Smarter!
            </h2>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-2 mt-2">
              Get Better!
            </h2>
            <p className=" text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Concentrate on refining your skills while we handle the details, offering automated interview setups, real-time feedback, and collaborative tools.
            </p>
          </div>
          <ul className="grid gap-2 py-4">
            <li>Benefits:</li>
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4" />
              Practice with peers in live sessions or use our AI-driven features for instant insights, ensuring you’re always moving forward.
            </li>
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4" />
              Leverage ResumeAi to quickly tailor key points from documents—like job descriptions or study materials—to your resume so you can prepare and stay focused on what truly matters.
            </li>
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4" />
              Easily create or join interview rooms with just a single click,
              allowing you to focus on practicing rather than managing the
              details.
            </li>
          </ul>
        </div>
        <Lottie animationData={growth} className="max-w-full" loop={true} />
      </div>
    </motion.div>
  );
}

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
