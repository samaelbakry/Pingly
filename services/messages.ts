import {
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  update
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
  const messagesRef = ref(
    database,
    `chats/${chatId}/messages`,
  );

  const newMessageRef = push(messagesRef);

  const messageData = {
    senderId,
    type: data.type,
    text: data.text ?? "",
    imageUrl: data.imageUrl ?? "",
    ...(data.replyTo && {replyTo: data.replyTo}),
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
    console.log("RAW SNAPSHOT", data)

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

export async function deleteMsg(chatId:string , messageId:string){

  const messageRef = ref(database , `chats/${chatId}/messages/${messageId}`)

  await remove(messageRef)
}