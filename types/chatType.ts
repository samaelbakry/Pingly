export type ChatParticipants = {
  [userId: string]: boolean;
}

export type ChatMessages = {
  [messageId: string]: unknown;
}

export type ChatType = "direct" | "group";

export type ChatItem ={
  chatId: string;
  type: ChatType;

  name?: string;
  photoURL?: string;
  createdBy?: string;

  createdAt: number;

  participants: Record<string, boolean>;
}

export type ChatListResponse = ChatItem[];