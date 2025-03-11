"use client";

import { Inbox, Loader2, Loader2Icon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "./s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const { mutate } = useMutation({
      mutationFn: async ({
        file_key,
        file_name,
      }: {
        file_key: string;
        file_name: string;
      }) => {
        const res = await axios.post("/api/create-chat", {
          file_key,
          file_name,
        });
        return res.data;
      },
    });
    const { getRootProps, getInputProps } = useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      onDrop: async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          alert("File size must be less than 10MB");
          return;
        }
        try {
          setUploading(true);
          const data = await uploadToS3(file);
          if (!data?.file_key || !data?.file_name) {
            toast.error("Failed to upload file");
            alert("Failed to upload file");
            return;
          }
          mutate(data, {
            onSuccess: ({ chat_id }) => {
              toast.success("Chat created successfully");
              router.push(`/chat/${chat_id}`);
            },
            onError: (error) => {
              toast.error("Failed to create chat");
              console.log(error);
            },
          });
        } catch (error) {
          console.log(error);
        } finally {
          setUploading(false);
        }
      },
    });
    return (
      <div className="p-2 bg-white rounded-xl">
        <div
          {...getRootProps({
            className:
              "border-dashed border-2 border-gray-300 py-8 rounded-xl cursor-pointer bg-gray-50 flex justify-center items-center flex-col",
          })}
        >
          <input {...getInputProps()}></input>
          {uploading ? (
            <>
              <Loader2Icon className="w-10 h-10 text-orange-600"></Loader2Icon>
              <p className="mt-2 text-sm text-slate-400">PDF is loading</p>
            </>
          ) : (
            <>
              <Inbox className="w-10 h-10 text-orange-600"></Inbox>
              <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
            </>
          )}
        </div>
      </div>
    );
  };
  