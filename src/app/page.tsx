import { supabase } from "@/lib/supabaseClient";
import { SearchBar } from "./search-bar";
import { BentoGridApps } from "./bento-grid-apps";
import { AppCategoryNav } from "./app-category-nav";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { UserIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ type?: string, search?: string }> }) {
  const { type, search } = await searchParams;

  // Fetch User
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('apps')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  if (search) {
     query = query.ilike('title', `%${search}%`);
  }

  const { data: apps, error } = await query;

  if (error) {
    console.error("Error fetching apps", error);
  }

  const allApps = apps || [];

  return (
    <div className="min-h-screen liquid-bg overflow-x-hidden pb-40 transition-colors duration-500">
      
      {/* Liquid Blurs Decorative Background */}
      <div className="fixed top-[-20%] left-[-20%] liquid-glow animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-20%] liquid-glow animate-pulse opacity-20" style={{ background: 'radial-gradient(circle, rgba(10, 132, 255, 0.1) 0%, transparent 70%)' }}></div>

      {/* Navigation - High Contrast Athena Design */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass-apple rounded-[2.5rem] px-10 py-5 flex items-center justify-between border-black/5 dark:border-white/10 shadow-xl">
        <div className="flex items-center gap-12">
          <Link href="/">
            <h1 className="text-2xl font-bold tracking-tighter dark:text-white text-black hover:opacity-80 transition-opacity uppercase italic">
              ATHENA APP
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em]">
            <Link href="/?type=app" className={`transition-colors duration-300 ${type === 'app' ? 'dark:text-white text-black border-b-2 border-accent-blue/60 pb-1' : 'dark:text-white/40 text-black/40 hover:text-black dark:hover:text-white'}`}>APPs</Link>
            <Link href="/?type=game" className={`transition-colors duration-300 ${type === 'game' ? 'dark:text-white text-black border-b-2 border-accent-blue/60 pb-1' : 'dark:text-white/40 text-black/40 hover:text-black dark:hover:text-white'}`}>GAMEs</Link>
            <Link href="/publish" className="text-accent-blue hover:scale-105 transition-all font-bold">DEPLOY [+].</Link>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <ThemeToggle />
           <div className="flex items-center gap-10 text-[10px] font-black tracking-[0.3em] uppercase">
            {user ? (
               <Link href="/dashboard" className="dark:text-black text-white dark:bg-white bg-black px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg">DASHBOARD</Link>
            ) : (
               <Link href="/login" className="dark:text-white/40 text-black/60 hover:dark:text-white hover:text-black transition-colors">LOGIN_CIPHER</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-48 px-6 max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* HERO SECTION - REFINED CONTRAST */}
        <section className="text-center py-24 flex flex-col items-center relative">
          <div className="inline-flex glass-apple rounded-full px-8 py-3 mb-10 text-[10px] font-black dark:text-white/40 text-black/60 border-black/5 dark:border-white/10 tracking-[0.5em] uppercase shadow-sm">
            {type === 'game' ? 'EXPLORE TOP TITLES' : 'EXPLORE TOP UTILITIES'}
          </div>
          
          <h2 className="text-6xl md:text-[8rem] font-bold tracking-tighter mb-10 leading-[0.85] text-premium filter drop-shadow-2xl">
            {type === 'game' ? 'PLAY. DISCOVER.' : 'TOOLS. REFINED.'}<br/>
            {type === 'app' ? 'LATEST APPS.' : 'NEW GAMES.'}
          </h2>
          
          <p className="text-lg md:text-xl dark:text-white/30 text-black/50 max-w-3xl mx-auto mb-20 font-medium leading-relaxed italic tracking-wide">
            The world&apos;s most innovative {type === 'game' ? 'interactive' : 'digital'} experiences, now presented through a lens of absolute clarity and precision.
          </p>

          <div className="flex gap-8">
            <Link href="/?type=app" className="btn-apple">View All Apps</Link>
            <Link href="/?type=game" className="btn-apple-glass">Explore Gaming</Link>
          </div>
        </section>

        {/* Categories Select */}
        <section className="sticky top-28 z-40">
           <AppCategoryNav categories={['All', 'Entertainment', 'Productivity', 'Finance', 'Social', 'AI Tools', 'Creativity']} />
        </section>

        {/* Bento Grid Featured Layout */}
        <section id="artifact-grid">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
            <div>
               <h3 className="text-5xl font-bold tracking-tight mb-3 uppercase italic dark:text-white text-black">
                 {type === 'game' ? 'GAMEs' : 'APPs'} PORTAL
               </h3>
               <p className="text-[10px] font-black dark:text-white/20 text-black/30 uppercase tracking-[0.6em] italic">Network_Verified_Artifacts</p>
            </div>
            <div className="flex items-center gap-8 w-full md:w-auto">
               <SearchBar />
            </div>
          </div>
          
          <BentoGridApps apps={allApps} />
        </section>

      </main>

      {/* Footer - Solid Contrast */}
      <footer className="py-24 border-t border-black/10 dark:border-white/5 mt-40">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col gap-3">
               <span className="text-2xl font-bold italic uppercase tracking-tighter dark:text-white text-black">ATHENA_APP_NETWORK</span>
               <span className="text-[9px] font-black dark:text-white/10 text-black/20 uppercase tracking-[0.4em] leading-none">© 2026 ATHENA_PROTOCOL. ALL_RIGHTS_PROTECTED.</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] dark:text-white/20 text-black/30">
               <Link href="#" className="hover:text-accent-blue dark:hover:text-white transition-colors">Protocol</Link>
               <Link href="#" className="hover:text-accent-blue dark:hover:text-white transition-colors">Manifesto</Link>
               <Link href="#" className="hover:text-accent-blue dark:hover:text-white transition-colors">Privacy_Cipher</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
