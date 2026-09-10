"use client";
import ChatArea from "@/components/chat/ChatArea";
import ChatSidebar from "@/components/chat/ChatSidebar";
import Navbar from "@/components/common/Navbar";
import { useState } from "react";

export default function ChatDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-amber-50/40 text-slate-800 selection:bg-orange-500 selection:text-white flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-linear-to-tr from-amber-300/40 via-orange-300/40 to-red-300/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-400/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-125 h-125 bg-rose-400/25 blur-[140px] rounded-full pointer-events-none" />

     <Navbar />

      <main className="relative z-10 flex-1 flex h-[calc(100vh-4rem)] max-w-6xl w-full mx-auto p-4 sm:p-6 gap-4">
        <div className="w-80 shrink-0 h-full">
          <ChatSidebar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            setChatId={setChatId}
          />{" "}
        </div>

        <div className="flex-1 h-full">
          <ChatArea 
          selectedUserId={selectedUserId} 
          chatId={chatId} />{" "}
        </div>
      </main>
    </div>
  );
}
