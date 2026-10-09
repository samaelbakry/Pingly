
"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { Ban, LoaderCircle, ShieldCheck } from "lucide-react";

import { database } from "@/lib/firebaseConfig";
import { blockUser, unblockUser } from "@/services/block";
import { toast } from "sonner";

type Props = {
  currentUserId: string;
  targetUserId: string;
};

export default function BlockUserButton({
  currentUserId,
  targetUserId,
}: Props) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    const blockedRef = ref(
      database,
      `users/${currentUserId}/blockedUsers/${targetUserId}`,
    );

    const unsubscribe = onValue(
      blockedRef,
      (snapshot) => {
        setIsBlocked(snapshot.val() === true);
        setStatusLoaded(true);
      },
      (error) => {
        console.error("Failed to load block status:", error);
        setStatusLoaded(false);
      },
    );

    return unsubscribe;
  }, [currentUserId, targetUserId]);

  const handleToggleBlock = async () => {
    if (!currentUserId || !targetUserId || loading) return;

    setLoading(true);
    setError("");

    try {
      if (isBlocked) {
        await unblockUser(currentUserId, targetUserId);
        toast.success("You unblocked this person")
      } else {
        await blockUser(currentUserId, targetUserId);
        toast.success("You blocked this person")
      }
    } catch (error) {
      console.error("Failed to update block status:", error);
      setError("Couldn't update block status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={handleToggleBlock}
        disabled={!statusLoaded || loading}
        aria-label={isBlocked ? "Unblock user" : "Block user"}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-full border px-3 py-2
          text-xs font-semibold
          transition-all duration-200
          disabled:cursor-not-allowed disabled:opacity-50

          ${
            isBlocked
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
          }
        `}
      >
        {loading || !statusLoaded ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : isBlocked ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <Ban className="h-4 w-4" />
        )}

        {isBlocked ? "Unblock" : "Block"}
      </button>

      {error && (
        <p className="max-w-40 text-right text-[10px] text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
