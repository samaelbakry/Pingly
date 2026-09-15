import { database } from "@/lib/firebaseConfig"
import { ChatItem } from "@/types/chatType"
import { UserProfile } from "@/types/userProfile"
import { get, ref, remove, set } from "firebase/database"

export function getChatId(userOne: string, userTwo: string) {
    return [userOne, userTwo].sort().join("_")
}

export async function createChat(currentUserID: string, otherUserID: string) {

    const chatID = getChatId(currentUserID, otherUserID)

    const chatRef = ref(database , `chats/${chatID}`)

    const snapshot = await get(chatRef);

    if(!snapshot.exists()){

        await set(chatRef , {
            participants:{
                [currentUserID]:true,
                [otherUserID]:true,
            },
             createdAt: Date.now(),
        })
        
    }

    return chatID
}

export async function getUserChats(currentUserId: string) {
  const chatsRef = ref(database, "chats");
  const archiveRef = ref(database , `users/${currentUserId}/archivedChats`)

  const [chatsSnapshots , archivedSnapshot] = await Promise.all([
    get(chatsRef),
    get(archiveRef)
  ])

  const chatsData = chatsSnapshots.val() 
  const archivedChats = archivedSnapshot.exists() ? archivedSnapshot.val() : {}


   return Object.entries(chatsData)
    .filter(([chatId, chat]) => {
      const participants = (chat as ChatItem).participants;

      return (
        participants?.[currentUserId] === true &&
        !archivedChats[chatId]
      );
    })
    .map(([chatId, chat]) => ({
      chatId,
      ...(chat as object),
    }));
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const userRef = ref(database, `users/${userId}`);

  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    uid: userId,
    ...(snapshot.val() as Omit<UserProfile, "uid">),
  };
}

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