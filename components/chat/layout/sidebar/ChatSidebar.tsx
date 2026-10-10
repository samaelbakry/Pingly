"use client";

import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import ChatListCard from "../../chat-list/ChatListCard";
import NoMatchingChats from "../../states/NoMatchingChats";
import SidebarHeader from "./SidebarHeader";
import ChatSidebarFooter from "./ChatSidebarFooter";
import { ChatItem } from "@/types/chatType";
import { useChatSidebar } from "@/hooks/sidebar/useChatSidebar";

type ChatSidebarProps = { showArchived: boolean };

export default function ChatSidebar({ showArchived }: ChatSidebarProps) {
  const {
    search,
    setSearch,
    userChats,
    chatUsers,
    loading,
    filteredChats,
    currentUserId,
    selectedChatId,
    handleSelectChat,
    handleSelectGroup,
    handleUnarchive,
    handleCreateGroup,
  } = useChatSidebar(showArchived);

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/55 p-3 shadow-[0_20px_70px_rgba(249,115,22,0.08)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/55 dark:shadow-none">
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <SidebarHeader
        userChats={userChats}
        search={search}
        setSearch={setSearch}
      />

      <div className="custom-scrollbar relative z-10 -mr-1 flex-1 space-y-1 overflow-y-auto px-1 pb-2 pr-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ChatSkeleton key={index} />
          ))
        ) : filteredChats.length === 0 ? (
          <NoMatchingChats />
        ) : (
          filteredChats.map((chat: ChatItem) => (
            <ChatListCard
              key={chat.chatId}
              chat={chat}
              chatUsers={chatUsers}
              handleSelectChat={handleSelectChat}
              handleSelectGroup={handleSelectGroup}
              selectedChatId={selectedChatId}
              showArchived={showArchived}
              onUnarchive={handleUnarchive}
            />
          ))
        )}
      </div>

      <div className="relative z-10 mt-2 border-t border-zinc-200/60 pt-2 dark:border-zinc-800/70">
        <ChatSidebarFooter
          currentUserId={currentUserId ?? ""}
          handleSelectChat={handleSelectChat}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </aside>
  );
}
