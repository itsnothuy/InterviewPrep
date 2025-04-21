"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { uploadToS3 } from "@/app/s3";

const formSchema = z.object({
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  experience: z.string().min(1, {
    message: "Experience must be at least 1 character.",
  }),
  // Optional field for resume file if uploading new one
  resume: z.any().optional(),
  // Optional field to select an existing resume (file_key)
  existingResume: z.string().optional(),
});

const CreateRoomForm = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [JsonResponse, setJsonResponse] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const router = useRouter();
  const { data: session } = useSession(); // Use useSession hook

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      description: "",
      experience: "",
      resume: undefined,
      existingResume: "",
    },
  });

  // Fetch existing resumes on mount
  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await axios.get("/api/get-resumes");
        setResumes(res.data.resumes);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      }
    }
    fetchResumes();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Unauthorized. You must be logged in to create a room.");
      return;
    }

    setLoading(true);

    // Determine which resume to use:
    // If user selected an existing resume, use that. Otherwise, upload new resume if provided.
    let resumeData = null;
    if (values.existingResume) {
      // Use the existing resume details (assumed to be the file_key)
      resumeData = {
        file_key: values.existingResume,
        // You might also store file_name or pdfUrl if available in the fetched record.
      };
    } else if (resumeFile) {
      // Otherwise, upload the new resume
      // Assuming uploadToS3 is imported and handles the file upload as before
      resumeData = await uploadToS3(resumeFile);
    }

   

    try {
      const behavioralRes = await axios.post("/api/generate-interview", {
        role: values.role,
        description: values.description,
        experience: values.experience,
        resumeFileKey: resumeData ? resumeData.file_key : "",
      });
      const output = behavioralRes.data.output; // the generated JSON string

      // Insert into db
      if (output) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: output,
            jobPosition: values.role,
            jobDescription: values.description,
            jobExperience: values.experience,
            createdBy: session.user.id as string,
            createdAt: moment().format("DD-MM-yyyy"),
            resumeFile: resumeData ? resumeData.file_key : null,
          })
          .returning({ mockId: MockInterview.mockId });
      
        const mockId = resp[0]?.mockId;
        if (!mockId) {
          throw new Error("Error inserting MockInterview or retrieving mockId.");
        }

        setJsonResponse(output);
        
        // Generate technical questions
        const techRes = await axios.post("/api/generate-technical-question", {
          role: values.role,
          description: values.description,
          experience: values.experience,
          mockId: mockId, // pass the same ID for reference
        });
        // The route returns { success: true, generatedTechQuestions: [...] }
        const { generatedTechQuestions } = techRes.data;
        if (!generatedTechQuestions || generatedTechQuestions.length === 0) {
          throw new Error("No technical questions were generated.");
        }

        // Insert the generated technical questions into your DB
        await axios.post("/api/createTechnicalQuestion", {
          mockIdRef: mockId,
          questions: generatedTechQuestions,
        });
        
      

        // If successful, go to the interview room with the id
        if (resp) {
          router.push("/ai/interview/" + mockId);
        }
      } else {
        console.log("Error in generating mock interview response");
      }
    } catch (error) {
      console.error("Failed to generate interview questions:", error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="p-3 space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent">Tell Us About Your Job Interview</h1>
        <h2 className="text-lg font-md text-slate-500">
          Add details about your job position, description and years of
          experience
        </h2>
      </div>
      <div className="p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Input className="text-[#64748B]" placeholder="Ex: Software Engineer" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the role you want to interview for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Input
                      className="text-[#64748B]"
                      placeholder="Ex: This job requires me to be proficient in Java and C#"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give us some information about the job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input className="text-[#64748B]" placeholder="Ex: 1-2 years" {...field} />
                  </FormControl>
                  <FormDescription>
                    Years of experience the job requires.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume (Optional)</FormLabel>
                  <FormControl>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setResumeFile(file ?? null);
                      field.onChange(file);
                    }}
                    className="text-[#64748B] p-2 border rounded-md"
                  />
                  </FormControl>
                  <FormDescription>
                    Your resume or CV. You can upload a new resume or select from your previously uploaded PDFs down below. (If you have some uploaded already)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Dropdown to Select an Existing Resume */}
            {resumes.length > 0 && (
              <FormField
                control={form.control}
                name="existingResume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Existing Resume</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="ml-2 p-2 bg-transparent border rounded-md text-sm text-[#64748B]"
                      >
                        <option value="">-- Choose a resume --</option>
                        {resumes.map((r) => (
                          <option key={r.id} value={r.fileKey}>
                            {r.pdfName}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose a previously uploaded resume from your conversations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button variant="dashboardAiOrHuman" type="submit">
              {isLoading ? (
                <div className="text-center items-center flex flex-row space-x-2">
                  <p>Generating from AI:</p>
                  <CircularProgress size={20} />
                </div>
              ) : (
                "Start Interview"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
export default CreateRoomForm;
