import { database } from "@/lib/firebaseConfig";
import { UserProfile } from "@/types/userProfile";
import { ref, update } from "firebase/database";

export async function updateUserProfile(
  userID: string,
  data:Partial<UserProfile>,
) {
  const userRef = ref(database, `users/${userID}`);

  await update(userRef, data);
}
