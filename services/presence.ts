import { database } from "@/lib/firebaseConfig";
import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";

export function setUserOnline(userId: string) {
  const presenceRef = ref(database, `users/${userId}/presence`);
  const connectedRef = ref(database, ".info/connected");

  const unsubscribe = onValue(connectedRef, async (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }

    await onDisconnect(presenceRef).set({
      state: "offline",
      lastSeen: serverTimestamp(),
    });

    await set(presenceRef, {
      state: "online",
      lastSeen: serverTimestamp(),
    });
  });

  return unsubscribe;
}

export function listenToUserPresence(
  userId: string,
  callback: (
    presence: {
      state: "online" | "offline";
      lastSeen?: number;
    } | null,
  ) => void,
) {
  const presenceRef = ref(database, `users/${userId}/presence`);

  return onValue(presenceRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(snapshot.val());
  });
}