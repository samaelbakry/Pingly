"use client";

import { updateProfile } from "firebase/auth";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/services/profile";
import { uploadImage } from "@/services/uploads";
import { getUserById } from "@/services/users";
import type { SocialLinks } from "@/types/userProfile";

export function useManageAccount() {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.uid;

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: "",
    tiktok: "",
    facebook: "",
    x: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const profile = await getUserById(currentUserId);

        if (!profile || cancelled) return;

        setName(profile.name ?? "");
        setPhoneNumber(profile.phoneNumber ?? "");
        setEmail(profile.email ?? "");
        setPhotoURL(profile.photoURL ?? "");
        setBio(profile.bio ?? "");

        setSocialLinks({
          instagram: profile.socialLinks?.instagram ?? "",
          tiktok: profile.socialLinks?.tiktok ?? "",
          facebook: profile.socialLinks?.facebook ?? "",
          x: profile.socialLinks?.x ?? "",
        });
      } catch (error) {
        console.error("Failed to load account:", error);

        if (!cancelled) {
          toast.error("Failed to load account");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !currentUser) return;

    try {
      setUploading(true);

      const newPhotoURL = await uploadImage(file);

      await updateUserProfile(currentUser.uid, {
        photoURL: newPhotoURL,
      });

      await updateProfile(currentUser, {
        photoURL: newPhotoURL,
      });

      setPhotoURL(newPhotoURL);

      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!currentUser || !name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const normalizedSocialLinks: SocialLinks = {
        instagram: socialLinks.instagram?.trim() ?? "",
        tiktok: socialLinks.tiktok?.trim() ?? "",
        facebook: socialLinks.facebook?.trim() ?? "",
        x: socialLinks.x?.trim() ?? "",
      };

      await updateUserProfile(currentUser.uid, {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        photoURL,
        bio: bio.trim(),
        socialLinks: normalizedSocialLinks,
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

  return {
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
  };
}