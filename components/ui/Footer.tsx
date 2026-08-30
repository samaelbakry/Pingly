import React from "react";

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 border-t border-orange-100 text-center text-xs text-slate-400">
      © {new Date().getFullYear()} Pingly. Crafting warm connections everywhere.
    </footer>
  );
}
