import { Lightbulb, Volume2Icon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = { 
  mockQuestions: any; // adjust this type as needed
  activeQuestionIndex: number;
};

const Questions = ({ mockQuestions, activeQuestionIndex }: Props) => {
  // Debug state to toggle display of debug info
  // Ensure we have an array to map over
  const questions = Array.isArray(mockQuestions) ? mockQuestions : [];
  
  // Log the questions and active index whenever they change
  useEffect(() => {
    console.log("DEBUG: mockQuestions:", mockQuestions);
    console.log("DEBUG: activeQuestionIndex:", activeQuestionIndex);
  }, [mockQuestions, activeQuestionIndex]);

  const textToSpeech = (text: string) => {
    console.log("DEBUG: Text-to-speech called with text:", text);
    
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };
  // Ensure we have an array to map over  
  return (
    <div className="p-5 my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {questions.map((question: any, index: number) => (
          <div key={index}>
            <h2
              className={`p-2 rounded-full text-md md:text-sm sm:text-sm text-center cursor-pointer ${
                activeQuestionIndex == index && "bg-orange-400 text-white"
              } ${activeQuestionIndex != index && "bg-secondary"}`}
            >
              Question #{index + 1}
            </h2>
          </div>
        ))}
      </div>

      <h2 className="mt-10 my-5 text-md md:text-lg">
        {questions[activeQuestionIndex]?.question}
        <Volume2Icon
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(questions[activeQuestionIndex]?.question)
          }
        />
      </h2>
      <div className="border rounded-lg p-5 bg-white my-10">
        <h2 className="flex gap-2 items-center text-gray-500">
          <Lightbulb />
          <strong>Notes:</strong>
        </h2>
        <h2 className="text-sm text-[#64748bb1] my-2">
          Remember to speak clearly and stay focused on the question. This is
          your opportunity to showcase your skills and experience. Take a moment
          to organize your thoughts before responding. If you need to pause and
          think, that's okay—just as it would be in a real interview. Keep your
          answers concise but informative, highlighting key achievements and
          relevant experiences.
        </h2>
      </div>
    </div>
  );
};

export default Questions;