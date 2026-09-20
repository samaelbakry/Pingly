import { Dispatch, SetStateAction } from "react";
import { UserProfile } from "./userProfile";
import { ChatItem } from "./chatType";
import { Message } from "./messages";

export type SidebarChatsProps = {
  selectedUserId: string | null;
  setSelectedUser: (user: UserProfile | null) => void;
  setSelectedUserId: (userId: string | null) => void;
  selectedUser: UserProfile | null;
  setChatId: (chatId: string | null) => void;
  setIsGroupChat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowArchived: Dispatch<SetStateAction<boolean>>;
  showArchived: boolean;
};

export type chatWindowProps = {
  selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
  messages: Message[];
  chatId: string;
  currentUserId: string;
};
