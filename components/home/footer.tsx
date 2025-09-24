import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-bg rounded-lg m-4 border border-surface border-gray-600/30">
      <div className="w-full mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src="/worker.png" className="w-auto h-12" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-text">
              Interview Prep
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-muted sm:mb-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6 hover:text-violet">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6 hover:text-violet">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6 hover:text-violet">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-violet">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-surface sm:mx-auto lg:my-8" />
        <span className="block text-sm text-muted sm:text-center">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline hover:text-violet">
            Interview Prep
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
