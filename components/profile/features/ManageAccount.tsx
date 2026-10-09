"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/services/users";
import { uploadImage } from "@/services/uploads";
import { updateProfile } from "firebase/auth";
import { Camera, Mail, Phone, UserRound, Loader2, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateUserProfile } from "@/services/profile";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function ManageAccount() {
  const { user: currentUser } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const profile = await getUserById(currentUser.uid);

        if (!profile) return;

        setName(profile.name ?? "");
        setPhoneNumber(profile.phoneNumber ?? "");
        setEmail(profile.email ?? "");
        setPhotoURL(profile.photoURL ?? "");
      } catch (error) {
        console.error("Failed to load account:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser?.uid]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !currentUser?.uid) return;

    try {
      setUploading(true);

      const newPhotoURL = await uploadImage(file);

      await updateUserProfile(currentUser.uid, { photoURL: newPhotoURL });

      await updateProfile(currentUser, { photoURL: newPhotoURL });

      setPhotoURL(newPhotoURL);

      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!currentUser?.uid || !name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile(currentUser.uid, {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        photoURL,
      });

      await updateProfile(currentUser, {
        displayName: name.trim(),
        photoURL,
      });

      toast.success("Account updated successfully");
    } catch (error) {
      console.error("Failed to update account:", error);
      toast.error("Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <section className="relative h-full min-h-0 overflow-y-auto overflow-x-hidden chat-scroll rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-center gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-500/5 text-orange-500 ring-1 ring-orange-500/20 sm:h-14 sm:w-14">
            <UserCog className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Manage account
            </h1>
            <p className="mt-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Update your personal information.
            </p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]  animate-in fade-in-50 slide-in-from-top-3 duration-300">
          <div className="self-start overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="h-24 bg-linear-to-br from-orange-400/30 via-orange-300/20 to-orange-100/10 dark:from-orange-500/25 dark:via-orange-500/10 dark:to-transparent" />

            <div className="-mt-14 flex flex-col items-center px-6 pb-8">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-xl shadow-orange-500/10 dark:border-zinc-900 dark:bg-orange-950/40">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-12 w-12 text-orange-500" />
                  )}
                </div>

                <label
                  htmlFor="profile-image"
                  className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg transition-transform hover:scale-105 dark:border-zinc-950"
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Camera className="size-4" />
                  )}
                </label>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </div>

              <p className="mt-4 max-w-full truncate text-lg font-bold text-zinc-900 dark:text-white">
                {name || "Unnamed User"}
              </p>
              <p className="mt-1 text-center text-xs text-zinc-400 dark:text-zinc-500">
                Click the camera to change your profile picture
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <label
                  htmlFor="account-name"
                  className="mb-2 flex items-center gap-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                    <UserRound className="h-3.5 w-3.5 text-orange-500" />
                  </span>
                  Full name
                </label>
                <input
                  id="account-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
                />
              </div>

              <div>
                <label
                  htmlFor="account-email"
                  className="mb-2 flex items-center gap-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/30">
                    <Mail className="h-3.5 w-3.5 text-violet-500" />
                  </span>
                  Email
                </label>
                <input
                  id="account-email"
                  value={email}
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-2xl border border-zinc-200 bg-zinc-100/70 px-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50"
                />
              </div>

              <div>
                <label
                  htmlFor="account-phone"
                  className="mb-2 flex items-center gap-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <Phone className="h-3.5 w-3.5 text-amber-500" />
                  </span>
                  Phone number
                </label>
                <input
                  id="account-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-200/70 bg-zinc-50/60 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:px-8">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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
