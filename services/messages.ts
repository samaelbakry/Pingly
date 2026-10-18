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
import { getReadReceiptsEnabled } from "./privacy";

export type UnreadMessagesSnapshot = {
  chatId: string;
  firstUnreadMessageId: string;
  count: number;
};

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

// export async function markMessagesAsSeen(
//   chatId: string,
//   currentUserId: string,
// ) {
//   const [messagesSnapshot, chatTypeSnapshot] = await Promise.all([
//     get(ref(database, `chats/${chatId}/messages`)),
//     get(ref(database, `chats/${chatId}/type`)),
//   ]);

//   const isGroupChat = chatTypeSnapshot.val() === "group";

//   const updates: Record<string, boolean | number> = {
//     [`chats/${chatId}/unreadCounts/${currentUserId}`]: 0,
//   };

//   const readReceiptsEnabled = await getReadReceiptsEnabled(currentUserId);

//   if (isGroupChat || readReceiptsEnabled) {
//     if (messagesSnapshot.exists()) {
//       const messagesData = messagesSnapshot.val();

//       Object.entries(messagesData).forEach(([messageId, rawMessage]) => {
//         const messageData = rawMessage as Message;

//         if (messageData.senderId !== currentUserId && messageData.seen !== true) {
//           updates[
//             `chats/${chatId}/messages/${messageId}/seen`
//           ] = true;
//         }
//       });
//     }

//     const lastMessageSnapshot = await get(
//       ref(database, `chats/${chatId}/lastMessage`),
//     );

//     if (lastMessageSnapshot.exists()) {
//       const lastMessage = lastMessageSnapshot.val() as Message;

//       if (
//         lastMessage.senderId !== currentUserId &&
//         lastMessage.seen !== true
//       ) {
//         updates[`chats/${chatId}/lastMessage/seen`] = true;
//       }
//     }
//   }

//   await update(ref(database), updates);
// }


export async function markMessagesAsSeen(
  chatId: string,
  currentUserId: string,
): Promise<UnreadMessagesSnapshot | null> {
  const [
    messagesSnapshot,
    chatTypeSnapshot,
    unreadCountSnapshot,
    readReceiptsEnabled,
  ] = await Promise.all([
    get(ref(database, `chats/${chatId}/messages`)),
    get(ref(database, `chats/${chatId}/type`)),
    get(ref(database, `chats/${chatId}/unreadCounts/${currentUserId}`)),
    getReadReceiptsEnabled(currentUserId),
  ]);

  const isGroupChat = chatTypeSnapshot.val() === "group";

  const messagesData = messagesSnapshot.val() as
    | Record<string, Message>
    | null;

  const incomingMessages = Object.entries(messagesData ?? {})
    .map(([messageId, message]) => ({
      ...message,
      id: message.id || messageId,
    }))
    .filter(
      (message) =>
        message.type !== "system" &&
        message.senderId !== currentUserId,
    )
    .sort((a, b) => a.createdAt - b.createdAt);

  const unreadCountExists = unreadCountSnapshot.exists();

  const storedUnreadCount = Math.max(0,
    Math.floor(Number(unreadCountSnapshot.val()) || 0),
  );

  const unreadMessages = unreadCountExists
    ? incomingMessages.slice(-storedUnreadCount)
    : incomingMessages.filter((message) => message.seen !== true);

  const unreadSnapshot: UnreadMessagesSnapshot | null =
    unreadMessages.length > 0
      ? {
          chatId,
          firstUnreadMessageId: unreadMessages[0].id,
          count: unreadMessages.length,
        }
      : null;

  const updates: Record<string, boolean | number> = {
    [`chats/${chatId}/unreadCounts/${currentUserId}`]: 0,
  };

  if (isGroupChat || readReceiptsEnabled) {
    Object.entries(messagesData ?? {}).forEach(
      ([messageId, messageData]) => {
        if (
          messageData.type !== "system" &&
          messageData.senderId !== currentUserId &&
          messageData.seen !== true
        ) {
          updates[
            `chats/${chatId}/messages/${messageId}/seen`
          ] = true;
        }
      },
    );

    const lastMessageSnapshot = await get(
      ref(database, `chats/${chatId}/lastMessage`),
    );

    if (lastMessageSnapshot.exists()) {
      const lastMessage = lastMessageSnapshot.val() as Message;

      if (
        lastMessage.type !== "system" &&
        lastMessage.senderId !== currentUserId &&
        lastMessage.seen !== true
      ) {
        updates[`chats/${chatId}/lastMessage/seen`] = true;
      }
    }
  }

  await update(ref(database), updates);

  return unreadSnapshot;
}
