"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Clock, Eye, LoaderCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { useUserPrivacySettings } from "@/hooks/privacy/PrivacyVisibilitySettings/useUserPrivacySettings";
import {
  DEFAULT_USER_PRIVACY_SETTINGS,
  PrivacySettingKey,
  PrivacyVisibilityT,
} from "@/services/privacy";

export default function PrivacyVisibility() {
  const { user: currentUser } = useAuth();

  const { settings, loading, saveVisibility } = useUserPrivacySettings(
    currentUser?.uid,
  );

  const [savingKey, setSavingKey] = useState<PrivacySettingKey | null>(null);

  const currentSettings = settings ?? DEFAULT_USER_PRIVACY_SETTINGS;

  const handleChange = async (
    key: PrivacySettingKey,
    value: PrivacyVisibilityT,
  ) => {
    if (!currentUser?.uid || savingKey) return;

    setSavingKey(key);

    try {
      await saveVisibility(key, value);

      toast.success(
        key === "lastSeen"
          ? "Last seen settings updated"
          : "Profile photo visibility updated",
      );
    } catch (error) {
      console.error("Failed to update privacy:", error);
      toast.error("Couldn't update privacy settings");
    } finally {
      setSavingKey(null);
    }
  };

  const options: {
    key: PrivacySettingKey;
    title: string;
    description: string;
    icon: typeof Clock;
  }[] = [
    {
      key: "lastSeen",
      title: "Last seen & online",
      description:
        "Choose who can see when you're online and your last seen time.",
      icon: Clock,
    },
    {
      key: "profilePhoto",
      title: "Profile photo",
      description: "Choose who can see your profile picture.",
      icon: Camera,
    },
  ];

  return (
    <div className="rounded-3xl border mb-2 border-zinc-200/80 bg-white/60 p-5 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/40 sm:p-6">
      <div className="flex items-start gap-3.5 pb-5 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/15">
          <Eye className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Visibility
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
            Control what other people can see about your profile and activity.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSaving = savingKey === option.key;
          const isDisabled = loading || !settings || savingKey !== null;

          return (
            <div
              key={option.key}
              className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white/80 p-4 transition-all duration-200 hover:border-zinc-300 hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-colors duration-200 group-hover:bg-orange-500/10 group-hover:text-orange-500 dark:bg-zinc-800/80 dark:text-zinc-400 dark:group-hover:bg-orange-500/15 dark:group-hover:text-orange-400">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {option.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {option.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <Select
                  value={currentSettings[option.key]}
                  disabled={isDisabled}
                  onValueChange={(value) =>
                    handleChange(option.key, value as PrivacyVisibilityT)
                  }
                >
                  <SelectTrigger className="h-9 w-36 rounded-xl border-zinc-200 bg-white text-xs font-medium text-zinc-700 shadow-none transition-colors focus:ring-1 focus:ring-orange-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="everyone" className="text-xs">
                      Everyone
                    </SelectItem>
                    <SelectItem value="nobody" className="text-xs">
                      Nobody
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex h-8 w-8 items-center justify-center shrink-0">
                  {isSaving || loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-orange-500" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
