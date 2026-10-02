import { database } from "@/lib/firebaseConfig";
import { ChatItem } from "@/types/chatType";
import {
  get,
  push,
  ref,
  set
} from "firebase/database";

export function getChatId(userOne: string, userTwo: string) {
  return [userOne, userTwo].sort().join("_");
}

export async function createChat(currentUserID: string, otherUserID: string) {
  const chatID = getChatId(currentUserID, otherUserID);

  const chatRef = ref(database, `chats/${chatID}`);

  const snapshot = await get(chatRef);

  if (!snapshot.exists()) {
    await set(chatRef, {
      type: "direct",
      participants: {
        [currentUserID]: true,
        [otherUserID]: true,
      },
      createdAt: Date.now(),
    });
  }

  return chatID;
}

export async function getUserChats(currentUserId: string): Promise<ChatItem[]> {
  if (!currentUserId) {
    return [];
  }

  const chatsRef = ref(database, "chats");

  const archiveRef = ref(database, `users/${currentUserId}/archivedChats`);

  const [chatsSnapshot, archivedSnapshot] = await Promise.all([
    get(chatsRef),
    get(archiveRef),
  ]);

  const chatsData = chatsSnapshot.val() ?? {};
  const archivedChats = archivedSnapshot.val() ?? {};

  return Object.entries(chatsData)
    .filter(([chatId, chat]) => {
      const chatData = chat as ChatItem;

      const isParticipant = chatData.participants?.[currentUserId] === true;

      const isArchived = archivedChats[chatId] === true;

      return isParticipant && !isArchived;
    })
    .map(([chatId, chat]) => ({
      chatId,
      ...(chat as Omit<ChatItem, "chatId">),
    }));
}

export async function createGroupChat(
  creatorId: string,
  membersIds: string[],
  groupName: string,
) {
  const chatRef = ref(database, "chats");
  const newChatRef = push(chatRef);

  const participants: Record<string, boolean> = {};

  [creatorId, ...membersIds].forEach((userId) => {
    participants[userId] = true;
  });

  await set(newChatRef, {
    type: "group",
    name: groupName,
    photoUrl: "",
    createdBy: creatorId,
    participants,
    createdAt: Date.now(),
  });

  return newChatRef.key;
}
