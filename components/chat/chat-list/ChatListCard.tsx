"use client";

import { useAuth } from "@/context/AuthContext";
import { ChatListCardProps } from "@/types/Props";
import { Trash2 } from "lucide-react";

import ChatListAvatar from "./ChatListAvatar";
import ChatListInfo from "./ChatListInfo";
import ChatListActions from "./ChatListActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ChatUser = NonNullable<ChatListCardProps["chatUsers"][string]>;

export default function ChatListCard({
  chat,
  chatUsers,
  selectedChatId,
  handleSelectChat,
  handleSelectGroup,
  showArchived,
  onUnarchive,
  onDeleteChat,
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

  const otherUserId = participantIds.find((id) => id !== currentUserId);

  const otherUser = otherUserId ? chatUsers[otherUserId] : undefined;

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

      <div className="flex min-w-0 items-center">
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

        <div className="flex shrink-0 items-center gap-1 pr-2">
          {showArchived && (
            <ChatListActions chatId={chat.chatId} onUnarchive={onUnarchive} />
          )}
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete chat"
                  title="Delete chat"
                  className="
          h-8 w-8 shrink-0 rounded-xl text-zinc-400
          transition-all hover:bg-red-500/10 hover:text-red-500
          focus-visible:ring-2 focus-visible:ring-red-500/40
          sm:opacity-0 sm:group-hover:opacity-100
          sm:focus-visible:opacity-100
        "
                />
              }
            >
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this chat?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will remove the chat from your sidebar. Other
                  participants will still have their messages.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => onDeleteChat(chat.chatId)}
                  className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
