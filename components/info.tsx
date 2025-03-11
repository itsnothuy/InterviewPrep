"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Lottie from "lottie-react";
import info from "../app/lotties/info.json";

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
            <div className="inline-block rounded-lg bg-orange-400 px-3 py-1 text-sm text-white">
              New Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-2 mt-2">
              Faster Preparation. Better Results.
            </h2>
            <p className=" text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The ultimate platform to accelerate your interview readiness.
              Focus on honing your skills instead of worrying about the
              logistics, with automated interview setups, real-time feedback,
              and collaborative preparation tools.
            </p>
          </div>
          <ul className="grid gap-2 py-4">
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4" />
              Connect with peers for live practice sessions or use our
              AI-powered tools to get instant feedback, ensuring you're always
              improving.
            </li>
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4" />
              Use ChatPDF to quickly extract key information from documents,
              such as job descriptions or study materials, helping you tailor
              your preparation and focus on what matters most for your
              interviews.
            </li>
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4" />
              Easily create or join interview rooms with just a single click,
              allowing you to focus on practicing rather than managing the
              details.
            </li>
          </ul>
        </div>
        <Lottie animationData={info} className="max-w-full" loop={true} />
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
