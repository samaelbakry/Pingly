"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { UserProfile } from "@/types/userProfile";
import { ChatItem } from "@/types/chatType";

type SelectedChat =
  | {
      type: "user";
      chatId: string;
      user: UserProfile;
    }
  | {
      type: "group";
      chatId: string;
      group: ChatItem;
    }
  | null;

type ChatContextType = {
  selectedChat: SelectedChat;

  selectUserChat: (
    chatId: string,
    user: UserProfile
  ) => void;

  selectGroupChat: (
    chatId: string,
    group: ChatItem
  ) => void;

  clearSelectedChat: () => void;

  isGroupChat: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function ChatProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null);

  const selectUserChat = ( chatId: string, user: UserProfile ) => {
    setSelectedChat({
      type: "user",
      chatId,
      user,
    });
  };

  const selectGroupChat = (chatId: string,group: ChatItem ) => {
    setSelectedChat({
      type: "group",
      chatId,
      group,
    });
  };

  const clearSelectedChat = () => {
    setSelectedChat(null);
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        selectUserChat,
        selectGroupChat,
        clearSelectedChat,
        isGroupChat: selectedChat?.type === "group",
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used inside ChatProvider" );
  }

  return context;
}