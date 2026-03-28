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
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Interview Prep",
  icons: {
    icon: "/worker.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // i18n: Get locale and messages for the current request
  const locale = await getLocale();
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      {/* <CrispProvider></CrispProvider> */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
        <Toaster></Toaster>
        {/* P1.2: Shadcn Toast for room feature */}
        <ShadcnToaster />
      </body>
    </html>
  );
}
