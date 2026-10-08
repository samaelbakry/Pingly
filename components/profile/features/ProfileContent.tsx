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
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm text-zinc-400">Unable to load profile.</p>
      </section>
    );
  }

  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-8 flex items-start gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
          <span className="mt-1 h-10 w-1.5 shrink-0 rounded-full bg-orange-500" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Your profile
            </h1>
            <p className="mt-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              View your account information.
            </p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="h-24 bg-linear-to-br from-orange-400/30 via-orange-300/20 to-orange-100/10 dark:from-orange-500/25 dark:via-orange-500/10 dark:to-transparent" />

            <div className="-mt-14 flex flex-col items-center px-6 pb-8">
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

              <h2 className="mt-4 max-w-full truncate text-xl font-bold text-zinc-900 dark:text-white">
                {profile.name || "Unnamed User"}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-zinc-400 dark:text-zinc-500">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="self-start overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
            <dl className="divide-y divide-zinc-200/70 dark:divide-zinc-800">
              <div className="flex items-center gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-950/30">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Name
                  </dt>
                  <dd className="mt-0.5 truncate text-base font-semibold text-zinc-800 dark:text-zinc-100">
                    {profile.name || "Not provided"}
                  </dd>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 dark:bg-violet-950/30">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Email
                  </dt>
                  <dd className="mt-0.5 truncate text-base font-semibold text-zinc-800 dark:text-zinc-100">
                    {profile.email || "Not provided"}
                  </dd>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    Phone
                  </dt>
                  <dd className="mt-0.5 truncate text-base font-semibold text-zinc-800 dark:text-zinc-100">
                    {profile.phoneNumber || "Not provided"}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
