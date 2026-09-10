export interface ChatParticipants {
  [userId: string]: boolean;
}

export interface ChatMessages {
  [messageId: string]: unknown;
}

export interface ChatItem {
  chatId: string;
  createdAt: number;
  participants: ChatParticipants;
  messages?: ChatMessages;
}

export type ChatListResponse = ChatItem[];