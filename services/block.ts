import { get, onValue, ref, remove, set } from "firebase/database";

import { database } from "@/lib/firebaseConfig";

export type BlockStatus =
  | "loading"
  | "none"
  | "blocked-by-me"
  | "blocked-me"
  | "both";

export type BlockedUserProfile = {
  uid: string;
  name: string;
  photoURL: string;
};

export async function blockUser(currentUserId: string, targetUserId: string) {
  if (!currentUserId || !targetUserId) {
    throw new Error("User IDs are required");
  }

  if (currentUserId === targetUserId) {
    throw new Error("You cannot block yourself");
  }

  await set(
    ref(database, `users/${currentUserId}/blockedUsers/${targetUserId}`),
    true,
  );
}

export async function unblockUser(currentUserId: string, targetUserId: string) {
  if (!currentUserId || !targetUserId) {
    throw new Error("User IDs are required");
  }

  await remove(
    ref(database, `users/${currentUserId}/blockedUsers/${targetUserId}`),
  );
}

export function listenToBlockStatus(
  currentUserId: string,
  targetUserId: string,
  callback: (status: BlockStatus) => void,
) {
  let iBlocked = false;
  let theyBlocked = false;
  let ownLoaded = false;
  let otherLoaded = false;

  const publishStatus = () => {
    if (!ownLoaded || !otherLoaded) {
      callback("loading");
      return;
    }

    if (iBlocked && theyBlocked) {
      callback("both");
    } else if (iBlocked) {
      callback("blocked-by-me");
    } else if (theyBlocked) {
      callback("blocked-me");
    } else {
      callback("none");
    }
  };

  const ownUnsubscribe = onValue(
    ref(database, `users/${currentUserId}/blockedUsers/${targetUserId}`),
    (snapshot) => {
      iBlocked = snapshot.val() === true;
      ownLoaded = true;
      publishStatus();
    },
  );

  const otherUnsubscribe = onValue(
    ref(database, `users/${targetUserId}/blockedUsers/${currentUserId}`),
    (snapshot) => {
      theyBlocked = snapshot.val() === true;
      otherLoaded = true;
      publishStatus();
    },
  );

  return () => {
    ownUnsubscribe();
    otherUnsubscribe();
  };
}

export function listenToBlockedUsers(
  currentUserId: string,
  callback: (users: BlockedUserProfile[]) => void,
) {
  const blockedUsersRef = ref(database, `users/${currentUserId}/blockedUsers`);

  let requestId = 0;

  return onValue(
    blockedUsersRef,
    (snapshot) => {
      const currentRequestId = ++requestId;

      const loadBlockedUsers = async () => {
        if (!snapshot.exists()) {
          callback([]);
          return;
        }

        const blockedIds = Object.entries(
          snapshot.val() as Record<string, boolean>,
        )
          .filter(([, isBlocked]) => isBlocked === true)
          .map(([userId]) => userId);

        const users = await Promise.all(
          blockedIds.map(async (userId) => {
            const userSnapshot = await get(ref(database, `users/${userId}`));

            const profile = userSnapshot.exists() ? userSnapshot.val() : {};

            return {
              uid: userId,
              name: profile.name || "Unknown User",
              photoURL: profile.photoURL || "",
            };
          }),
        );

        if (currentRequestId === requestId) {
          callback(users);
        }
      };

      loadBlockedUsers().catch((error) => {
        console.error("Failed to load blocked users:", error);
      });
    },
    (error) => {
      console.error("Failed to listen to blocked users:", error);
    },
  );
}
