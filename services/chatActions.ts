import { database } from "@/lib/firebaseConfig"
import { ChatItem } from "@/types/chatType"
import { get, ref, remove, set } from "firebase/database"

export async function clearChat(chatId:string) {
  
  const chatRef = ref(database , `chats/${chatId}`)

  await remove(chatRef)
}

export async function archiveChat(userId:string , chatId:string) {
  
  const archiveRef = ref(database , `users/${userId}/archivedChats/${chatId}`)

  await set(archiveRef , true)
}

export async function getArchivedChats(userId: string) {
  const chatsRef = ref(database, "chats");
  const archivedChatsRef = ref(
    database,
    `users/${userId}/archivedChats`
  );

  const [chatsSnapshot, archivedSnapshot] = await Promise.all([
    get(chatsRef),
    get(archivedChatsRef),
  ]);

  if (!chatsSnapshot.exists() || !archivedSnapshot.exists()) {
    return [];
  }

  const chatsData = chatsSnapshot.val();
  const archivedChats = archivedSnapshot.val();

  return Object.entries(chatsData)
    .filter(([chatId, chat]) => {
      const participants = (chat as ChatItem).participants;

      return (
        participants?.[userId] === true &&
        archivedChats[chatId] === true
      );
    })
    .map(([chatId, chat]) => ({
      chatId,
      ...(chat as object),
    }));
}

export async function unarchiveChat(userId:string , chatId:string) {
    const archiveRef = ref(database , `users/${userId}/archivedChats/${chatId}`)

    await remove(archiveRef)
}