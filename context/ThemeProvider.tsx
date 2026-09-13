"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import { Theme, themeContext } from "./ThemeContext";

const ThemeContextProvider = ({children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return (localStorage.getItem("theme") as Theme | null) ?? "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle( "dark", theme === "dark" );
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  );
};

export default ThemeContextProvider;

export function useTheme() {
  const context = useContext(themeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
