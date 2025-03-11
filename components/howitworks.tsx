"use client";

import { useRef, useState } from "react";
import Homecard from "./homecard";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";

const CardValues = [
  {
    title: "Sign Up",
    content:
      "Begin your journey by signing up on our platform. It’s quick and easy. All you need is your email address to get started. Once you’re signed up, you can immediately access our range of interview preparation tools.",
    imageUrl: "/assets/image1.png",
  },
  {
    title: "Choose Your Interview Type",
    content:
      "Tailor your practice session by selecting either a peer-to-peer interview or an AI-powered interview. If you prefer human interaction, our peer-to-peer interviews let you practice with real people. If you want immediate and consistent feedback, opt for our AI interview, which simulates a realistic interview environment with instant analysis.",
    imageUrl: "/assets/image2.png",
  },
  {
    title: "Get Feedback and Improve",
    content:
      "After completing your interview simulation, receive detailed feedback on your performance. Our AI-driven analysis provides insights into your strengths and areas for improvement, focusing on both content and delivery. Use the feedback to refine your skills and prepare for the real interview with confidence.",
    imageUrl: "/assets/image3.png",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
  };

  return (
    <div className="justify-center items-center p-4 flex flex-col">
      <div className="text-center p-5">
        <h1 className="text-3xl sm:text-5xl font-bold mb-5">How It Works</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Practice mock interview in just 3 simple steps
        </p>
      </div>
      <div
        ref={ref}
        className="flex flex-col sm:flex-row md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-7 gap-5 p-4 mx-5 mb-7 w-full"
      >
        {CardValues.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: index * 0.3 }}
            className="list-none w-full md:w-auto"
          >
            <Homecard
              title={card.title}
              content={card.content}
              onClick={() => handleCardClick(index)}
            />
          </motion.div>
        ))}
      </div>
      {selectedCard !== null && (
        <div className="mt-7 mb-7">
          <img
            src={CardValues[selectedCard].imageUrl}
            alt={`Image for ${CardValues[selectedCard].title}`}
            className="w-full max-w-3xl mx-auto shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default HowItWorks;
