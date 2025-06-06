"use client";

import FAQ from "@/components/home/faq";
import HowItWorks from "@/components/home/howitworks";
import { Info } from "../components/home/info";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-screen"
          >
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                //Image by bunny on Freepik
                style={{
                  backgroundImage: "url('/assets/background.jpg')",
                }}
              ></div>
              <div className="relative z-10 flex flex-col justify-center items-center text-center p-6 h-full">
                <div className="flex flex-col justify-center text-center gap-3 mb-4">
                  <h1 className="lg:text-7xl text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent">
                    Interview Prep
                  </h1>
                  <p className="text-2xl font-normal text-neutral-600">
                    Show Your True Potential With AI-Powered Mock Interview
                  </p>
                </div>
                <div className="justify-center text-center p-5 space-x-4">
                  <Button variant="dashboardAiOrHuman" className=" px-6 py-2 rounded-md w-fit text-lg" onClick={() => signIn()}>
                    Sign In
                  </Button>
                  <Button className="text-black bg-transparent border border-gray-700 px-6 py-2 rounded-md w-fit text-lg hover:bg-slate-100">
                    <Link href="/dashboard">Try Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="mt-7 flex-1 h-screen w-full">
            <HowItWorks />
          </div>
          <div className="w-full h-auto py-12 md:py-24 lg:py-32 mt-10">
            <Info />
          </div>
          <div className="w-full h-auto p-5">
            <FAQ />
          </div>
        </div>
    );
}