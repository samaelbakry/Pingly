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

export type ReplyTo  ={
  messageId: string;
  senderId: string;
  type: "text" | "image";
  text?: string;
  senderName?: string;
  imageUrl?: string;
}
export type Message  ={
  id: string;
  senderId: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  action?: SystemAction;
  userId?: string;
  createdAt: number;
  seen?: boolean;
  reactions?: MessageReactions;
  replyTo?: ReplyTo;
}