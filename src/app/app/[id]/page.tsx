import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, DownloadIcon, Share2, Star, ShieldCheck, ZapIcon } from "lucide-react";
import { ImageGallery } from "./image-gallery";
import { ReviewForm } from "../../review-form";

export const dynamic = 'force-dynamic';

export default async function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch App Data
  const { data: app, error } = await supabase
    .from('apps')
    .select('*, reviews(*)')
    .eq('id', id)
    .single();

  if (error || !app) {
    notFound();
  }

  const reviews = app.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : app.rating || "0.0";

  return (
    <div className="min-h-screen liquid-bg pb-40 text-white">
      
      {/* Decorative Glows */}
      <div className="fixed top-[-10%] right-[-10%] liquid-glow opacity-30 animate-pulse"></div>

      {/* Navigation - Minimal back bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass-apple rounded-[2rem] px-8 py-4 flex items-center justify-between border-white/5">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">EXIT_TO_PORTAL</span>
        </Link>
        <div className="flex items-center gap-4">
           <Share2 size={16} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
        </div>
      </nav>

      <main className="pt-40 px-6 max-w-6xl mx-auto">
        
        {/* APP HEADER SECTION - Liquid Glass style */}
        <section className="flex flex-col md:flex-row gap-16 items-start mb-24">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] glass-apple border-white/10 p-1 flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative group overflow-hidden shrink-0">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent transition-opacity group-hover:opacity-0"></div>
             {app.icon_url ? (
               <img src={app.icon_url} alt={app.title} className="w-full h-full object-cover rounded-[3.2rem]" />
             ) : (
               <div className="text-7xl font-bold text-white/10 uppercase italic">{app.title.charAt(0)}</div>
             )}
          </div>

          <div className="flex-1 pt-4">
            <div className="flex items-center gap-4 mb-6">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue px-4 py-2 glass-apple rounded-full border-blue-500/20">
                 {app.type === 'game' ? 'ATHENA_GAME' : 'ATHENA_APP'}
               </span>
               <div className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold text-white">{avgRating}</span>
               </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase italic text-premium filter drop-shadow-xl leading-none">
              {app.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/40 font-medium mb-12 max-w-2xl leading-relaxed italic">
              {app.description || "The next evolution in digital distribution. Verified by Athena Neural Protocol."}
            </p>

            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-white/5">
                <button className="bg-white text-black font-black px-16 py-6 rounded-full text-sm hover:scale-[1.05] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95 uppercase tracking-widest">
                   GET {app.price > 0 ? `$${app.price}` : "ACCESS"}
                </button>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Developer</span>
                   <span className="text-sm font-bold text-white/80 italic">{app.developer || "Athena Labs"}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/5"></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Age_Rating</span>
                   <span className="text-sm font-bold text-white/80 italic">4+ Verified</span>
                </div>
            </div>
          </div>
        </section>

        {/* SCREENSHOTS COMPONENT */}
        <section className="mb-32">
           <div className="flex items-center gap-3 mb-8">
              <ZapIcon size={16} className="text-accent-blue" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">VISUAL_ARTIFACTS</h3>
           </div>
           <ImageGallery images={app.screenshots || []} />
        </section>

        {/* DESCRIPTION & TECHNICAL DETAILS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-32 border-y border-white/5 py-32">
            <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold mb-10 uppercase italic">Technical Overview</h3>
                <p className="text-white/40 text-lg leading-[1.8] font-medium italic">
                  This artifact has been optimized for the Athena Neural Network. It features high-frequency data distribution, 
                  end-to-end cyphered transactions, and is fully compatible with all modern 2026-era hardware protocols.
                  <br/><br/>
                  Our deployment includes complete source-level verification and zero-latency execution nodes.
                </p>
            </div>
            <div className="flex flex-col gap-10">
                <div className="glass-apple p-10 rounded-[2.5rem] border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                       <ShieldCheck size={20} className="text-green-500" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Security_Status</span>
                    </div>
                    <p className="text-xs font-bold text-white/60 mb-2 uppercase italic tracking-widest">VERIFIED_SECURE</p>
                    <p className="text-[10px] text-white/20 leading-loose uppercase font-medium">Artifact scanned for all major architectural vulnerabilities. Hash verified via Athena Cloud Protocol.</p>
                </div>
                <div className="flex flex-col gap-6 pl-6">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span className="text-white/20 italic">File Size</span>
                       <span className="text-white/60 italic">124.5 MB</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span className="text-white/20 italic">Version</span>
                       <span className="text-white/60 italic">2.0.4_BETA</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span className="text-white/20 italic">Category</span>
                       <span className="text-white/60 italic">{app.category}</span>
                    </div>
                </div>
            </div>
        </section>

        {/* REVIEW SECTION */}
        <section>
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-4xl font-bold tracking-tight uppercase italic">User Reviews</h3>
            <div className="text-sm font-bold text-white/40 uppercase tracking-widest">
               {reviews.length} Feedbacks
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {reviews.map((review: any) => (
              <div key={review.id} className="glass-apple p-10 rounded-[3rem] border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-lg text-white mb-1 uppercase italic">{review.user_name}</h4>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-accent-blue px-3 py-1.5 glass-apple rounded-full">
                    <Star size={10} fill="currentColor" />
                    <span className="text-xs font-bold">{review.rating}.0</span>
                  </div>
                </div>
                <p className="text-md text-white/40 font-medium italic leading-relaxed">
                   &quot;{review.comment}&quot;
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20">
             <ReviewForm appId={id} />
          </div>
        </section>
      </main>
    </div>
  );
}
