"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";

interface AIHumanFormProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

const AIHumanForm: React.FC<AIHumanFormProps> = ({
  openDialog,
  setOpenDialog,
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl mb-5">Choose an Option</DialogTitle>
          <DialogDescription className="text-center mt-5">
            Select whether you want to conduct an AI interview or a Human
            interview below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-6 text-center">
          <Button onClick={() => setOpenDialog(false)} className="w-full">
            <Link href="/ai/create-room">AI Interview</Link>
          </Button>
          <p className="text-xl font-semibold text-slate-500">OR</p>
          <Button onClick={() => setOpenDialog(false)} className="w-full">
            <Link href="/human/create-room">Human Interview</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIHumanForm;
