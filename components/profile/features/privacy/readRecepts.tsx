"use client";
import { useAuth } from "@/context/AuthContext";
import { useReadReceipts } from "@/hooks/privacy/readReceipts/useReadReceipts";
import { CheckCheck, LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ReadRecepts() {
  const { user: currentUser } = useAuth();

  const {
    readReceiptsEnabled,
    loading: readReceiptsLoading,
    saveReadReceipts,
  } = useReadReceipts(currentUser?.uid);

  const [savingReadReceipts, setSavingReadReceipts] = useState(false);

  const handleReadReceiptsChange = async () => {
    if (savingReadReceipts || readReceiptsLoading) return;

    try {
      setSavingReadReceipts(true);

      await saveReadReceipts(!readReceiptsEnabled);

      toast.success(
        !readReceiptsEnabled
          ? "Read receipts enabled"
          : "Read receipts disabled",
      );
    } catch (error) {
      console.error("Failed to update read receipts:", error);
      toast.error("Couldn't update read receipts");
    } finally {
      setSavingReadReceipts(false);
    }
  };

  return (
    <div className="rounded-3xl border mb-2 border-zinc-200/80 bg-white/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
          <CheckCheck className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Read receipts
          </h3>

          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Show blue check marks when messages are read. Turning this off also
            hides read receipts in direct chats.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={readReceiptsEnabled}
          aria-label="Toggle read receipts"
          disabled={readReceiptsLoading || savingReadReceipts}
          onClick={handleReadReceiptsChange}
          className={`
        relative flex h-6 w-11 shrink-0 items-center
        rounded-full p-1 transition-colors duration-200
        disabled:cursor-not-allowed disabled:opacity-60
        cursor-pointer
        ${
          readReceiptsEnabled ? "bg-orange-500" : "bg-zinc-300 dark:bg-zinc-700"
        }
      `}
        >
          {savingReadReceipts || readReceiptsLoading ? (
            <LoaderCircle className="mx-auto h-4 w-4 animate-spin text-white" />
          ) : (
            <span
              className={`
            h-4 w-4 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${readReceiptsEnabled ? "translate-x-5" : "translate-x-0"}
          `}
            />
          )}
        </button>
      </div>
    </div>
  );
}
