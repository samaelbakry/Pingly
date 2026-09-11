import { onValue, ref } from "firebase/database";
import { database } from "@/lib/firebaseConfig";
import { Message } from "@/types/messages";

export function listenToAllUserMessages( chatIds: string[], currentUserId: string, callback: (message: Message, chatId: string) => void) {
  const unsubscribes = chatIds.map((chatId) => {
    const messagesRef = ref(
      database,
      `chats/${chatId}/messages`,
    );

    let initialLoad = true;

    return onValue(messagesRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const data = snapshot.val();

      const messages: Message[] = Object.entries(data).map(
        ([id, message]) => ({
          id,
          ...(message as Omit<Message, "id">),
        }),
      );

      messages.sort(
        (a, b) => a.createdAt - b.createdAt,
      );

      if (initialLoad) {
        initialLoad = false;
        return;
      }

      const latestMessage = messages[messages.length - 1];

      if (
        latestMessage &&
        latestMessage.senderId !== currentUserId
      ) {
        callback(latestMessage, chatId);
      }
    });
  });

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}