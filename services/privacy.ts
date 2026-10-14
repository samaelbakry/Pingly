import { get, onValue, ref, set } from "firebase/database";

import { database } from "@/lib/firebaseConfig";

function readReceiptsRef(userId: string) {
  return ref(database, `users/${userId}/privacy/readReceipts`);
}

export async function getReadReceiptsEnabled(
  userId: string,
): Promise<boolean> {
  const snapshot = await get(readReceiptsRef(userId));

  return snapshot.exists() ? snapshot.val() !== false : true;
}

export function listenToReadReceipts(
  userId: string,
  callback: (enabled: boolean) => void,
) {
  return onValue(
   readReceiptsRef(userId),
    (snapshot) => {
      callback(
        snapshot.exists() ? snapshot.val() !== false : true,
      );
    },
  );
}

export async function updateReadReceipts(
  userId: string,
  enabled: boolean,
) {
  await set(readReceiptsRef(userId), enabled)
}

export type PrivacyVisibilityT = "everyone" | "nobody";

export type PrivacySettingKey = "lastSeen" | "profilePhoto";

export type UserPrivacySettings = {
  lastSeen: PrivacyVisibilityT;
  profilePhoto: PrivacyVisibilityT;
  readReceipts: boolean;
};

export const DEFAULT_USER_PRIVACY_SETTINGS: UserPrivacySettings = {
  lastSeen: "everyone",
  profilePhoto: "everyone",
  readReceipts: true,
};

function normalizePrivacySettings( data: Record<string, unknown> | null): UserPrivacySettings {
  return {
    lastSeen:data?.lastSeen === "nobody" ? "nobody" : "everyone",
    profilePhoto: data?.profilePhoto === "nobody"? "nobody" : "everyone",

    readReceipts: data?.readReceipts !== false,
  };
}

export function listenToUserPrivacySettings(userId: string, callback: (settings: UserPrivacySettings) => void, onError?: (error: Error) => void,
) {
  return onValue(
    ref(database, `users/${userId}/privacy`),
    (snapshot) => {
      const data = snapshot.exists()
        ? (snapshot.val() as Record<string, unknown>)
        : null;

      callback(normalizePrivacySettings(data));
    },
    (error) => {
      console.error("Failed to load privacy settings:", error);
      onError?.(error);
    },
  );
}

export async function updatePrivacyVisibility(
  userId: string,
  key: PrivacySettingKey,
  value: PrivacyVisibilityT,
) {
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  await set(
    ref(database, `users/${userId}/privacy/${key}`),
    value,
  );
}

