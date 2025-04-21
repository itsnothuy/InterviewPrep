// components/TechnicalQuestion.tsx
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface TechnicalQuestion {
  id: number;
  mockIdRef: string;
  questionText: string;
  difficulty: string;
}

export function useTechnicalQuestions(mockId: string) {
  const [questions, setQuestions] = useState<TechnicalQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/technicalQuestion/${mockId}`);
        const data = await res.json();
        if (data.technicalQuestions) {
          setQuestions(data.technicalQuestions);
        }
      } catch (error) {
        console.error("Error fetching technical questions", error);
        toast.error("Failed to load coding questions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [mockId]);

  return { questions, isLoading };
}
