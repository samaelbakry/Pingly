import { database } from "@/lib/firebaseConfig";
import { ReactionEmoji } from "@/types/messages";
import { ref, remove, set } from "firebase/database";

export async function addReaction(
  chatId: string,
  messageId: string,
  userId: string,
  emoji: ReactionEmoji,
) {
  if (!chatId || !messageId || !userId || !emoji) {
    throw new Error("Missing reaction data");
  }

  const reactionRef = ref(database, `chats/${chatId}/messages/${messageId}/reactions/${userId}`)

  await set(reactionRef , emoji)
}
export async function removeReaction(
  chatId: string,
  messageId: string,
  userId: string,
) {
  if (!chatId || !messageId || !userId) {
    throw new Error("Missing reaction data");
  }

  const reactionRef = ref(database, `chats/${chatId}/messages/${messageId}/reactions/${userId}`)

  await remove(reactionRef)
}

