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
    <nav className="bg-transparent p-2 flex justify-between items-center border-b border-surface w-full">
      <div className="flex items-center">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/worker.png" className="w-auto h-7" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-text">
            Interview Prep
          </span>
        </a>
      </div>
      <div className="hidden lg:flex items-center justify-center space-x-10 flex-1">
        <Link
          href="/"
          className="text-lg font-medium text-text hover:text-violet"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="text-lg font-medium text-text hover:text-violet"
        >
          Dashboard
        </Link>
        <Link
          href="/resume-ai"
          className="text-lg font-medium text-text hover:text-violet"
        >
          ResumeAI
        </Link>
      </div>
      <div className="block lg:hidden">
        {!isOpen && (
          <button
            onClick={toggleMenu}
            className="text-text focus:outline-none"
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

      <div className={`lg:hidden ${isOpen ? "block" : "hidden"} w-full bg-bg`}>
        <div className="flex flex-col items-center space-y-4 mt-4 relative">
          {isOpen && (
            <button
              onClick={toggleMenu}
              className="absolute top-2 left-2 text-text focus:outline-none"
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
            className="text-lg font-medium text-text hover:text-violet"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-lg font-medium text-text hover:text-violet"
          >
            Dashboard
          </Link>
          <Link
            href="/resume-ai"
            className="text-lg font-medium text-text hover:text-violet"
          >
            ResumeAI
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
