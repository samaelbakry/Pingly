import { database } from "@/lib/firebaseConfig";
import { ChatItem } from "@/types/chatType";
import { get, ref, remove, set } from "firebase/database";

export async function leaveGroupChat(userId: string, chatId: string) {
  const participantRef = ref(
    database,
    `chats/${chatId}/participants/${userId}`,
  );

  await remove(participantRef);
}

export async function addGroupMember(
  creatorId: string,
  chatId: string,
  memberId: string,
) {
  const chatRef = ref(database, `chats/${chatId}`);

  const snapshot = await get(chatRef);

  if (!snapshot.exists()) {
    throw new Error("Group not found");
  }

  const chat = snapshot.val() as ChatItem;

  if (chat.type !== "group") {
    throw new Error("This chat is not a group");
  }
  if (chat.createdBy !== creatorId) {
    throw new Error("Only the group creator can add members");
  }
  if (chat.participants?.[memberId]) {
    throw new Error("User is already a group member");
  }

  await set(ref(database, `chats/${chatId}/participants/${memberId}`), true);
}
