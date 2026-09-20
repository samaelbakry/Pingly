import { database } from "@/lib/firebaseConfig";
import { ref, remove } from "firebase/database";

export async function leaveGroupChat(userId:string, chatId:string) {
    
    const participantRef = ref(database , `chats/${chatId}/participants/${userId}`)
    
    await remove(participantRef)
}