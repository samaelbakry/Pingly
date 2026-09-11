import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
export const themeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <themeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </themeContext.Provider>
    </>
  );
};

export default ThemeContextProvider;

export function useTheme(){
    const context = useContext(themeContext)
    if(!context) throw new Error("useTheme must be used inside ThemeProvider")
    return context
}