import { database } from "@/lib/firebaseConfig";
import {
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";

export function setTyping(
  chatId: string,
  userId: string,
  isTyping: boolean,
) {
  const typingRef = ref(
    database,
    `typing/${chatId}/${userId}`,
  );

  if (isTyping) {
    return set(typingRef, true);
  }

  return remove(typingRef);
}

export function listenToTyping(
  chatId: string,
  callback: (typingUsers: string[]) => void,
) {
  const typingRef = ref(
    database,
    `typing/${chatId}`,
  );

  return onValue(typingRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const typingData = snapshot.val() as Record<
      string,
      boolean
    >;

    const typingUsers = Object.entries(typingData)
      .filter(([, isTyping]) => isTyping === true)
      .map(([userId]) => userId);

    callback(typingUsers);
  });
}