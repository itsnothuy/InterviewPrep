'use client';

import React from 'react';
import ChatComponent from '@/components/chat/ChatComponent';
import ChatSideBar from '@/components/chat/ChatSideBar';
import PDFViewer from '@/components/chat/PDFViewer';
import { DrizzleChat } from '@/utils/schema';
import { useResizable } from '@/hooks/useResizable';
import { ResizeHandle } from '@/components/ui/resize-handle';

interface ChatLayoutProps {
  chats: DrizzleChat[];
  chatId: number;
  currentChat: DrizzleChat;
}

/**
 * ChatLayout - Resizable three-panel layout for chat page
 * 
 * IMPLEMENTATION PATTERN (from POSTMORTEM_CODE_EDITOR_REFACTOR.md):
 * - Custom resize hook with proper event listener management
 * - Sidebar has dynamic pixel width (user-controlled)
 * - PDF and Chat share remaining space with fixed flex ratio
 * - localStorage persistence for sidebar width
 */
export default function ChatLayout({ chats, chatId, currentChat }: ChatLayoutProps) {
  // Resize only the sidebar (simple two-panel approach)
  const { width: sidebarWidth, isResizing, handleMouseDown } = useResizable({
    initialWidth: 280,
    minWidth: 200,
    maxWidth: 500,
    storageKey: 'chat-sidebar-width',
  });

  return (
    <div className="flex w-full bg-bg pt-10 mt-8" style={{ height: 'calc(100vh - 50px)' }}>
      <div className="flex w-full h-full">
        {/* Sidebar with dynamic width */}
        <div
          className="h-full overflow-y-auto hide-scrollbar flex-shrink-0"
          style={{ width: `${sidebarWidth}px` }}
        >
          <ChatSideBar chats={chats} chatId={chatId} />
        </div>

        {/* Resize Handle */}
        <ResizeHandle onMouseDown={handleMouseDown} isResizing={isResizing} />

        {/* Main content (PDF + Chat) - shares remaining space */}
        <div className="flex flex-1 h-full overflow-hidden">
          {/* PDF Viewer - takes 6/9 of remaining space */}
          <div className="h-full flex-[6] overflow-y-auto hide-scrollbar">
            <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
          </div>
          {/* Chat Component - takes 3/9 of remaining space */}
          <div className="flex-[3] overflow-y-auto hide-scrollbar">
            <ChatComponent chatId={chatId} />
          </div>
        </div>
      </div>
    </div>
  );
}
