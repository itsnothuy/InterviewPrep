import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import NavBar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import NextTopLoader from "nextjs-toploader";
import { CrispProvider } from "./crisp-provider";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { Tanstack_Providers } from "./Tanstack-Providers";
import { Toaster } from "react-hot-toast";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Interview Prep",
  icons: {
    icon: "/worker.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <CrispProvider></CrispProvider> */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Tanstack_Providers>
          <Providers>
            <NextTopLoader />
            <NavBar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </Providers>
        </Tanstack_Providers>
        <Toaster></Toaster>
        {/* P1.2: Shadcn Toast for room feature */}
        <ShadcnToaster />
      </body>
    </html>
  );
}
