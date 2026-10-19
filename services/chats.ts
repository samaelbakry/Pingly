import { database } from "@/lib/firebaseConfig";
import { ChatItem } from "@/types/chatType";
import { get, onValue, push, ref, set, update } from "firebase/database";

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
  if (!currentUserId) return [];

  const [chatsSnapshot, archivedSnapshot, deletedSnapshot] = await Promise.all([
    get(ref(database, "chats")),
    get(ref(database, `users/${currentUserId}/archivedChats`)),
    get(ref(database, `users/${currentUserId}/deletedChats`)),
  ]);

  const chatsData = chatsSnapshot.val() ?? {};
  const archivedChats = archivedSnapshot.val() ?? {};
  const deletedChats = deletedSnapshot.val() ?? {};

  return Object.entries(chatsData)
    .filter(([chatId, value]) => {
      const chat = value as ChatItem;

      const isParticipant = chat.participants?.[currentUserId] === true;

      const isArchived = archivedChats[chatId] === true;

      const deletedAt = Number(deletedChats[chatId] ?? 0);
      const lastMessageAt = Number(
        chat.lastMessage?.createdAt ?? chat.createdAt ?? 0,
      );

      const hasNewMessageAfterDeletion =
        !deletedAt || lastMessageAt > deletedAt;

      return isParticipant && !isArchived && hasNewMessageAfterDeletion;
    })
    .map(([chatId, value]) => ({
      chatId,
      ...(value as Omit<ChatItem, "chatId">),
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

export function listenToUserChats(
  currentUserId: string,
  showArchived: boolean,
  callback: (chats: ChatItem[]) => void,
) {
  let chatsData: Record<string, unknown> | null = null;
  let archivedData: Record<string, boolean> | null = null;
  let deletedData: Record<string, number> | null = null;

  const publishChats = () => {
    if (chatsData === null || archivedData === null || deletedData === null) {
      return;
    }

    const chats = Object.entries(chatsData)
      .filter(([chatId, value]) => {
        const chat = value as ChatItem;

        const isParticipant = chat.participants?.[currentUserId] === true;

        const isArchived = archivedData![chatId] === true;
        const deletedAt = Number(deletedData![chatId] ?? 0);

        const lastMessageAt = Number(
          chat.lastMessage?.createdAt ?? chat.createdAt ?? 0,
        );

        const hasNewMessageAfterDeletion =
          !deletedAt || lastMessageAt > deletedAt;

        return (
          isParticipant &&
          isArchived === showArchived &&
          hasNewMessageAfterDeletion
        );
      })
      .map(([chatId, value]) => ({
        ...(value as Omit<ChatItem, "chatId">),
        chatId,
      }));

    chats.sort((a, b) => {
      const aTime = Number(a.lastMessage?.createdAt ?? a.createdAt ?? 0);
      const bTime = Number(b.lastMessage?.createdAt ?? b.createdAt ?? 0);

      return bTime - aTime;
    });

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

  const unsubscribeDeleted = onValue(
    ref(database, `users/${currentUserId}/deletedChats`),
    (snapshot) => {
      deletedData = snapshot.exists()
        ? (snapshot.val() as Record<string, number>)
        : {};

      publishChats();
    },
    (error) => {
      console.error("Failed to listen to deleted chats:", error);
    },
  );

  return () => {
    unsubscribeChats();
    unsubscribeArchived();
    unsubscribeDeleted();
  };
}

export async function deleteChatForMe(currentUserId: string, chatId: string) {
  if (!currentUserId || !chatId) {
    throw new Error("Missing user or chat ID");
  }

  const participantSnapshot = await get(
    ref(database, `chats/${chatId}/participants/${currentUserId}`),
  );

  if (participantSnapshot.val() !== true) {
    throw new Error("You are not a member of this chat");
  }

  await update(ref(database), {
    [`users/${currentUserId}/deletedChats/${chatId}`]: Date.now(),
    [`users/${currentUserId}/archivedChats/${chatId}`]: null,
    [`chats/${chatId}/unreadCounts/${currentUserId}`]: 0,
  });
}
