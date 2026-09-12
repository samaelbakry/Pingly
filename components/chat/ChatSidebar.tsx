"use client";

import { Plus, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/context/AuthContext";
import { createChat, getUserById, getUserChats } from "@/services/chats";

import ChatSkeleton from "../skeletons/ChatSkeleton";
import AddNewChatDialog from "./AddNewChatDialog";

import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

type ChatPropsType = {
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  setChatId: (chatId: string | null) => void;
  selectedUser: UserProfile | null;
  setSelectedUser: (user: UserProfile | null) => void;
};

export default function ChatSidebar({ selectedUserId, setSelectedUserId, setSelectedUser, setChatId}: ChatPropsType) {
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [userChats, setUserChats] = useState<ChatItem[]>([]);

  const [chatUsers, setChatUsers] = useState<Record<string, UserProfile>>({});

  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);

        if (!currentUser) return;

        const chats = await getUserChats(currentUser.uid);

        const chatItems = chats as unknown as ChatItem[];

        setUserChats(chatItems);

        const usersEntries = await Promise.all(
          chatItems.map(async (chat) => {
            const participantIds = Object.keys(chat?.participants);

            const otherUserId = participantIds.find(
              (id) => id !== currentUser.uid,
            );

            if (!otherUserId) return null;

            const user = await getUserById(otherUserId);

            if (!user) return null;

            return [otherUserId, user] as const;
          }),
        );

        const usersMap: Record<string, UserProfile> = {};

        usersEntries.forEach((entry) => {
          if (!entry) return;

          const [userId, user] = entry;

          usersMap[userId] = user;
        });

        setChatUsers(usersMap);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      loadChats();
    }
  }, [currentUser?.uid]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return userChats;
    }

    return userChats.filter((chat) => {
      const participantIds = Object.keys(chat.participants);

      const otherUserId = participantIds.find((id) => id !== currentUser?.uid);

      if (!otherUserId) return false;

      const otherUser = chatUsers[otherUserId];

      return (
        otherUser?.name?.toLowerCase().includes(query) ||
        otherUser?.email?.toLowerCase().includes(query)
      );
    });
  }, [userChats, chatUsers, search, currentUser?.uid]);

const handleSelectChat = async (currentUserID: string, user: UserProfile) => {
  if (!currentUserID || !user?.uid) return;

  try {
    const chatID = await createChat(
      currentUserID,
      user.uid,
    );

    setSelectedUserId(user.uid);
    setSelectedUser(user);
    setChatId(chatID);
  } catch (error) {
    console.error("Failed to open chat:", error);
  }
};

  return (
    <div className="relative flex min-h-screen flex-col rounded-[2.5rem] border border-white/40 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/40 p-4 shadow-[0_8px_32px_0_rgba(249,115,22,0.06)] dark:shadow-none backdrop-blur-3xl">
      <div className="flex items-center justify-between border-b border-white/20 dark:border-zinc-800 pb-3.5 px-1 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-t-2xl">
        <div>
          <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-slate-800 dark:text-zinc-100">
            Messages
            <Sparkles className="h-3.5 w-3.5 fill-amber-500/20 text-amber-500 dark:text-amber-400" />
          </h2>

          <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
            {userChats.length} conversations
          </p>
        </div>
      </div>

      <div className="relative my-3">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />

        <Input
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-full border-white/40 dark:border-zinc-800 bg-white/40 dark:bg-zinc-800/60 pl-9 pr-4 text-xs text-slate-900 dark:text-zinc-100 backdrop-blur-md transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:border-orange-400 dark:focus-visible:border-orange-500 focus-visible:bg-white/60 dark:focus-visible:bg-zinc-800 focus-visible:ring-4 focus-visible:ring-orange-500/10 shadow-inner"
        />
      </div>

      <div className="custom-scrollbar -mr-1 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ChatSkeleton key={index} />
          ))
        ) : filteredChats.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 backdrop-blur-md">
              <Search className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            </div>

            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
              No conversations yet
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              Start a new chat to begin messaging
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const participantIds = Object.keys(chat.participants);

            const otherUserId = participantIds.find(
              (id) => id !== currentUser?.uid,
            );

            if (!otherUserId) return null;

            const otherUser = chatUsers[otherUserId];

            const isSelected = selectedUserId === otherUserId;

            return (
              <button
                key={chat.chatId}
                type="button"
                onClick={() => {
                  if (currentUser?.uid) {
                    handleSelectChat(currentUser.uid, otherUser);
                  }
                }}
                className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-white/60 dark:border-zinc-700 bg-linear-to-r from-orange-500/15 via-amber-500/10 to-rose-500/10 dark:from-orange-500/20 dark:via-amber-500/15 dark:to-rose-500/15 shadow-xs backdrop-blur-md"
                    : "border-transparent hover:bg-white/30 dark:hover:bg-zinc-800/50 backdrop-blur-xs"
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-orange-500 to-rose-500 shadow-sm" />
                )}

                <Avatar className="h-11 w-11 border border-white/60 dark:border-zinc-700 shadow-xs">
                  <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white">
                    {otherUser?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-100">
                    {otherUser?.name || "Unknown User"}
                  </p>

                  <p className="truncate text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
                    {otherUser?.email || otherUser?.phoneNumber || "No contact info"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-2 border-t border-white/20 dark:border-zinc-800 pt-3 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-b-2xl p-1">
        <Button
          type="button"
          onClick={() => setIsNewChatOpen(true)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-xs font-bold text-white shadow-lg shadow-orange-500/20 dark:shadow-none transition-all hover:opacity-95 hover:shadow-orange-500/30 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4 stroke-3" />
          New Chat
        </Button>

        <AddNewChatDialog
          isNewChatOpen={isNewChatOpen}
          setIsNewChatOpen={setIsNewChatOpen}
          currentUserId={currentUser?.uid}
          onSelectUser={handleSelectChat}
        />
      </div>
    </div>
  );
}