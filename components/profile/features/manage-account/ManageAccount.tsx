"use client";

import { Loader2, Sparkles, UserCog } from "lucide-react";

import LoadingScreen from "@/components/common/LoadingScreen";
import { useManageAccount } from "@/hooks/profile/manageAccount/useManageAccount";
import ProfilePhotoCard from "./ProfilePhotoCard";
import AccountDetailsForm from "./AccountDetailsForm";
import SocialProfileForm from "./SocialProfileForm";

export default function ManageAccount() {
  const {
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    email,
    photoURL,
    bio,
    setBio,
    socialLinks,
    setSocialLinks,
    loading,
    saving,
    uploading,
    handleImageChange,
    handleSave,
  } = useManageAccount();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <section className="relative chat-scroll h-full min-h-0 overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
          <div className="flex min-w-0 items-stretch gap-4">
            <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-orange-500 to-amber-300" />

            <div className="min-w-0 py-1">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-500">
                Account & preferences
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                Manage account
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Keep your personal information up to date.
              </p>
            </div>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 text-zinc-600 shadow-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
            <UserCog className="h-5 w-5" strokeWidth={1.7} />
          </div>
        </header>

        <div className="grid animate-in fade-in-50 slide-in-from-top-3 gap-6 duration-300 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <aside className="min-w-0 space-y-4">
            <ProfilePhotoCard
              name={name}
              bio={bio}
              email={email}
              photoURL={photoURL}
              uploading={uploading}
              onImageChange={handleImageChange}
            />

            <div className="rounded-2xl border border-orange-500/15 bg-linear-to-br from-orange-500/[0.07] via-white/40 to-amber-500/[0.04] p-5 dark:via-zinc-900/40">
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Make it yours ✨
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Keep your profile details and social links up to date so people
                can get to know you better.
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <section className="rounded-[1.75rem] border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <UserCog className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    Account details
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Your basic personal information
                  </p>
                </div>
              </div>

              <AccountDetailsForm
                name={name}
                setName={setName}
                email={email}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
            </section>

            <section className="rounded-[1.75rem] border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">
                    Social profile
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Your bio and social media accounts
                  </p>
                </div>
              </div>

              <SocialProfileForm
                bio={bio}
                setBio={setBio}
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
              />
            </section>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex min-h-12 items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:shadow-orange-500/30 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
