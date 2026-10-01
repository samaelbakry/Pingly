import { database } from "@/lib/firebaseConfig";
import { ref, update } from "firebase/database";

export async function updateUserProfile(
  userID: string,
  data: { name?: string; phoneNumber?: string; photoURL?: string },
) {
  const userRef = ref(database, `users/${userID}`);

  await update(userRef, data);
}
