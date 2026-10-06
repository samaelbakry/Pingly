"use client";

import ChatNotification from "@/components/chat/actions/ChatNotifications";
import ChatNavRail from "@/components/chat/layout/ChatNavRail";
import ChatSidebar from "@/components/chat/layout/sidebar/ChatSidebar";
import Navbar from "@/components/common/Navbar";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import { getUserChats } from "@/services/chats";
import { listenToAllUserMessages } from "@/services/notifications";
import { getUserById } from "@/services/users";

import { UserProfile } from "@/types/userProfile";

import { useEffect, useState } from "react";

import ChatWindow from "../chat/layout/chat-window/ChatWindow";
import { ArrowLeft } from "lucide-react";

export default function ChatDashboardContent() {
  const { user: currentUser } = useAuth();

  const { selectedChat, clearSelectedChat } = useChat();

  const [showArchived, setShowArchived] = useState(false);

  const [notification, setNotification] = useState<{
    user: UserProfile;
    message: string;
  } | null>(null);

  const hasSelectedChat = selectedChat !== null;

  useEffect(() => {
    if (!currentUser?.uid) return;

    let unsubscribeMessages: (() => void) | undefined;

    const setupMessageListener = async () => {
      try {
        const chats = await getUserChats(currentUser.uid);

        const chatIds = chats.map((chat) => chat.chatId);

        if (chatIds.length === 0) return;

        unsubscribeMessages = listenToAllUserMessages(
          chatIds,
          currentUser.uid,
          async (message) => {
            const sender = await getUserById(message?.senderId);

            if (sender) {
              setNotification({
                user: sender,
                message: message.text!,
              });
            }
          },
        );
      } catch (error) {
        console.error("Failed to setup message listener:", error);
      }
    };

    setupMessageListener();

    return () => {
      unsubscribeMessages?.();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <div
      className="
        relative
        flex
        h-screen
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-slate-50/50
        text-slate-800
        selection:bg-orange-500
        selection:text-white

        dark:bg-zinc-950
        dark:text-zinc-100
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          z-0
          h-100
          w-150
          -translate-x-1/2
          rounded-full
          bg-linear-to-tr
          from-amber-400/20
          via-orange-400/20
          to-red-400/20
          blur-[140px]

          dark:from-amber-600/10
          dark:via-orange-600/10
          dark:to-red-600/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/3
          z-0
          h-96
          w-96
          rounded-full
          bg-orange-500/15
          blur-[120px]

          dark:bg-orange-600/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          z-0
          h-125
          w-125
          rounded-full
          bg-rose-500/15
          blur-[150px]

          dark:bg-rose-600/10
        "
      />

      <Navbar />

      <main
        className="
    relative
    z-10
    mx-auto
    flex
    min-h-0
    min-w-0
    w-full
    max-w-8xl
    flex-1
    gap-2
    overflow-hidden
    p-2
    pb-20

    sm:gap-3
    sm:p-4
    sm:pb-20

    md:gap-4
    md:p-6
    md:pb-6
  "
      >
        <ChatNavRail
          setShowArchived={setShowArchived}
          showArchived={showArchived}
        />

        <div
          className={`
      h-full
      min-h-0
      min-w-0
      shrink-0
      chat-scroll
      transition-all
      duration-300
      ease-in-out

      w-full

      md:w-80
      lg:w-96

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
      flex
      h-full
      min-h-0
      min-w-0
      flex-1
      flex-col
      transition-all
      duration-300
      ease-in-out

      ${
        hasSelectedChat
          ? "flex animate-in fade-in zoom-in-95 duration-200"
          : "hidden md:flex"
      }
    `}
        >
          {hasSelectedChat && (
            <div
              className="
          mb-2.5
          flex
          shrink-0
          items-center
          px-1

          md:hidden
        "
            >
              <button
                onClick={clearSelectedChat}
                type="button"
                aria-label="Back to conversations"
                className="
            flex
            size-10
            items-center
            justify-center
            rounded-full
            border
            border-white/80
            bg-white/70
            text-slate-700
            shadow-sm
            backdrop-blur-2xl
            transition-all
            hover:bg-white
            active:scale-95

            dark:border-zinc-800
            dark:bg-zinc-900/80
            dark:text-zinc-200
          "
              >
                <ArrowLeft
                  className="
              h-5
              w-5
              stroke-[2.5]
              text-orange-500

              dark:text-orange-400
            "
                />
              </button>
            </div>
          )}

          <div
            className="
        flex
        min-h-0
        min-w-0
        flex-1
        flex-col
        overflow-hidden
        pb-1
      "
          >
            <ChatWindow handleLeaveChat={clearSelectedChat} />
          </div>
        </div>

        {notification && (
          <ChatNotification
            user={notification.user}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </main>
    </div>
  );
}
