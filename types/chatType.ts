export type ChatParticipants = {
  [userId: string]: boolean;
}

export type ChatMessages = {
  [messageId: string]: unknown;
}

export type ChatType = "direct" | "group";


export type ChatListResponse = ChatItem[];

export type LastMessage = {
  senderId: string;
  type: "text" | "image" | "system";
  text?: string;
  imageUrl?: string;
  createdAt: number;
};

export type ChatItem = {
  chatId: string;
  type: ChatType;
  name?: string;
  photoURL?: string;
  createdBy?: string;
  createdAt: number;
  participants: Record<string, boolean>;
  lastMessage?: LastMessage;
};