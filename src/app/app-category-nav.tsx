"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppCategoryNav({ categories }: { categories: string[] }) {
  const [active, setActive] = useState(categories[0]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x no-scrollbar relative z-10 px-4">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "relative px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap snap-center transition-all duration-500 outline-none border border-black/5 dark:border-white/5 italic select-none overflow-hidden hover:scale-105 active:scale-95 shadow-sm",
              isActive 
                ? "dark:text-black text-white bg-black dark:bg-white scale-[1.05] shadow-xl" 
                : "dark:text-white/40 text-black/40 hover:dark:text-white hover:text-black glass-apple"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isActive && (
              <motion.div
                layoutId="athena-pill"
                className="absolute inset-0 dark:bg-white bg-black z-0"
                transition={{ type: "spring", stiffness: 450, damping: 45 }}
              />
            )}
            
            <span className="relative z-10">{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
