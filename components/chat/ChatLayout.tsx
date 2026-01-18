'use client';

import React from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import ChatComponent from '@/components/chat/ChatComponent';
import ChatSideBar from '@/components/chat/ChatSideBar';
import PDFViewer from '@/components/chat/PDFViewer';
import { DrizzleChat } from '@/utils/schema';

interface ChatLayoutProps {
  chats: DrizzleChat[];
  chatId: number;
  currentChat: DrizzleChat;
}

export default function ChatLayout({ chats, chatId, currentChat }: ChatLayoutProps) {
  return (
    <div className="flex w-full bg-bg pt-10 mt-8" style={{ height: 'calc(100vh - 50px)' }}>
      <Group orientation="horizontal" className="w-full h-full">
        {/* Chat Sidebar Panel - Resizable */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          className="h-full overflow-y-auto hide-scrollbar"
        >
          <ChatSideBar chats={chats} chatId={chatId} />
        </Panel>

        {/* Resize Handle between Sidebar and PDF */}
        <Separator className="w-1 bg-transparent hover:bg-blue-500/30 transition-colors cursor-col-resize relative group">
          {/* Visual indicator on hover */}
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-0.5 h-12 bg-blue-500 rounded-full" />
          </div>
        </Separator>

        {/* PDF Viewer Panel - Resizable */}
        <Panel
          defaultSize={55}
          minSize={30}
          className="h-full overflow-y-auto hide-scrollbar"
        >
          <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
        </Panel>

        {/* Resize Handle between PDF and Chat */}
        <Separator className="w-1 bg-transparent hover:bg-blue-500/30 transition-colors cursor-col-resize relative group">
          {/* Visual indicator on hover */}
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-0.5 h-12 bg-blue-500 rounded-full" />
          </div>
        </Separator>

        {/* Chat Component Panel - Resizable */}
        <Panel
          defaultSize={25}
          minSize={20}
          maxSize={40}
          className="overflow-y-auto hide-scrollbar"
        >
          <ChatComponent chatId={chatId} />
        </Panel>
      </Group>
    </div>
  );
}
