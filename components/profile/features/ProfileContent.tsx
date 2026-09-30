"use client";

import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/services/users";
import { UserProfile as UserProfileType } from "@/types/userProfile";
import { Mail, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileContent() {
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const user = await getUserById(currentUser.uid);

        setProfile(user);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser?.uid]);

  if (loading) {
    return (
     <LoadingScreen/>
    );
  }

  if (!profile) {
    return (
      <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm text-zinc-400">
          Unable to load profile.
        </p>
      </section>
    );
  }

  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Profile
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            View your account information.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
         
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-xl shadow-orange-500/10 dark:border-zinc-900 dark:bg-orange-950/40">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-12 w-12 text-orange-500" />
              )}
            </div>

            <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
              {profile.name || "Unnamed User"}
            </h2>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {profile.email}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30">
                <UserRound className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Name
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {profile.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500 dark:bg-violet-950/30">
                <Mail className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Email
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {profile.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
                <Phone className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Phone
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {profile.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}