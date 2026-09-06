import {
  onValue,
  push,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";

import { database } from "@/lib/firebaseConfig";
import { Message } from "@/types/messages";

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string
) {
  const messagesRef = ref(
    database,
    `chats/${chatId}/messages`
  );

  const newMessageRef = push(messagesRef);

  await set(newMessageRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });

  return newMessageRef.key;
}

export function listenToMessages(
  chatId: string,
  callback: (messages: Message[]) => void
) {
  const messagesRef = ref(
    database,
    `chats/${chatId}/messages`
  );

  return onValue(messagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();

    const messages: Message[] = Object.entries(data).map(
      ([id, message]) => ({
        id,
        ...(message as Omit<Message, "id">),
      })
    );

    messages.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    callback(messages);
  });
}