"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/home/header";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const navRef = useRef<HTMLElement | null>(null);
  const [menuTop, setMenuTop] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const update = () => {
      setMenuTop(el.getBoundingClientRect().bottom + 8);
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [isScrolled]);

  const toggleMenu = () => setIsOpen((v) => !v);

  const menuVariants = useMemo(
    () => ({
      closed: {
        opacity: 0,
        y: -8,
        height: 0,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.15, when: "afterChildren" },
      },
      open: {
        opacity: 1,
        y: 0,
        height: "auto",
        transition: prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 0.2,
              when: "beforeChildren",
              staggerChildren: 0.06,
              delayChildren: 0.04,
            },
      },
    }),
    [prefersReducedMotion]
  );

  const itemVariants = useMemo(
    () => ({
      closed: { opacity: 0, y: -6 },
      open: {
        opacity: 1,
        y: 0,
        transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.18 },
      },
    }),
    [prefersReducedMotion]
  );

  // Hide navbar on human-rooms routes - check AFTER all hooks are called
  const hideNavbar = pathname?.startsWith("/human-rooms");
  if (hideNavbar) {
    return null;
  }

  return (
    <>
      <div className="fixed top-2 inset-x-0 z-40 flex justify-center px-2">
        <motion.nav
          ref={navRef as any}
          initial={false}
          animate={prefersReducedMotion ? {} : { y: isScrolled ? 15 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
          className={[
            "relative z-[60] w-full",
            "flex items-center justify-between p-2",
            "select-none overflow-visible transition-all duration-700 mx-auto",
            isScrolled
              ? "max-w-[92vw] rounded-xl shadow-navbar-custom bg-surface/80 backdrop-blur-md"
              : "max-w-full rounded-none shadow-none bg-transparent",
          ].join(" ")}
        >
          {/* LEFT takes 1/2 of remaining space */}
          <div className="flex-1 flex items-center">
            <Link
              href="/"
              className="z-[100] text-text hover:text-text/80 transition-colors flex items-center gap-2 shrink-0"
              onClick={() => setIsOpen(false)}
            >
              <img
                src="/worker.png"
                className="w-auto h-11 bg-gold rounded-lg p-1 opacity-80"
                alt="Logo"
              />
              <span className="text-md font-semibold md:block hidden text-[1.2rem] tracking-tighter">
                Interview Prep
              </span>
            </Link>
          </div>

          {/* CENTER is true centered now */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-2 text-sm text-muted font-medium">
            <Link className="hover:bg-surface rounded-full transition-all text-text px-2 lg:px-4 py-2 whitespace-nowrap" href="/">
              Home
            </Link>
            <Link className="hover:bg-surface rounded-full transition-all text-text px-2 lg:px-4 py-2 whitespace-nowrap" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:bg-surface rounded-full transition-all text-text px-2 lg:px-4 py-2 whitespace-nowrap" href="/resume-ai">
              ResumeAI
            </Link>
          </div>

          {/* RIGHT takes the other 1/2 of remaining space */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <div className="hidden lg:flex items-center">
              <Header />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-text hover:bg-surface transition"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Portal menu to body so blur always targets the page behind */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-menu"
                key="mobile-menu"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="lg:hidden fixed left-2 right-2 z-[999] overflow-hidden"
                style={{ top: menuTop }}
              >
                <div className="rounded-xl border border-white/10 bg-bg/70 backdrop-blur-md p-4">
                  <div className="flex flex-col items-stretch gap-2">
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/"
                        className="block rounded-lg px-3 py-2 text-lg font-medium text-text hover:bg-surface transition"
                        onClick={() => setIsOpen(false)}
                      >
                        Home
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Link
                        href="/dashboard"
                        className="block rounded-lg px-3 py-2 text-lg font-medium text-text hover:bg-surface transition"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Link
                        href="/resume-ai"
                        className="block rounded-lg px-3 py-2 text-lg font-medium text-text hover:bg-surface transition"
                        onClick={() => setIsOpen(false)}
                      >
                        ResumeAI
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2 border-t border-white/10">
                      <Header />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default NavBar;
