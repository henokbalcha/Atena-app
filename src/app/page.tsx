import { supabase } from "@/lib/supabaseClient";
import { SearchBar } from "./search-bar";
import { BentoGridApps } from "./bento-grid-apps";
import { AppCategoryNav } from "./app-category-nav";
import Link from "next/link";
import { DownloadIcon, UserIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: apps, error } = await supabase
    .from('apps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching apps", error);
  }

  const allApps = apps || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      {/* Global Navigation - Floating Glass */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass rounded-full px-6 py-3 flex items-center justify-between shadow-[0_0_30px_-10px_theme('colors.blue.500/0.3')]">
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-200">
              Nexus Store
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">Discover</Link>
            <Link href="/arcade" className="hover:text-white transition-colors">Arcade</Link>
            <Link href="/create" className="hover:text-white transition-colors text-blue-400">Publish App</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <Link href="/dashboard" className="h-10 w-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <UserIcon size={18} className="text-slate-300" />
          </Link>
        </div>
      </nav>

      <main className="pt-32 px-4 max-w-7xl mx-auto flex flex-col gap-12">
        {/* Hero Section */}
        <section className="text-center py-10 md:py-20 flex flex-col items-center">
          <div className="inline-flex glass rounded-full px-4 py-1.5 mb-6 text-xs font-semibold text-blue-400 border-blue-500/30">
            <span className="animate-pulse mr-2 rounded-full h-2 w-2 bg-blue-500 inline-block"></span>
            Welcome to the Future of Apps
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-cyan-100 to-blue-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Discover What's Next
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            A curated collection of the most powerful, beautiful, and innovative mobile applications. 
            Downloaded at the speed of light.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 font-semibold transition-all hover:shadow-[0_0_20px_-5px_theme('colors.blue.500')] active:scale-95">
              Explore Top Charts
            </button>
            <button className="glass hover:bg-white/10 text-white rounded-full px-8 py-3 font-semibold transition-all active:scale-95">
              Admin Portal
            </button>
          </div>
        </section>

        {/* Categories Pills */}
        <section className="sticky top-24 z-40 bg-slate-950/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <AppCategoryNav categories={['All', 'Productivity', 'Games', 'Finance', 'Social', 'AI Tools', 'Creativity']} />
        </section>

        {/* Bento Grid Featured Layout */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold">Featured Editor's Choice</h3>
            <button className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-1 group">
              See all <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          
          <BentoGridApps apps={allApps} />
        </section>
      </main>
    </div>
  );
}
