"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/home/header";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-transparent p-2 flex justify-between items-center border-b border-slate-500 w-full">
      <div className="flex left-0">
        <a href="/" className="flex mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
          <img src="/worker.png" className="w-auto h-7" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Interview Prep
          </span>
        </a>
      </div>
      <div className="hidden lg:flex items-center justify-center space-x-9 flex-1">
        <Link
          href="/"
          className="text-lg font-medium text-white hover:text-gray-300"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="text-lg font-medium text-white hover:text-gray-300"
        >
          Dashboard
        </Link>
        <Link
          href="/resume-ai"
          className="text-lg font-medium text-white hover:text-gray-300"
        >
          ResumeAI
        </Link>
      </div>
      <div className="block lg:hidden">
        {!isOpen && (
          <button
            onClick={toggleMenu}
            className="text-gray-300 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        )}
      </div>
      <div className="hidden lg:block">
        <Header />
      </div>

      <div className={`lg:hidden ${isOpen ? "block" : "hidden"} w-full`}>
        <div className="flex flex-col items-center space-y-4 mt-4 relative">
          {isOpen && (
            <button
              onClick={toggleMenu}
              className="absolute top-2 left-2 text-gray-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <Link
            href="/"
            className="text-lg font-medium text-gray-300 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-lg font-medium text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/code-editor"
            className="text-lg font-medium text-gray-300 hover:text-white"
          >
            Code Editor
          </Link>
          <Link
            href="/chat-pdf"
            className="text-lg font-medium text-gray-300 hover:text-white"
          >
            Chat PDF
          </Link>
          <div>
            <Header />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
