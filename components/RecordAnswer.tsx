"use client";

import { Mic, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { useEffect, useState } from "react";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import toast from "react-hot-toast";

const RecordAnswer = ({
  mockQuestions,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const startStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };
  const updateUserAnswer = async () => {
    setLoading(true);

    const feedbackPrompt =
      "Question: " +
      mockQuestions[activeQuestionIndex]?.question +
      ", User answer: " +
      userAnswer +
      ", Depends on question and user answer for give interview question, please give us rating for answer and feedback as area of improvement, in just 3 to 5 lines, in JSON format, with rating field and feedback field.";
    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .trim();
    console.log(mockJsonResp);
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockQuestions[activeQuestionIndex]?.question,
      correctAns: mockQuestions[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      createdBy: "6b67e75e-ee67-4528-a653-3d696cedc40b",
      createdAt: moment().format("DD-MM-yyyy"),
    });
    if (resp) {
      toast.success("Successfully recorded!");
    }
    setUserAnswer("");
    setLoading(false);
    setResults([]);
  };

  return (
    <div className="flex justify-end items-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center rounded-lg p-5 bg-black">
        <WebcamIcon width={200} height={200} className="absolute text-white" />
        <Webcam
          mirrored={true}
          style={{
            height: 500,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <div>
        <Button
          disabled={isLoading}
          variant={"outline"}
          className="my-10"
          onClick={startStopRecording}
        >
          {isRecording ? (
            <h2 className="text-red-600 flex gap-2 text-sm">
              <Mic />
              Recording...
            </h2>
          ) : (
            "Start Recording"
          )}
        </Button>
      </div>
    </div>
  );
};
export default RecordAnswer;
