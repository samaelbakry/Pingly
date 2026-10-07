import {
  onValue,
  push,
  ref,
  remove,
  get,
  serverTimestamp,
  update,
} from "firebase/database";

import { database } from "@/lib/firebaseConfig";
import { Message, ReplyTo } from "@/types/messages";

export async function sendMessage(
  chatId: string,
  senderId: string,
  data: {
    type: "text" | "image";
    imageUrl?: string;
    text?: string;
    replyTo?: ReplyTo;
  },
) {
  const messagesRef = ref(database, `chats/${chatId}/messages`);

  const newMessageRef = push(messagesRef);

  const messageData = {
    senderId,
    type: data.type,
    text: data.text ?? "",
    imageUrl: data.imageUrl ?? "",
    seen: false,
    ...(data.replyTo && { replyTo: data.replyTo }),
    createdAt: serverTimestamp(),
  };

  const updates = {
    [`chats/${chatId}/messages/${newMessageRef.key}`]: messageData,
    [`chats/${chatId}/lastMessage`]: messageData,
  };

  await update(ref(database), updates);

  return newMessageRef.key;
}

export function listenToMessages(
  chatId: string,
  callback: (messages: Message[]) => void,
) {
  const messagesRef = ref(database, `chats/${chatId}/messages`);

  return onValue(messagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();
    console.log("RAW SNAPSHOT", data);

    const messages: Message[] = Object.entries(data).map(([id, message]) => {
      const messageData = message as Omit<Message, "id">;

      return {
        id,
        ...messageData,
        seen: messageData.seen ?? false,
      };
    });

    messages.sort((a, b) => a.createdAt - b.createdAt);

    callback(messages);
  });
}

export async function deleteMsg(chatId: string, messageId: string) {
  const messageRef = ref(database, `chats/${chatId}/messages/${messageId}`);

  await remove(messageRef);
}

export async function markMessagesAsSeen(
  chatId: string,
  currentUserId: string,
) {
  const messageRef = ref(database, `chats/${chatId}/messages`);

  const snapshot = await get(messageRef);

  if (!snapshot.exists()) return;

  const data = snapshot.val();

  const updates: Record<string, boolean> = {};

  Object.entries(data).forEach(([message, messageId]) => {
    const messageData = message as unknown as Message;

    if (messageData.senderId !== currentUserId && messageData.seen === false) {
      updates[`chats/${chatId}/messages/${messageId}/seen`] = true;
    }
  });

  if (Object.entries(updates).length > 0) {
    await update(ref(database), updates);
  }
}
