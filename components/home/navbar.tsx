"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/home/header";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      }
      else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full fixed top-2 inset-x-0 z-40">
      <nav
        className={`hidden xl:flex flex-row self-start bg-transparent items-center justify-between p-2 relative z-[60] select-none overflow-visible transition-all duration-1000 mx-auto ${
          isScrolled
            ? "max-w-[92vw] rounded-xl shadow-navbar-custom bg-surface/80"
            : "max-w-full rounded-none shadow-none bg-transparent"
        }`}
        style={{
          minWidth: "fit-content",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          transform: isScrolled ? "translateY(15px)" : "translateY(0px)",
        }}
      >
        <div className="flex items-center">
          <a href="/" className="z-100 text-text hover:text-text/80 transition-colors flex items-center gap-2 shrink-0">
            <img src="/worker.png" className="w-auto h-7" alt="Logo" />
            <span className="text-sm font-semibold transition-opacity duration-200 md:block hidden text-[1.2rem] tracking-tighter" style={{ opacity: "100%", cursor: "pointer" }}>
              Interview Prep
            </span>
          </a>
        </div>
        <div className="flex flex-row flex-1 justify-center gap-1 xl:gap-2 text-sm text-muted font-medium hover:text-violet transition duration-200">
          <Link
            href="/"
            className="hover:bg-surface rounded-full duration-200 transition-all text-muted relative px-2 xl:px-4 py-2 whitespace-nowrap cursor-pointer"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:bg-surface rounded-full duration-200 transition-all text-muted relative px-2 xl:px-4 py-2 whitespace-nowrap cursor-pointer"
          >
            Dashboard
          </Link>
          <Link
            href="/resume-ai"
            className="hover:bg-surface rounded-full duration-200 transition-all text-muted relative px-2 xl:px-4 py-2 whitespace-nowrap cursor-pointer"
          >
            ResumeAI
          </Link>
        </div>
        <div className="flex items-center gap-4 bg-transparent">
          <Header />
        </div>
      </nav>

      {/* Mobile Menu for smaller screens */}
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
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-lg font-medium text-text hover:text-violet"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            href="/resume-ai"
            className="text-lg font-medium text-text hover:text-violet"
            onClick={toggleMenu}
          >
            ResumeAI
          </Link>
          <div>
            <Header />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
