"use client";

import ChatDashboardContent from "@/components/chatDashboard/ChatDashboardContent";
import { ChatProvider } from "@/context/ChatProvider";


export default function ChatDashboard() {
  return (
    <ChatProvider>
      <ChatDashboardContent />
    </ChatProvider>
  );
}