export type MessageType = "text" | "image" | "system";

export type SystemAction = "left" | "admin_changed";

export type ReactionEmoji =
  | "❤️"
  | "😂"
  | "👍"
  | "😮"
  | "😢"
  | "🔥";

export type MessageReactions = Record<string, ReactionEmoji>;

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  action?: SystemAction;
  userId?: string;
  createdAt: number;
  reactions?: MessageReactions;
}