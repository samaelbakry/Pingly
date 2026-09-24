"use client";
import ChatNotification from "@/components/chat/features/ChatNotifications";
import ChatNavRail from "@/components/chat/layout/ChatNavRail";
import ChatSidebar from "@/components/chat/layout/ChatSidebar";
import ChatWindow from "@/components/chat/layout/ChatWindow";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/AuthContext";
import { getUserChats } from "@/services/chats";
import { listenToAllUserMessages } from "@/services/notifications";
import { getUserById } from "@/services/users";
import { UserProfile } from "@/types/userProfile";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatDashboard() {
  const { user: currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [notification, setNotification] = useState<{
    user: UserProfile;
    message: string;
  } | null>(null);

  const handleBackToSidebar = () => {
    setSelectedUserId(null);
    setChatId(null);
    setSelectedUser(null);
    setIsGroupChat(false);
  };

   const handleLeaveChat = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
    setChatId(null);
    setIsGroupChat(false);
  };

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
    <div className="relative h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 selection:bg-orange-500 selection:text-white flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-linear-to-tr from-amber-400/20 via-orange-400/20 to-red-400/20 dark:from-amber-600/10 dark:via-orange-600/10 dark:to-red-600/10 blur-[140px] rounded-full pointer-events-none z-50" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-500/15 dark:bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-125 h-125 bg-rose-500/15 dark:bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex min-h-0 flex-1 max-w-8xl w-full mx-auto p-3 sm:p-6 gap-4 overflow-hidden">
        {" "}
        <ChatNavRail
          setShowArchived={setShowArchived}
          showArchived={showArchived}
        />
        <div
          className={`w-full sm:w-96 h-full min-h-0 transition-all duration-300 ease-in-out shrink-0 ${
            selectedUserId
              ? "hidden sm:block"
              : "block animate-in fade-in zoom-in-95 duration-200"
          }`}
        >
          <ChatSidebar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            setChatId={setChatId}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setIsGroupChat={setIsGroupChat}
            setShowArchived={setShowArchived}
            showArchived={showArchived}
          />
        </div>
        <div
          className={`flex-1 h-full flex flex-col transition-all duration-300 ease-in-out ${
            selectedUserId
              ? "block animate-in fade-in zoom-in-95 duration-200"
              : "hidden sm:flex"
          }`}
        >
          {selectedUserId && (
            <div className="flex sm:hidden items-center mb-2.5 px-1 shrink-0">
              <button
                onClick={handleBackToSidebar}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-900/80 border border-white/80 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 backdrop-blur-2xl shadow-sm active:scale-95 transition-all"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5] text-orange-500 dark:text-orange-400" />
                Conversations
              </button>
            </div>
          )}

          <div className="flex flex-col flex-1 min-h-0 overflow-hidden pb-1">
            <ChatWindow
              selectedUserId={selectedUserId}
              selectedUser={selectedUser}
              chatId={chatId}
              handleLeaveChat={handleLeaveChat}
              isGroupChat={isGroupChat}
            />
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
