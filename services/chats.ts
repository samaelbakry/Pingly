import { database } from "@/lib/firebaseConfig";
import { ChatItem } from "@/types/chatType";
import {
  get,
  onValue,
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

export function listenToUserChats( currentUserId: string, showArchived: boolean, callback: (chats: ChatItem[]) => void,) {
  let chatsData: Record<string, unknown> | null = null;
  let archivedData: Record<string, boolean> | null = null;

  const publishChats = () => {
    if (chatsData === null || archivedData === null) return;

    const chats = Object.entries(chatsData)
      .filter(([chatId, value]) => {
        const chat = value as ChatItem;

        const isParticipant =
          chat.participants?.[currentUserId] === true;

        const isArchived = archivedData![chatId] === true;

        return (
          isParticipant &&
          (showArchived ? isArchived : !isArchived)
        );
      })
      .map(([chatId, value]) => ({
        ...(value as Omit<ChatItem, "chatId">),
        chatId,
      }));

    callback(chats);
  };

  const unsubscribeChats = onValue(
    ref(database, "chats"),
    (snapshot) => {
      chatsData = snapshot.exists()
        ? (snapshot.val() as Record<string, unknown>)
        : {};

      publishChats();
    },
    (error) => {
      console.error("Failed to listen to chats:", error);
    },
  );

  const unsubscribeArchived = onValue(
    ref(database, `users/${currentUserId}/archivedChats`),
    (snapshot) => {
      archivedData = snapshot.exists()
        ? (snapshot.val() as Record<string, boolean>)
        : {};

      publishChats();
    },
    (error) => {
      console.error("Failed to listen to archived chats:", error);
    },
  );

  return () => {
    unsubscribeChats();
    unsubscribeArchived();
  };
}