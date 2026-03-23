"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft, Package, Download, BarChart3, Settings, LogOut, PlusCircle, Trash2, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ downloads: 0, rating: 0 });

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch Profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    setProfile(prof);

    // Fetch Apps (Owned by this publisher)
    const { data: myApps } = await supabase
      .from("apps")
      .select("*")
      .eq("publisher_id", user.id);
    
    setApps(myApps || []);

    // Calculate basic stats
    if (myApps && myApps.length > 0) {
      const totalDownloads = myApps.reduce((acc, a) => acc + (a.downloads || 0), 0);
      const avgRating = (myApps.reduce((acc, a) => acc + (a.rating || 0), 0) / myApps.length).toFixed(1);
      setAnalytics({ downloads: totalDownloads, rating: parseFloat(avgRating) });
    }

    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const deleteApp = async (id: string) => {
    if (confirm("Are you sure you want to retract this artifact from the network?")) {
      const { error } = await supabase.from("apps").delete().eq("id", id);
      if (!error) setApps(apps.filter(a => a.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen liquid-bg flex items-center justify-center text-white/20 font-black tracking-widest">SYNCHRONIZING_DASHBOARD...</div>;

  return (
    <div className="min-h-screen liquid-bg text-white pb-40">
      
      {/* Dashboard Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 glass-apple rounded-[2.5rem] px-10 py-5 flex items-center justify-between border-white/5">
        <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
           <ArrowLeft size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest italic leading-none pt-1">Athena_Portal</span>
        </Link>
        <div className="flex items-center gap-10">
           <ThemeToggle />
           <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold opacity-80 uppercase italic">{profile?.full_name || "Nexus_Internal"}</span>
              <span className="text-[9px] font-black text-accent-blue tracking-widest uppercase">{profile?.is_publisher ? "VERIFIED_PUBLISHER" : "TERMINAL_USER"}</span>
           </div>
           <button onClick={handleLogout} className="glass-apple p-4 rounded-full border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-40 hover:text-red-400">
              <LogOut size={18} />
           </button>
        </div>
      </nav>

      <main className="pt-40 px-6 max-w-7xl mx-auto">
        
        {/* Analytics Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div className="glass-apple p-10 rounded-[3rem] border-white/5 flex flex-col justify-between h-[280px]">
              <div className="flex justify-between items-start">
                 <Package size={32} className="text-white/20" />
                 <span className="text-[10px] font-black text-white/10 tracking-[0.4em]">DEPLOYMENTS</span>
              </div>
              <div>
                 <h4 className="text-7xl font-bold tracking-tighter text-premium">{apps.length}</h4>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Active Neural Artifacts</p>
              </div>
           </div>
           <div className="glass-apple p-10 rounded-[3rem] border-white/5 flex flex-col justify-between h-[280px]">
              <div className="flex justify-between items-start">
                 <Download size={32} className="text-white/20" />
                 <span className="text-[10px] font-black text-white/10 tracking-[0.4em]">DISTRIBUTION</span>
              </div>
              <div>
                 <h4 className="text-7xl font-bold tracking-tighter text-premium">{(analytics.downloads / 1000).toFixed(1)}K</h4>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Global Node Repetition</p>
              </div>
           </div>
           <div className="glass-apple p-10 rounded-[3rem] border-white/5 flex flex-col justify-between h-[280px] bg-accent-blue/5">
              <div className="flex justify-between items-start">
                 <BarChart3 size={32} className="text-accent-blue/40" />
                 <span className="text-[10px] font-black text-accent-blue/20 tracking-[0.4em]">CORE_RATING</span>
              </div>
              <div>
                 <h4 className="text-7xl font-bold tracking-tighter text-accent-blue">{analytics.rating}</h4>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Network Trust Evaluation</p>
              </div>
           </div>
        </section>

        {/* Content Tabs */}
        <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
            <h3 className="text-3xl font-bold italic tracking-tight flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-accent-blue"></span> 
              MY_DEPLOYED_ARTIFACTS
            </h3>
            {profile?.is_publisher && (
              <Link href="/publish" className="btn-apple !py-4 flex items-center gap-3">
                 <PlusCircle size={16} /> NEW_DEPLOYMENT
              </Link>
            )}
        </div>

        {/* Apps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {apps.length === 0 ? (
             <div className="col-span-full py-40 flex flex-col items-center justify-center glass-apple rounded-[4rem] border-dashed border-white/5 order-white/10 opacity-20 italic font-bold uppercase tracking-widest text-sm">
                NO_DEPLOYS_FOUND_IN_USER_CACHE
             </div>
           ) : (
             apps.map(app => (
               <div key={app.id} className="glass-apple p-8 rounded-[3rem] border-white/5 flex items-center gap-8 group hover:bg-white/5 transition-all">
                  <div className="w-20 h-20 rounded-[1.8rem] glass-apple border-white/10 flex items-center justify-center shrink-0 shadow-xl relative overflow-hidden group-hover:scale-105 transition-transform">
                     {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <Package className="text-white/10" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h5 className="text-xl font-bold italic truncate text-white/90">{app.title}</h5>
                     <div className="flex gap-4 items-center mt-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
                        <span>{app.type}</span>
                        <span>/</span>
                        <span>{app.category}</span>
                        <span>/</span>
                        <span className="flex items-center gap-1"><Download size={8} /> {app.downloads}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="p-4 glass-apple rounded-2xl border-white/5 text-white/20 hover:text-white transition-colors">
                        <Edit size={16} />
                     </button>
                     <button onClick={() => deleteApp(app.id)} className="p-4 glass-apple rounded-2xl border-white/5 text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>
      </main>
    </div>
  );
}
