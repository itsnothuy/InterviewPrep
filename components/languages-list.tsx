"use client";

import { useRouter } from "next/navigation";
import { badgeVariants } from "./ui/badge";
import { cn } from "@/lib/utils";

export function LanguagesList({ languages }: { languages: string[] }) {
  const router = useRouter();
  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map((language) => (
        <button
          className={cn(badgeVariants())}
          key={language}
          onClick={() => {
            router.push(`/browse?search=${language}`);
          }}
        >
          {language}
        </button>
      ))}
    </div>
  );
}