"use client";
import ChatArea from "@/components/chat/ChatArea";
import ChatSidebar from "@/components/chat/ChatSidebar";
import Navbar from "@/components/common/Navbar";
import { UserProfile } from "@/types/userProfile";
import { useState } from "react";

export default function ChatDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50/50 text-slate-800 selection:bg-orange-500 selection:text-white flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-linear-to-tr from-amber-400/20 via-orange-400/20 to-red-400/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-125 h-125 bg-rose-500/15 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 flex h-[calc(100vh-4rem)] max-w-7xl w-full mx-auto p-4 sm:p-6 gap-5">
        <div className="w-80 sm:w-96 shrink-0 h-full">
          <ChatSidebar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            setChatId={setChatId}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

        <div className="flex-1 h-full">
          <ChatArea 
            selectedUserId={selectedUserId} 
            selectedUser={selectedUser}
            chatId={chatId} 
          />
        </div>
      </main>
    </div>
  );
}