"use client";

import { useEffect, useState } from "react";

import {
  listenToUserPrivacySettings,
  PrivacySettingKey,
  PrivacyVisibilityT,
  updatePrivacyVisibility,
  UserPrivacySettings
} from "@/services/privacy";

export function useUserPrivacySettings(userId: string | undefined) {

  const [settings, setSettings] = useState<UserPrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    const unsubscribe = listenToUserPrivacySettings(
      userId,
      (nextSettings) => {
        if (!active) return;

        setSettings(nextSettings);
        setLoading(false);
      },
      () => {
        if (active) setLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId]);

  const saveVisibility = async ( key: PrivacySettingKey, value: PrivacyVisibilityT ) => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    await updatePrivacyVisibility(userId, key, value);
  };

  return {
    settings,
    loading,
    saveVisibility,
  };
}