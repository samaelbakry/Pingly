"use client";

import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/services/users";
import { UserProfile as UserProfileType } from "@/types/userProfile";
import {
  Mail,
  Phone,
  UserRound,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaXTwitter,
} from "react-icons/fa6";

import { useEffect, useState } from "react";
import Link from "next/link";

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
      <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/35 backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm text-zinc-400">Unable to load profile.</p>
      </section>
    );
  }

  const socialAccounts = [
    {
      key: "instagram",
      label: "Instagram",
      url: profile.socialLinks?.instagram,
      icon: FaInstagram,
      cardHover:
        "hover:border-pink-300 hover:bg-pink-50/70 dark:hover:border-pink-500/40 dark:hover:bg-pink-500/10",
      iconHover:
        "group-hover:bg-linear-to-br group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-orange-400 group-hover:text-white group-hover:shadow-md group-hover:shadow-pink-500/20",
      arrowHover: "group-hover:text-pink-500 dark:group-hover:text-white",
    },
    {
      key: "tiktok",
      label: "TikTok",
      url: profile.socialLinks?.tiktok,
      icon: FaTiktok,
      cardHover:
        "hover:border-zinc-300 hover:bg-zinc-50/60 dark:hover:border-zinc-400/30 dark:hover:bg-zinc-800/80",
      iconHover:
        "group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-black dark:group-hover:text-white",
      arrowHover: "group-hover:text-black dark:group-hover:text-white",
    },
    {
      key: "facebook",
      label: "Facebook",
      url: profile.socialLinks?.facebook,
      icon: FaFacebookF,
      cardHover:
        "hover:border-blue-300 hover:bg-blue-50/70 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10",
      iconHover:
        "group-hover:bg-[#1877F2] dark:group-hover:bg-[#1877F2] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/20",
      arrowHover: "group-hover:text-blue-500 dark:group-hover:text-white",
    },
    {
      key: "x",
      label: "X",
      url: profile.socialLinks?.x,
      icon: FaXTwitter,
      cardHover:
        "hover:border-zinc-400 hover:bg-zinc-100/80 dark:hover:border-zinc-600 dark:hover:bg-zinc-800",
      iconHover:
        "group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black",
      arrowHover: "group-hover:text-zinc-900 dark:group-hover:text-white",
    },
  ]
    .map((item) => {
      let safeUrl: string | null = null;

      try {
        const parsedUrl = new URL(item.url ?? "");

        if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
          safeUrl = parsedUrl.href;
        }
      } catch {
        safeUrl = null;
      }

      return {
        ...item,
        safeUrl,
      };
    })
    .filter((item) => item.safeUrl !== null);

  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
          <div className="flex min-w-0 items-stretch gap-4">
            <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-orange-500 to-amber-300" />

            <div className="min-w-0 py-1">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-500">
                Profile & identity
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                User Profile
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Manage your public identity and connected social channels.
              </p>
            </div>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 text-zinc-600 shadow-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
            <UserRound className="h-5 w-5" strokeWidth={1.7} />
          </div>
        </header>

      
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr] mt-1">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="h-32 bg-linear-to-tr from-amber-400/40 via-orange-500/30 to-violet-600/30 dark:from-amber-500/20 dark:via-orange-600/20 dark:to-violet-600/20" />

            <div className="-mt-16 flex flex-col items-center px-6 pb-6">
              <div className="group relative">
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-orange-500 to-violet-600 opacity-70 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg" />
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-2xl dark:border-zinc-900 dark:bg-zinc-800">
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.name || "Profile"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <UserRound className="h-12 w-12 text-orange-500" />
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                  {profile?.name || "Unnamed User"}
                </h2>
                <p className="mt-1 break-all text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {profile?.email || "No email provided"}
                </p>
              </div>

              <div className="mt-6 w-full">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                    About
                  </span>
                </div>

                {profile?.bio?.trim() ? (
                  <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-4 transition-colors dark:border-zinc-800/60 dark:bg-zinc-950/40">
                    <p className="whitespace-pre-wrap text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {profile.bio}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-5 text-center dark:border-zinc-800">
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      No bio added
                    </p>
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      Write a brief summary to introduce yourself.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800/60">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Contact Information
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Primary contact details associated with this profile.
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/40 dark:bg-zinc-950/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">Full Name</p>
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {profile?.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/40 dark:bg-zinc-950/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">
                    Email Address
                  </p>
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {profile?.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 sm:col-span-2 dark:border-zinc-800/40 dark:bg-zinc-950/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">
                    Phone Number
                  </p>
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {profile?.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800/60">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Social Channels
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Connected external links and social platforms.
                </p>
              </div>
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                {socialAccounts.length} Connected
              </span>
            </div>

            <div className="p-6">
              {socialAccounts.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {socialAccounts.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.key}
                        href={social.safeUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/70 bg-zinc-50/50 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-950/40 ${social.cardHover}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-800 dark:text-zinc-200 ${social.iconHover}`}
                          >
                            {Icon && <Icon className="h-5 w-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {social.label}
                            </p>
                            <p className="truncate text-xs text-zinc-400">
                              {social.safeUrl?.replace(/^https?:\/\//, "")}
                            </p>
                          </div>
                        </div>
                        <ExternalLink
                          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${social.arrowHover}`}
                        />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    No social profiles linked
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-zinc-400">
                    Connect platforms in your account settings to showcase them
                    here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
