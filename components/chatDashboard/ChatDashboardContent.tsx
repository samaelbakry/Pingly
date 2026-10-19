"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import ChatNavRail from "@/components/chat/layout/ChatNavRail";
import ChatSidebar from "@/components/chat/layout/sidebar/ChatSidebar";
import Navbar from "@/components/common/Navbar";
import StoriesSection from "../stories/StoriesSection";

import { useChat } from "@/context/ChatProvider";
import ChatWindow from "../chat/layout/chat-window/ChatWindow";

export default function ChatDashboardContent() {
  const { selectedChat, clearSelectedChat } = useChat();

  const [showArchived, setShowArchived] = useState(false);

  const hasSelectedChat = selectedChat !== null;

  return (
    <div
      className="
        relative flex h-dvh min-h-0 w-full flex-col overflow-hidden
        bg-slate-50/50 text-slate-800
        selection:bg-orange-500 selection:text-white
        dark:bg-zinc-950 dark:text-zinc-100
      "
    >
      <div
        className="
          pointer-events-none absolute left-1/2 top-0 z-20
          h-150 w-250 -translate-x-1/2 rounded-full
          bg-linear-to-tr from-amber-300/40 via-orange-300/40 to-red-300/40
          blur-[130px]
          dark:from-amber-500/10 dark:via-orange-600/10 dark:to-red-600/10
        "
      />

      <div
        className="
          pointer-events-none absolute -left-32 top-1/3
          h-96 w-96 rounded-full bg-orange-400/30 blur-[120px]
          dark:bg-orange-600/15
        "
      />

      <div
        className="
          pointer-events-none absolute -right-32 bottom-10
          h-125 w-125 rounded-full bg-rose-400/25 blur-[140px]
          dark:bg-rose-600/15
        "
      />

      <Navbar />

      <div
        className={`
    chat-scroll relative z-50
    h-[70px] max-h-[70px] shrink-0
    w-full min-w-0
    overflow-x-hidden overflow-y-hidden overscroll-contain
    ${hasSelectedChat ? "hidden md:block" : "block"}
    sm:h-[84px] sm:max-h-[84px]
  `}
      >
        <StoriesSection />
      </div>
      <main
        className="
          relative z-40 mx-auto flex min-h-0 min-w-0
          w-full max-w-8xl flex-1 flex-col gap-3
          overflow-hidden pb-20
          sm:gap-4 sm:p-4 sm:pb-20
          md:p-6 md:pb-6
        "
      >
        <div className="relative z-40 flex min-h-0 min-w-0 w-full flex-1 gap-2 overflow-hidden sm:gap-3 md:gap-4">
          <ChatNavRail
            setShowArchived={setShowArchived}
            showArchived={showArchived}
          />

          <div
            className={`
              chat-scroll h-full min-h-0 min-w-0 shrink-0
              transition-all duration-300 ease-in-out
              w-full md:w-80 lg:w-96
              ${
                hasSelectedChat
                  ? "hidden md:block"
                  : "block animate-in fade-in zoom-in-95 duration-200"
              }
            `}
          >
            <ChatSidebar showArchived={showArchived} />
          </div>

          <div
            className={`
              h-full min-h-0 min-w-0 flex-1 flex-col
              transition-all duration-300 ease-in-out
              ${
                hasSelectedChat
                  ? "flex animate-in fade-in zoom-in-95 duration-200"
                  : "hidden md:flex"
              }
            `}
          >
            {hasSelectedChat && (
              <div className="mb-2.5 flex shrink-0 items-center px-1 md:hidden">
                <button
                  onClick={clearSelectedChat}
                  type="button"
                  aria-label="Back to conversations"
                  className="
                    flex size-10 items-center justify-center rounded-full
                    border border-white/80 bg-white/70 text-slate-700
                    shadow-sm backdrop-blur-2xl transition-all
                    hover:bg-white active:scale-95
                    dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200
                  "
                >
                  <ArrowLeft
                    className="
                      h-5 w-5 stroke-[2.5] text-orange-500
                      dark:text-orange-400
                    "
                  />
                </button>
              </div>
            )}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-1">
              <ChatWindow handleLeaveChat={clearSelectedChat} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
