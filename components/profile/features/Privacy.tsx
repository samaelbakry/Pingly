"use client";

import { useEffect, useState } from "react";
import { Ban, LoaderCircle, ShieldCheck, UserRound } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { unblockUser, listenToBlockedUsers } from "@/services/block";
import type { BlockedUserProfile } from "@/services/block";

export default function Privacy() {
  const { user: currentUser } = useAuth();

  const [blockedUsers, setBlockedUsers] = useState<BlockedUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    try {
      const unsubscribe = listenToBlockedUsers(currentUser.uid, (users) => {
        setBlockedUsers(users);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.log(error, "privacy error");
    }
  }, [currentUser?.uid]);

  const handleUnblock = async (targetUserId: string) => {
    if (!currentUser?.uid || unblockingId) return;

    setUnblockingId(targetUserId);
    setError("");

    try {
      await unblockUser(currentUser.uid, targetUserId);
    } catch (err) {
      console.error("Failed to unblock user:", err);
      setError("Couldn't unblock this user. Please try again.");
    } finally {
      setUnblockingId(null);
    }
  };

  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="flex items-center gap-4 border-b border-zinc-200/70 pb-5 dark:border-zinc-800 mb-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-500/5 text-orange-500 ring-1 ring-orange-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Privacy
            </h2>
            <p className="mt-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Manage your blocked contacts.
            </p>
          </div>
        </header>

        <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/40  animate-in fade-in-50 slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 px-5 py-4 dark:border-zinc-800 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <Ban className="h-4 w-4" />
              </div>
              <h3 className="truncate text-base font-bold text-zinc-900 dark:text-white">
                Blocked users
              </h3>
            </div>

            <span className="shrink-0 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              {blockedUsers.length}{" "}
              {blockedUsers.length === 1 ? "contact" : "contacts"}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-14">
              <LoaderCircle className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : blockedUsers.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-orange-100 to-orange-50 text-orange-500 dark:from-orange-500/15 dark:to-orange-500/5">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <p className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                No blocked users
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                People you block will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200/70 dark:divide-zinc-800">
              {blockedUsers.map((blockedUser) => (
                <li
                  key={blockedUser.uid}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-orange-50/40 dark:hover:bg-zinc-800/40 sm:px-6"
                >
                  {blockedUser.photoURL ? (
                    <img
                      src={blockedUser.photoURL}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-2 ring-white dark:bg-orange-500/10 dark:text-orange-400 dark:ring-zinc-900">
                      <UserRound className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-zinc-800 dark:text-zinc-100">
                      {blockedUser.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                      <Ban className="h-3 w-3" />
                      Blocked contact
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnblock(blockedUser.uid)}
                    disabled={unblockingId !== null}
                    className="flex h-9 min-w-22 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:opacity-50 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950"
                  >
                    {unblockingId === blockedUser.uid ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      "Unblock"
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {error && (
            <div className="border-t border-rose-200/70 bg-rose-50/60 px-5 py-3 text-sm font-medium text-rose-500 dark:border-rose-900/50 dark:bg-rose-950/20 sm:px-6">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
