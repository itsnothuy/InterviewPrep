// app/resume-ai/LoginButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <Button
      onClick={() => signIn(undefined, { callbackUrl: "/resume-ai" })}
      className="flex gap-1"
      variant="dashboardAiOrHuman"
    >
      Login &rarr;
    </Button>
  );
}
