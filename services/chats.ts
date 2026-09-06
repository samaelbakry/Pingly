import { database } from "@/lib/firebaseConfig"
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