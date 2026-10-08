"use client";

import { useEffect, useRef, useState } from "react";

import { listenToMessages, markMessagesAsSeen } from "@/services/messages";
import { Message, ReplyTo } from "@/types/messages";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import { database } from "@/lib/firebaseConfig";
import { listenToTyping } from "@/services/typing";
import { get, ref } from "firebase/database";

import { UserProfile } from "@/types/userProfile";
import MessageBubble from "../../message/MessageBubble";
import MessageComposer from "../../message/MessageComposer";
import NoChatSelectedState from "../../states/NoChatSelectedState";
import ChatWindowHeader from "./ChatWindowHeader";

export default function ChatWindow({
  handleLeaveChat,
}: {
  handleLeaveChat: () => void;
}) {
  const { user: currentUser } = useAuth();

  const { selectedChat } = useChat();

  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const [chatUsers, setChatUsers] = useState<Record<string, UserProfile>>({});
  const [replyingTo, setReplyingTo] = useState<ReplyTo | null>(null);

  const chatId = selectedChat?.chatId ?? null;

  const isGroupChat = selectedChat?.type === "group";

  const selectedUser = selectedChat?.type === "user" ? selectedChat.user : null;

  const selectedGroup =
    selectedChat?.type === "group" ? selectedChat.group : null;

  const isSomeoneTyping = typingUsers.length > 0;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const loadChat = async () => {
      try {
        const snapshot = await get(ref(database, `chats/${chatId}`));

        if (!snapshot.exists()) {
          return;
        }

        const chat = snapshot.val();

        const messagesSnapshot = await get(
          ref(database, `chats/${chatId}/messages`),
        );

        const messagesData = messagesSnapshot.exists()
          ? messagesSnapshot.val()
          : {};

        const fetchedMessages: Message[] = Object.entries(messagesData).map(
          ([id, message]) => ({
            id,
            ...(message as Omit<Message, "id">),
          }),
        );

        setMessages(fetchedMessages);

        if (chat.type === "group") {
          const participantIds = Object.keys(chat.participants || {});

          const leftUserIds = fetchedMessages
            .filter(
              (message) =>
                (message.type === "system" && message.action === "left") ||
                (message.action === "admin_changed" && message.userId),
            )
            .map((message) => message.userId!);

          const userIds = [...new Set([...participantIds, ...leftUserIds])];

          const usersEntries = await Promise.all(
            userIds.map(async (userId) => {
              const userSnapshot = await get(ref(database, `users/${userId}`));

              if (!userSnapshot.exists()) {
                return null;
              }

              return [
                userId,
                {
                  uid: userId,
                  ...userSnapshot.val(),
                },
              ] as const;
            }),
          );

          const usersMap: Record<string, UserProfile> = {};

          usersEntries.forEach((entry) => {
            if (!entry) return;

            const [userId, user] = entry;

            usersMap[userId] = user;
          });

          setChatUsers(usersMap);
        } else {
          setChatUsers({});
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
      }
    };

    loadChat();

    const unsubscribe = listenToMessages(chatId, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !currentUser?.uid) {
      return;
    }

    const unsubscribe = listenToTyping(chatId, (users) => {
      setTypingUsers(users.filter((userId) => userId !== currentUser.uid));
    });

    return () => {
      unsubscribe();
    };
  }, [chatId, currentUser?.uid]);

  useEffect(() => {
    if (!chatId || !currentUser?.uid || messages.length === 0) {
      return;
    }

    markMessagesAsSeen(chatId, currentUser.uid).catch((error) => {
      console.error("Failed to mark messages as seen:", error);
    });
  }, [chatId, currentUser?.uid, messages]);

  useEffect(() => {
    if (!chatId || messages.length === 0) return;

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    });
  }, [chatId, messages.length]);

  if (!selectedChat || !chatId) {
    return <NoChatSelectedState />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col mb-3 overflow-hidden scroll-smooth rounded-[2.5rem]  border border-zinc-200/80 bg-white/30 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 dark:shadow-none">
      <ChatWindowHeader
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        isGroupChat={isGroupChat}
        currentUserId={currentUser?.uid ?? ""}
        messages={messages}
        chatId={chatId}
        handleLeaveChat={handleLeaveChat}
      />

      <div className="chat-scroll flex-1 min-h-0 overflow-y-auto p-5 space-y-3.5">
        <MessageBubble
          messages={messages}
          chatId={chatId}
          chatUsers={chatUsers}
          isGroupChat={isGroupChat}
          onReply={(message) => {
            const senderName =
              message.senderId === currentUser?.uid
                ? "You"
                : chatUsers[message.senderId]?.name ||
                  selectedUser?.name ||
                  "Unknown User";

            setReplyingTo({
              messageId: message.id,
              senderId: message.senderId,
              senderName,
              type: message.type as "text" | "image",
              text: message.text,
              imageUrl: message.imageUrl,
            });
          }}
        />
        <div ref={messagesEndRef} />
      {isSomeoneTyping && (
        <div className="mt-2 flex items-end gap-2.5">
          <div className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md border border-zinc-200/80 bg-white/90 px-3.5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s] dark:bg-zinc-500" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s] dark:bg-zinc-500" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        </div>
      )}
      </div>
      <MessageComposer
        chatId={chatId}
        currentUserId={currentUser?.uid as string}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
}
