"use client";
import { z } from "zod";
import { db } from "@/utils/db";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createRoomActions } from "./actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadToS3 } from "@/app/s3";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(250),
  githubRepo: z.string().min(1).max(50),
  language: z.string().min(1).max(50),
  // Optional field for uploading a new resume
  resume: z.any().optional(),
  // Optional field for selecting an existing resume (file key)
  existingResume: z.string().optional(),
});

export function CreateRoomForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      githubRepo: "",
      language: "",
      resume: undefined,
      existingResume: "",
    },
  });

  // Fetch existing resumes on mount from your API endpoint (e.g., /api/get-resumes)
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
    // Determine which resume to use:
    // If the user selected an existing resume, use that file key.
    // Otherwise, if a new file was uploaded, upload it to S3.
    let resumeData = null;
    if (values.existingResume) {
      resumeData = { file_key: values.existingResume };
    } else if (resumeFile) {
      resumeData = await uploadToS3(resumeFile);
    }


    //invoke server action to store data to our database
    await createRoomActions({ 
      ...values, 
      resumeFile: resumeData ? resumeData.file_key : null,
      createdAt: new Date(),
    });
    router.push("/human");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input
                  className="w-[85%]"
                  placeholder="Google Behavior Interview"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public room name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  className="w-[85%]"
                  placeholder="I'm preparing an interview for a job at Google."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please describe what you are be coding on.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubRepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Repo</FormLabel>
              <FormControl>
                <Input
                  className="w-[85%]"
                  placeholder="https://github.com/iloveInterviewPrep123"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please put a link to a project you are working on.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Programming Languages</FormLabel>
              <FormControl>
                <Input
                  className="w-[85%]"
                  placeholder="typscript, go, next.js, react"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please list the primary programming languages you are working
                with.
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
              <FormLabel> New Resume (Optional)</FormLabel>
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
                Upload your resume if you want to add a new one.
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
                  Choose a previously uploaded resume from your records.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button variant="dashboardAiOrHuman" type="submit">Submit</Button>
      </form>
    </Form>
  );
}
