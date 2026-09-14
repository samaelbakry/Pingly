export type MessageType = "text" | "image";

export type Message = {
  id: string;
  senderId: string;
  type: MessageType;
  text: string;
  imageUrl?: string;
  createdAt: number;
}