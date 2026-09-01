import { database } from "@/lib/firebaseConfig";
import { UserProfile } from "@/types/userProfile";
import { User } from "firebase/auth";
import { ref, get, set } from "firebase/database";

export const ensureUserProfile = async (user: User) => {
  const userRef = ref(database, `users/${user.uid}`);

  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    console.log("User profile already exists:", user.uid);
    return;
  }

  await set(userRef, {
    name: user.displayName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    photoURL: user.photoURL || "",
    createdAt: Date.now(),
  });
  console.log("User profile created successfully:", user.uid);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersRef = ref(database, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([uid, user]) => ({
    uid,
    ...(user as Omit<UserProfile, "uid">),
  }));
};
