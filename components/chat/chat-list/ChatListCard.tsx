"use client";

import { useAuth } from "@/context/AuthContext";
import { ChatListCardProps } from "@/types/Props";

import ChatListAvatar from "./ChatListAvatar";
import ChatListInfo from "./ChatListInfo";
import ChatListActions from "./ChatListActions";

type ChatUser = NonNullable<
  ChatListCardProps["chatUsers"][string]
>;

export default function ChatListCard({
  chat,
  chatUsers,
  selectedChatId,
  handleSelectChat,
  handleSelectGroup,
  showArchived,
  onUnarchive,
}: ChatListCardProps) {
  const { user: currentUser } = useAuth();

  const currentUserId = currentUser?.uid;
  const isGroup = chat.type === "group";
  const isSelected = selectedChatId === chat.chatId;

  const participantIds = Object.keys(chat.participants ?? {});

  const groupParticipants = participantIds
    .filter((id) => id !== currentUserId)
    .map((id) => chatUsers[id])
    .filter((user): user is ChatUser => Boolean(user));

  const otherUserId = participantIds.find(
    (id) => id !== currentUserId
  );

  const otherUser = otherUserId
    ? chatUsers[otherUserId]
    : undefined;

  const storedUnread = chat.unreadCounts?.[currentUserId ?? ""];

  const unreadCount =
    storedUnread ??
    (chat.lastMessage &&
    chat.lastMessage.senderId !== currentUserId &&
    chat.lastMessage.seen !== true
      ? 1
      : 0);

  const handleSelect = () => {
    if (!currentUserId) return;

    if (isGroup) {
      handleSelectGroup(chat.chatId);
      return;
    }

    if (otherUser) {
      handleSelectChat(currentUserId, otherUser);
    }
  };

  const selectedClasses = isSelected
    ? isGroup
      ? "border-violet-200 bg-linear-to-r from-violet-50 via-white to-amber-50 shadow-[0_8px_25px_rgba(139,92,246,0.10)] dark:border-violet-500/20 dark:from-violet-500/10 dark:via-zinc-900 dark:to-amber-500/5"
      : "border-orange-200 bg-linear-to-r from-orange-50 via-white to-amber-50 shadow-[0_8px_25px_rgba(249,115,22,0.10)] dark:border-orange-500/20 dark:from-orange-500/10 dark:via-zinc-900 dark:to-amber-500/5"
    : "border-transparent hover:border-zinc-200/80 hover:bg-white/75 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/70";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${selectedClasses}`}
    >
      {isSelected && (
        <span
          className={`absolute bottom-3 left-0 top-3 w-0.75 rounded-r-full bg-linear-to-b ${
            isGroup
              ? "from-violet-500 to-violet-400"
              : "from-orange-500 to-amber-400"
          }`}
        />
      )}

      <div className="flex items-center">
        <button
          type="button"
          onClick={handleSelect}
          aria-pressed={isSelected}
          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
        >
          <ChatListAvatar
            isGroup={isGroup}
            groupName={chat.name}
            groupPhotoURL={chat.photoURL}
            groupParticipants={groupParticipants}
            otherUser={otherUser}
          />

          <ChatListInfo
            chat={chat}
            isGroup={isGroup}
            currentUserId={currentUserId}
            otherUser={otherUser}
            unreadCount={unreadCount}
          />
        </button>

        {showArchived && (
          <ChatListActions
            chatId={chat.chatId}
            onUnarchive={onUnarchive}
          />
        )}
      </div>
    </div>
  );
}