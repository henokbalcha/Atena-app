"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4 rounded-full glass-apple w-12 h-12 opacity-10"></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 md:p-4 rounded-full glass-apple border-black/5 dark:border-white/5 hover:border-accent-blue/40 transition-all duration-500 scale-90 md:scale-100 flex items-center justify-center group active:scale-90"
      aria-label="Toggle Athena Mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun 
          className="w-full h-full transition-all duration-500 absolute rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" 
        />
        <Moon 
          className="w-full h-full transition-all duration-500 absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-accent-blue drop-shadow-[0_0_8px_rgba(10,132,255,0.3)]" 
        />
      </div>
    </button>
  );
}
