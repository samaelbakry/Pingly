import { ChatItem } from "./chatType";
import { Message } from "./messages";
import { UserProfile } from "./userProfile";

export type chatWindowProps = {
  selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
  messages: Message[];
  chatId: string;
  currentUserId: string;
  handleLeaveChat: () => void;
};

export type ChatListCardProps = {
  chat: ChatItem;
  chatUsers: Record<string, UserProfile>;
  selectedChatId?: string | null;

  handleSelectChat: (currentUserID: string, user: UserProfile) => Promise<void>;

  handleSelectGroup: (chatId: string) => void;

  showArchived: boolean;
  onUnarchive: (chatId: string) => Promise<void>;
};
