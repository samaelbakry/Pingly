import {
  onValue,
  push,
  ref,
  remove,
  get,
  serverTimestamp,
  update,
  runTransaction,
} from "firebase/database";

import { database } from "@/lib/firebaseConfig";
import { Message, ReplyTo } from "@/types/messages";

async function assertCanSendMessage(chatId: string, senderId: string) {
  
  const chatSnapshot = await get(
    ref(database, `chats/${chatId}`),
  );

  if (!chatSnapshot.exists()) {
    throw new Error("Chat not found");
  }

  const chat = chatSnapshot.val() as {
    type?: string;
    participants?: Record<string, boolean>;
  };

  if (chat.participants?.[senderId] !== true) {
    throw new Error("You are not a member of this chat");
  }

  if (chat.type === "group") return;

  const otherUserIds = Object.keys(chat.participants ?? {}).filter(
    (userId) =>
      userId !== senderId &&
      chat.participants?.[userId] === true,
  );

  const blockedChecks = await Promise.all(
    otherUserIds.map(async (targetUserId) => {
      const [myBlock, theirBlock] = await Promise.all([
        get(
          ref(
            database,
            `users/${senderId}/blockedUsers/${targetUserId}`,
          ),
        ),
        get(
          ref(
            database,
            `users/${targetUserId}/blockedUsers/${senderId}`,
          ),
        ),
      ]);

      return myBlock.val() === true || theirBlock.val() === true;
    }),
  );

  if (blockedChecks.some(Boolean)) {
    throw new Error("You cannot message a blocked contact");
  }
}

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

  await assertCanSendMessage(chatId, senderId);

  const messagesRef = ref(database, `chats/${chatId}/messages`);

  const newMessageRef = push(messagesRef);

  const participantsSnapshot = await get(
  ref(database, `chats/${chatId}/participants`),
);

const participants = participantsSnapshot.exists()
  ? (participantsSnapshot.val() as Record<string, boolean>)
  : {};

const recipientIds = Object.keys(participants).filter(
  (userId) =>
    userId !== senderId && participants[userId] === true,
);

await Promise.all(
  recipientIds.map((recipientId) =>
    runTransaction(
      ref(
        database,
        `chats/${chatId}/unreadCounts/${recipientId}`,
      ),
      (currentCount) => (Number(currentCount) || 0) + 1,
    ),
  ),
);

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

  const updates: Record<string, boolean | number> = {
  [`chats/${chatId}/unreadCounts/${currentUserId}`]: 0,
};

 const lastMessageSnapshot = await get(
  ref(database, `chats/${chatId}/lastMessage`),
);

if (lastMessageSnapshot.exists()) {
  const lastMessage = lastMessageSnapshot.val();

  if (
    lastMessage.senderId !== currentUserId &&
    lastMessage.seen !== true
  ) {
    updates[`chats/${chatId}/lastMessage/seen`] = true;
  }
}

if (Object.keys(updates).length > 0) {
  await update(ref(database), updates);
}
}
