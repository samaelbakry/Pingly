"use client";

import { createContext } from "react";

export type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
export const themeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
