"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import { Theme, themeContext } from "./ThemeContext";

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    return (localStorage.getItem("theme") as Theme | null) ?? "system";
  });

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const shouldBeDark =
      selectedTheme === "dark" ||
      (selectedTheme === "system" && systemPrefersDark);

    root.classList.toggle("dark", shouldBeDark);
  };

  const setTheme = (newTheme: Theme) => {
    const updateTheme = () => {
      setThemeState(newTheme);
    };

    if (!document.startViewTransition) {
      updateTheme();
      return;
    }

    document.startViewTransition(updateTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
  };
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <themeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </themeContext.Provider>
  );
};

export default ThemeContextProvider;

export function useTheme() {
  const context = useContext(themeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeContextProvider");
  }

  return context;
}
