"use client";

import { Button } from "@/components/ui/button";
import CodeEditorBlock from "@/components/code-editor-block";

interface CodeEditorModalProps {
  onClose: () => void;
}

export default function CodeEditorModal({ onClose }: CodeEditorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-11/12 max-w-4xl p-4 rounded shadow-lg relative">
        <Button
          onClick={onClose}
          className="absolute top-2 right-2"
          variant="outline"
        >
          Close
        </Button>
        <CodeEditorBlock />
      </div>
    </div>
  );
}
