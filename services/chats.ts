import { database } from "@/lib/firebaseConfig"
import { ChatItem } from "@/types/chatType"
import { UserProfile } from "@/types/userProfile"
import { get, ref, set } from "firebase/database"

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

  const snapshot = await get(chatsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data)
    .filter(([_, chat]) => {
      const participants = (chat as ChatItem).participants;

      return participants?.[currentUserId] === true;
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