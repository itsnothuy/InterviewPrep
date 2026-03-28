"use client";

import FAQ from "@/components/home/faq";
import HowItWorks from "@/components/home/howitworks";
import { Info } from "../components/home/info";
import Hero from "@/components/home/home";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen overflow-x-hidden">
          <Hero />
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