"use client";

import { useAuth } from "@/context/AuthContext";
import {
  getUserById,
} from "@/services/users";
import { uploadImage } from "@/services/uploads";
import { updateProfile } from "firebase/auth";
import { Camera, Mail, Phone, UserRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateUserProfile } from "@/services/profile";

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

      await updateProfile(currentUser, {photoURL: newPhotoURL});

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
    return (
      <section className="relative flex h-full items-center justify-center rounded-[2.5rem] border border-white/40 bg-white/30 backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </section>
    );
  }

  return (
    <section className="relative h-full min-h-0 overflow-y-auto overflow-x-hidden chat-scroll rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Account
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Manage Account
          </h1>

          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Update your personal information.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="mb-8 flex flex-col items-center">
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

            <p className="mt-3 text-xs text-zinc-400">
              Click the camera to change your profile picture
            </p>
          </div>

          <div className="space-y-5">
         
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <UserRound className="h-3.5 w-3.5 text-orange-500" />
                Full name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
              />
            </div>

          
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <Mail className="h-3.5 w-3.5 text-violet-500" />
                Email
              </label>

              <input
                value={email}
                disabled
                className="h-12 w-full cursor-not-allowed rounded-2xl border border-zinc-200 bg-zinc-100/70 px-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                Phone number
              </label>

              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}