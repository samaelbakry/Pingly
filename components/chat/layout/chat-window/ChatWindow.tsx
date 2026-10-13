"use client";

import { useChatWindow } from "@/hooks/chat/window/useChatWindow";

import MessageBubble from "../../message/MessageBubble";
import MessageComposer from "../../message/MessageComposer";
import NoChatSelectedState from "../../states/NoChatSelectedState";
import ChatWindowHeader from "./ChatWindowHeader";

import BlockStatusUI from "../../actions/BlockStatusUI";
import TypingIndicator from "../../actions/TypingIndicator";

export default function ChatWindow({
  handleLeaveChat,
}: {
  handleLeaveChat: () => void;
}) {
  const {
    selectedChat,
    chatId,
    currentUserId,
    isGroupChat,
    selectedGroup,
    visibleSelectedUser,
    messages,
    chatUsers,
    isSomeoneTyping,
    blockStatus,
    messagesEndRef,
    replyingTo,
    handleReply,
    cancelReply,
  } = useChatWindow();

  if (!selectedChat || !chatId) {
    return <NoChatSelectedState />;
  }

  return (
    <div className="mb-3 flex h-full min-h-0 flex-col overflow-hidden rounded-[2.5rem] border border-zinc-200/80 bg-white/30 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 dark:shadow-none z-50">
      <ChatWindowHeader
        selectedUser={visibleSelectedUser}
        selectedGroup={selectedGroup}
        isGroupChat={isGroupChat}
        currentUserId={currentUserId ?? ""}
        messages={messages}
        chatId={chatId}
        handleLeaveChat={handleLeaveChat}
      />

      <div className="chat-scroll min-h-0 flex-1 space-y-3.5 overflow-y-auto p-5">
        <MessageBubble
          messages={messages}
          chatId={chatId}
          chatUsers={chatUsers}
          isGroupChat={isGroupChat}
          onReply={handleReply}
        />

        {isSomeoneTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {isGroupChat || blockStatus === "none" ? (
        <MessageComposer
          chatId={chatId}
          currentUserId={currentUserId ?? ""}
          replyingTo={replyingTo}
          onCancelReply={cancelReply}
        />
      ) : (
        <BlockStatusUI blockStatus={blockStatus} />
      )}
    </div>
  );
}