export type MessageType = "text" | "image" | "system";

export type SystemAction = "left";

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;

  action?: SystemAction;
  userId?: string;

  createdAt: number;
}