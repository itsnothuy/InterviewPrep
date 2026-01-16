"use client";

import { useRef, useState } from "react";
import Homecard from "./homecard";
import { Button } from "../ui/button";
import { motion, useInView } from "framer-motion";

const CardValues = [
  {
    title: "Sign Up",
    content:
      "Simply provide your email address to get started, and you'll immediately unlock our full suite of interview preparation tools.",
    imageUrl: "/assets/image1.png",
  },
  {
    title: "Choose Your Interview Type",
    content:
      "Customize the practice session by selecting either a peer-to-peer interview or an AI-driven session. If you enjoy human interaction, our peer-to-peer option lets you practice with real people. Alternatively, if you need quick and consistent feedback, our AI interview simulates a realistic interview environment with instant analysis.",
    imageUrl: "/assets/image2.png",
  },
  {
    title: "Get Feedback and Improve",
    content:
      "After completing your interview simulation,  you'll receive comprehensive feedback on your performance. Our AI-powered analysis identifies your strengths and pinpoints areas for improvement in both content and delivery, helping you refine your skills and approach your real interview with confidence.",
    imageUrl: "/assets/image3.png",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    // Toggle: if clicking the same card, hide it; otherwise show the new one
    setSelectedCard(selectedCard === index ? null : index);
  };

  return (
    <div className="justify-center items-center p-4 flex flex-col">
      <div className="text-center p-5">
        <h1 className="bg-hero-gradient bg-clip-text text-transparent text-3xl sm:text-5xl font-bold mb-5">How It Works</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Practice mock interview in just these simple steps
        </p>
      </div>
      <div
        ref={ref}
        className="flex flex-col lg:flex-row justify-center items-stretch gap-5 p-4 mx-auto mb-7 w-full max-w-7xl"
      >
        {CardValues.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: index * 0.3 }}
            className="w-full lg:flex-1"
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
        <div className="mt-7 mb-7 px-4 w-full max-w-4xl mx-auto">
          <img
            src={CardValues[selectedCard].imageUrl}
            alt={`Image for ${CardValues[selectedCard].title}`}
            className="w-full h-auto shadow-lg rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default HowItWorks;
