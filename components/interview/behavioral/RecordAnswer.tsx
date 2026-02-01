// ARCH-001 FIX: Removed ~140 lines of dead commented code (original implementation)
// The old code had several issues:
// - Used hardcoded user ID (SEC-001)
// - Used direct DB access (SEC-002)
// - No input sanitization (SEC-004)
// Current implementation uses proper session, API routes, and sanitization

"use client";

import { Mic, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "../../ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { useEffect, useRef, useState } from "react";
import { chatSession } from "@/utils/GeminiAIModal";
import { useSession } from "next-auth/react";
import moment from "moment";
import toast from "react-hot-toast";
import { sanitizeForPrompt } from "@/utils/sanitize";

interface SpeechResult {
  transcript: string;
}

interface RecordAnswerProps {
  mockQuestions: Array<{ question: string; answer?: string }>;
  activeQuestionIndex: number;
  interviewData: { mockId: string } | null;
}

interface FeedbackResponse {
  rating: string;
  feedback: string;
}

const getTranscript = (result: string | SpeechResult): string => {
  return typeof result === "string" ? result : result.transcript;
};

const RecordAnswer: React.FC<RecordAnswerProps> = ({
  mockQuestions,
  activeQuestionIndex,
  interviewData,
}) => {
  // Get user session
  const { data: session } = useSession();
  
  // State for display purposes (optional)
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setLoading] = useState(false);
  // Local flag to track intended recording
  const [localRecording, setLocalRecording] = useState(false);
  // Ref to capture transcript immediately
  const transcriptRef = useRef("");

  const { isRecording, results, startSpeechToText, stopSpeechToText, setResults } =
    useSpeechToText({
      continuous: true,
      useLegacyResults: false,
    });

  // Update transcriptRef with new speech results.
  useEffect(() => {
    console.log("DEBUG: Speech results updated:", results);
    results.forEach((result) => {
      const transcript = getTranscript(result);
      console.log("DEBUG: New transcript chunk:", transcript);
      transcriptRef.current += transcript;
      // (Optional) update state for UI display
      setUserAnswer(transcriptRef.current);
    });
  }, [results]);

  // Log the ref's current value when it updates.
  useEffect(() => {
    console.log("DEBUG: Full transcript (from ref):", transcriptRef.current);
  }, [userAnswer]);

  useEffect(() => {
    console.log("DEBUG: isRecording (from hook) changed:", isRecording);
  }, [isRecording]);

  const startRecording = async () => {
    console.log("DEBUG: Start Recording button clicked.");
    // Resume AudioContext if needed.
    if (typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioContext = new AudioCtx();
        if (audioContext.state === "suspended") {
          console.log("DEBUG: AudioContext is suspended. Resuming...");
          await audioContext.resume();
          console.log("DEBUG: AudioContext resumed.");
        } else {
          console.log("DEBUG: AudioContext state:", audioContext.state);
        }
      }
    }
    console.log("DEBUG: Starting recorder...");
    transcriptRef.current = ""; // Clear the ref.
    setUserAnswer(""); // Clear state.
    startSpeechToText();
    setLocalRecording(true);
  };

  const stopAndSaveRecording = async () => {
    console.log("DEBUG: Stop and Save button clicked.");
    if (!localRecording) {
      console.log("DEBUG: No recording is active to stop.");
      return;
    }
    if (isRecording) {
      try {
        console.log("DEBUG: Stopping recorder...");
        stopSpeechToText();
      } catch (error) {
        console.error("DEBUG: Error stopping the recorder:", error);
      }
    } else {
      console.log("DEBUG: Hook is not reporting active recording. Skipping stop call.");
    }
    setLocalRecording(false);
    // Use the transcript from the ref immediately.
    console.log("DEBUG: updateUserAnswer called with transcript from ref:", transcriptRef.current);
    await updateUserAnswer();
  };

  const updateUserAnswer = async () => {
    if (!interviewData || !interviewData.mockId) {
      console.error("DEBUG: Interview data is missing");
      toast.error("Interview data is missing");
      return;
    }

    // SEC-001 FIX: Check for user session
    if (!session?.user?.id) {
      console.error("User session not found");
      toast.error("You must be logged in to submit answers");
      return;
    }

    setLoading(true);

    // SEC-004 FIX: Sanitize user input before sending to AI
    const sanitizedQuestion = sanitizeForPrompt(mockQuestions[activeQuestionIndex]?.question || "", 1000);
    const sanitizedAnswer = sanitizeForPrompt(transcriptRef.current, 5000);

    const feedbackPrompt =
      "Question: " +
      sanitizedQuestion +
      ", User answer: " +
      sanitizedAnswer +
      ", Based on the question and the user answer, please rate the answer and give feedback for improvement in 3-5 lines, in JSON format with fields 'rating' and 'feedback'.";
    console.log("DEBUG: Sending Gemini API message with prompt:", feedbackPrompt);

    const result = await chatSession.sendMessage(feedbackPrompt);
    const responseText = result.response.text();
    const mockJsonResp = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .trim();
    console.log("DEBUG: Feedback response:", mockJsonResp);

    let JsonFeedbackResp: FeedbackResponse;
    try {
      JsonFeedbackResp = JSON.parse(mockJsonResp) as FeedbackResponse;
      console.log("DEBUG: Parsed feedback response:", JsonFeedbackResp);
    } catch (error) {
      console.error("DEBUG: Failed to parse feedback JSON:", error);
      toast.error("Error parsing feedback");
      setLoading(false);
      return;
    }

    const payload = {
      mockIdRef: interviewData.mockId,
      question: mockQuestions[activeQuestionIndex]?.question,
      correctAns: mockQuestions[activeQuestionIndex]?.answer,
      userAns: transcriptRef.current,
      feedback: JsonFeedbackResp.feedback,
      rating: JsonFeedbackResp.rating,
      createdBy: session.user.id, // SEC-001 FIX: Use actual user ID from session
    };

    console.log("DEBUG: Sending payload to /api/insertAnswer:", payload);
    try {
      const res = await fetch("/api/insertAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        console.log("DEBUG: Answer recorded successfully.");
        toast.success("Successfully recorded!");
      } else {
        const errorData = await res.json();
        console.error("DEBUG: Insert answer error:", errorData);
        toast.error("Failed to record answer");
      }
    } catch (error) {
      console.error("DEBUG: Error in updateUserAnswer:", error);
      toast.error("Error recording answer");
    }
    setUserAnswer("");
    setLoading(false);
    setResults([]);
  };

  return (
    <div className="flex justify-end items-center flex-col">
      <div className="flex flex-col mt-10 justify-center items-center rounded-lg bg-black">
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
      <div className="flex flex-row gap-4 mt-5">
        <Button disabled={isLoading} variant={"outline"} onClick={startRecording}>
          Start Recording
        </Button>
        <Button disabled={isLoading} variant={"outline"} onClick={stopAndSaveRecording}>
          Stop and Save
        </Button>
      </div>
    </div>
  );
};

export default RecordAnswer;
