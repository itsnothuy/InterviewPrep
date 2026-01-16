"use client";

import { useState, ReactNode } from "react";

interface TabViewProps {
  children: ReactNode;
}

const TabView = ({ children }: TabViewProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "log">("details");

  return (
    <div className="h-full flex flex-col bg-[#262626] rounded-lg overflow-hidden">
      {/* Tab buttons */}
      <div className="flex border-b border-[#393939]">
        <button
          type="button"
          className={`
            flex-1 px-4 py-2 text-sm font-medium
            ${
              activeTab === "details"
                ? "bg-[#393939] text-white"
                : "text-[#8d8d8d] hover:text-white hover:bg-[#353535]"
            }
            transition-colors
          `}
          onClick={() => setActiveTab("details")}
        >
          Room Details
        </button>
        <button
          type="button"
          className={`
            flex-1 px-4 py-2 text-sm font-medium
            ${
              activeTab === "log"
                ? "bg-[#393939] text-white"
                : "text-[#8d8d8d] hover:text-white hover:bg-[#353535]"
            }
            transition-colors
          `}
          onClick={() => setActiveTab("log")}
        >
          Activity Log
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === "details" ? (
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        ) : (
          <div className="absolute inset-0 overflow-y-auto p-2 space-y-1">
            <div className="text-xs text-[#8d8d8d] p-2">
              <p className="text-[#c6c6c6] mb-2">Activity log will show:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Room creation time</li>
                <li>Video connection events</li>
                <li>Code execution history</li>
                <li>User actions</li>
              </ul>
              <p className="mt-4 text-[#6f6f6f] italic">
                Coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabView;
