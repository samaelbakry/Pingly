"use client";
import ChatArea from "@/components/chat/ChatArea";
import ChatSidebar from "@/components/chat/ChatSidebar";
import Navbar from "@/components/common/Navbar";
import { useState , useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserChats } from "@/services/chats";
import { listenToAllUserMessages } from "@/services/notifications";
import { UserProfile } from "@/types/userProfile";
import ChatNotification from "@/components/chat/ChatNotifications";
import { getUserById } from "@/services/chats";

export default function ChatDashboard() {
  const { user: currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<{
  user: UserProfile;
  message: string;
} | null>(null);

  const handleBackToSidebar = () => {
    setSelectedUserId(null);
    setChatId(null);
    setSelectedUser(null);
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
          const sender = await getUserById(message?.senderId)

          if(sender){
            setNotification({
              user:sender ,
              message:message.text
            })
          }
        },
      );
    } catch (error) {
      console.error(
        "Failed to setup message listener:",
        error,
      );
    }
  };

  setupMessageListener();

  return () => {
    unsubscribeMessages?.();
  };
}, [currentUser?.uid]);

 useEffect(() => {
    
    if(!notification) return

   const timer = setTimeout(() => {
      setNotification(null)
    }, 6000);
  
    return () => clearTimeout(timer)
  }, [notification])


  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50/50 text-slate-800 selection:bg-orange-500 selection:text-white flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-linear-to-tr from-amber-400/20 via-orange-400/20 to-red-400/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-125 h-125 bg-rose-500/15 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 flex h-[calc(100vh-4rem)] max-w-7xl w-full mx-auto p-3 sm:p-6 gap-5 overflow-hidden">
        <div 
          className={`w-full sm:w-96 shrink-0 h-full transition-all duration-300 ease-in-out ${selectedUserId ? "hidden sm:block" : "block animate-in fade-in zoom-in-95 duration-200"
          }`}
        >
          <ChatSidebar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            setChatId={setChatId}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

        <div 
          className={`flex-1 h-full flex flex-col transition-all duration-300 ease-in-out ${
            selectedUserId ? "block animate-in fade-in zoom-in-95 duration-200" 
              : "hidden sm:flex"
          }`}
        >
          {selectedUserId && (
            <div className="flex sm:hidden items-center mb-2.5 px-1 shrink-0">
              <button
                onClick={handleBackToSidebar}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 text-xs font-semibold text-slate-700 backdrop-blur-2xl shadow-sm active:scale-95 transition-all"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5] text-orange-500" />
                Conversations
              </button>
            </div>
          )}

          <div className="flex-1 h-full overflow-hidden">
            <ChatArea 
              selectedUserId={selectedUserId} 
              selectedUser={selectedUser}
              chatId={chatId} 
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