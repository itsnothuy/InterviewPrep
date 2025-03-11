"use client";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FAQ: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 1 }}
      className="py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      <div className="container max-w-4xl px-4 md:px-6">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Get answers to the most common questions about our product.
          </p>
        </div>
        <div className="space-y-4">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-orange-200 rounded-md dark:bg-gray-800">
              <h3 className="text-lg font-medium">
                How does the AI interview simulation work?
              </h3>
              <PlusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                The AI interview simulation on Interview Expert uses advanced
                machine learning models to replicate a realistic interview
                experience. The AI asks you questions based on the job role
                you’re targeting and provides instant feedback on your
                responses, helping you improve your answers and overall
                performance.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-orange-200 rounded-md dark:bg-gray-800">
              <h3 className="text-lg font-medium">
                Can I review my interview performance later?
              </h3>
              <PlusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Yes! After completing an interview, you can review detailed
                feedback at any time. Whether you’ve had a peer-to-peer
                interview or an AI interview, all your responses, feedback, and
                suggestions for improvement are saved in your account for you to
                revisit and work on.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-orange-200  rounded-md dark:bg-gray-800">
              <h3 className="text-lg font-medium">
                How do peer-to-peer interviews work?
              </h3>
              <PlusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Peer-to-peer interviews on Interview Expert allow you to
                practice with other users on the platform. You can choose to
                either be the interviewer or the interviewee, providing a
                valuable opportunity to understand both sides of the interview
                process. After the session, you can exchange feedback with your
                peer to further enhance your skills.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 bg-orange-200 rounded-md dark:bg-gray-800">
              <h3 className="text-lg font-medium">
                What makes Interview Expert different from other interview
                preparation platforms?
              </h3>
              <PlusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Interview Expert stands out by offering both peer-to-peer and
                AI-driven interview simulations, allowing you to tailor your
                practice experience to your specific needs. Our AI provides
                instant feedback, while peer-to-peer interviews let you
                experience real human interaction. Additionally, our detailed
                feedback and performance tracking help you continuously improve
                your interview skills.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </motion.div>
  );
};

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default FAQ;
