"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { DownloadIcon, ZapIcon, Star } from "lucide-react";

export function BentoGridApps({ apps }: { apps: any[] }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const mockFeatured = [
    { id: '00000000-0000-0000-0000-000000000001', title: 'Athena Core', category: 'Productivity', type: 'app', rating: 4.8, description: 'Sleek utility for modern workflows.' },
    { id: '00000000-0000-0000-0000-000000000002', title: 'Cyber Quest', category: 'Entertainment', type: 'game', rating: 4.9, description: 'An immersive arcade experience.' }
  ];

  const displayApps = apps.length > 0 ? apps : mockFeatured;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20"
    >
      {displayApps.map((app, i) => {
        return (
          <motion.div key={app.id || i} variants={item} className="h-[380px]">
            <Link href={`/app/${app.id}`} className="glass-apple-card block w-full h-full relative overflow-hidden group shadow-lg dark:shadow-2xl border-black/5 dark:border-white/5 hover:border-accent-blue/40 transition-all duration-300">
              
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 dark:from-black/80 to-transparent group-hover:from-black/40 dark:group-hover:from-black transition-opacity duration-500"></div>

              <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-black/5 dark:bg-white/10 flex items-center justify-center relative shadow-sm overflow-hidden group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-md"></div>
                    {app.icon_url ? (
                      <img src={app.icon_url} alt={app.title} className="w-full h-full object-cover relative z-10" />
                    ) : (
                      <span className="text-3xl font-bold dark:text-white/20 text-black/20 relative z-10 uppercase">{app.title.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-black dark:text-white/50 text-black/40 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-apple border-black/5 dark:border-white/5 uppercase tracking-widest bg-white/80 dark:bg-transparent">
                    {app.rating || "New"} <Star size={8} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-black tracking-tight dark:text-white text-black mb-2 group-hover:opacity-80 transition-opacity uppercase italic leading-none">{app.title}</h4>
                   <div className="flex items-center gap-2 mb-6">
                     <p className="text-[9px] text-accent-blue font-black uppercase tracking-[0.3em]">
                        {app.type === 'game' ? 'GAME' : 'APP'}
                     </p>
                     <p className="text-[9px] dark:text-white/40 text-black/30 font-black uppercase tracking-[0.3em]">
                        / {app.category}
                     </p>
                  </div>
                  
                  <p className="dark:text-white/20 text-black/40 font-medium text-xs line-clamp-2 leading-relaxed italic mb-8">
                      {app.description || "Experimental digital artifact for the Athena network."}
                  </p>

                  <div className="flex items-center justify-between">
                     <button className="dark:bg-white dark:text-black bg-black text-white font-black px-10 py-3 rounded-full text-[10px] hover:scale-105 transition-all shadow-xl tracking-[0.2em] active:scale-95">
                        GET
                     </button>
                      <span className="text-[9px] font-bold dark:text-white/10 text-black/20 uppercase tracking-widest italic">{app.price > 0 ? `$${app.price}` : "ACCESS_OPEN"}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
