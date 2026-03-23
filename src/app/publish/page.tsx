"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft, RocketIcon, UploadCloud, CheckCircle, AlertCircle, CpuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { analyzeApkUpload } from "../actions";

export default function PublishPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "app",
    category: "Entertainment",
    price: 0,
    developer: "",
    package_name: "",
    version_name: ""
  });

  const [icon, setIcon] = useState<File | null>(null);
  const [apk, setApk] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<FileList | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(prof);
    }
    setLoading(false);
  };

  const handleApkChange = async (file: File | null) => {
    setApk(file);
    if (!file) return;

    setAnalyzing(true);
    setErrorMsg("");
    
    const analysisData = new FormData();
    analysisData.append("apkFile", file);

    const result = await analyzeApkUpload(analysisData);
    if (result.success && result.metadata) {
      const meta = result.metadata;
      setFormData(prev => ({
        ...prev,
        title: prev.title || meta.label || "",
        package_name: meta.packageName,
        version_name: meta.versionName
      }));
    } else {
      console.warn("Artifact analysis skipped:", result.error);
    }
    setAnalyzing(false);
  };

  const becomePublisher = async () => {
    setRegistering(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ is_publisher: true })
        .eq("id", user.id);
      
      if (!error) {
        setProfile({ ...profile, is_publisher: true });
      }
    }
    setRegistering(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setErrorMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Upload Icon
      let iconUrl = "";
      if (icon) {
        const iconName = `${Date.now()}_icon_${icon.name}`;
        const { data: iconData, error: iconErr } = await supabase.storage
          .from("app-icons")
          .upload(iconName, icon);
        if (iconErr) throw iconErr;
        iconUrl = supabase.storage.from("app-icons").getPublicUrl(iconName).data.publicUrl;
      }

      // 2. Upload APK
      let apkUrl = "";
      if (apk) {
        const apkName = `${Date.now()}_package_${apk.name}`;
        const { data: apkData, error: apkErr } = await supabase.storage
          .from("app-bundles")
          .upload(apkName, apk);
        if (apkErr) throw apkErr;
        apkUrl = supabase.storage.from("app-bundles").getPublicUrl(apkName).data.publicUrl;
      }

      // 3. Upload Screenshots
      const screenUrls: string[] = [];
      if (screenshots) {
        for (let i = 0; i < screenshots.length; i++) {
          const s = screenshots[i];
          const sName = `${Date.now()}_screen_${s.name}`;
          const { error: sErr } = await supabase.storage
            .from("screenshots")
            .upload(sName, s);
          if (!sErr) {
            screenUrls.push(supabase.storage.from("screenshots").getPublicUrl(sName).data.publicUrl);
          }
        }
      }

      // 4. Create App Entry
      const { error: dbErr } = await supabase
        .from("apps")
        .insert({
          ...formData,
          icon_url: iconUrl,
          apk_url: apkUrl,
          screenshots: screenUrls,
          publisher_id: user.id,
          developer: formData.developer || profile.full_name
        });

      if (dbErr) throw dbErr;
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish artifact.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen liquid-bg flex items-center justify-center text-white/20 uppercase font-black tracking-widest">INITIALIZING_STORAGE...</div>;

  if (!profile) return (
    <div className="min-h-screen liquid-bg flex flex-col items-center justify-center p-10 text-center">
       <AlertCircle size={64} className="text-white/10 mb-8" />
       <h1 className="text-4xl font-bold mb-4">ACCESS_DENIED</h1>
       <p className="text-white/40 mb-12 max-w-md">You must be logged into your Athena account to publish assets to the global repository.</p>
       <Link href="/login" className="btn-apple">Athena_Login</Link>
    </div>
  );

  if (!profile.is_publisher) return (
    <div className="min-h-screen liquid-bg flex flex-col items-center justify-center p-10 text-center text-black dark:text-white">
       <RocketIcon size={64} className="text-accent-blue mb-8" />
       <h1 className="text-4xl font-bold mb-4">Become a Publisher</h1>
       <p className="opacity-40 mb-12 max-w-md italic">Launch your innovations into the Athena network. Register as a verified publisher to start deploying assets.</p>
       <button onClick={becomePublisher} disabled={registering} className="btn-apple">
          {registering ? "PROCESSING..." : "REGISTER_AS_PUBLISHER"}
       </button>
    </div>
  );

  return (
    <div className="min-h-screen liquid-bg pb-40">
       <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 glass-apple rounded-[2rem] px-8 py-5 flex items-center justify-between border-black/5 dark:border-white/5">
         <Link href="/" className="flex items-center gap-3 group text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-xs font-black uppercase tracking-widest pt-1">EXIT_DEPLOY</span>
         </Link>
         <h1 className="text-xl font-bold tracking-tight opacity-80 select-none italic pt-1">PUBLISH_ARTIFACT</h1>
         <div className="w-20"></div>
       </nav>

       <main className="pt-40 px-6 max-w-3xl mx-auto">
          {success ? (
            <div className="glass-apple rounded-[3rem] p-20 flex flex-col items-center text-center">
                <CheckCircle size={80} className="text-green-500 mb-8" />
                <h2 className="text-4xl font-bold mb-4">DEPLOYMENT_SUCCESS</h2>
                <p className="opacity-40 font-medium italic">Artifact has been integrated into the Athena Network. Syncing database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                
                {errorMsg && (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl font-bold text-xs uppercase tracking-widest italic animate-pulse">
                     Error: {errorMsg}
                  </div>
                )}

                <div className="glass-apple p-12 rounded-[3.5rem] flex flex-col gap-10 border-black/5 dark:border-white/5">
                    <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Deployment_Title</label>
                       <input 
                         required
                         placeholder="Enter application name"
                         className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-5 rounded-3xl text-lg font-bold placeholder:opacity-10 outline-none focus:bg-black/10 dark:focus:bg-white/10 transition-all"
                         value={formData.title}
                         onChange={e => setFormData({...formData, title: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Artifact_Type</label>
                          <select 
                            className="glass-apple bg-black/10 dark:bg-white/10 border-none px-8 py-5 rounded-3xl text-sm font-bold outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                          >
                             <option value="app" className="bg-white dark:bg-black">Athena_App</option>
                             <option value="game" className="bg-white dark:bg-black">Athena_Game</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Category</label>
                          <select 
                            className="glass-apple bg-black/10 dark:bg-white/10 border-none px-8 py-5 rounded-3xl text-sm font-bold outline-none"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                          >
                             {['Entertainment', 'Productivity', 'Finance', 'Social', 'AI Tools', 'Creativity'].map(c => (
                               <option key={c} value={c} className="bg-white dark:bg-black">{c}</option>
                             ))}
                          </select>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Technical_Description</label>
                       <textarea 
                         required
                         rows={4}
                         placeholder="Describe your artifact and its dependencies..."
                         className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-6 rounded-3xl text-sm font-medium placeholder:opacity-10 outline-none focus:bg-black/10 dark:focus:bg-white/10 transition-all resize-none"
                         value={formData.description}
                         onChange={e => setFormData({...formData, description: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Public_Price ($)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-5 rounded-3xl text-sm font-bold outline-none"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                          />
                       </div>
                       <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Developer_Label</label>
                          <input 
                            placeholder="Optional: Custom Brand"
                            className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-5 rounded-3xl text-sm font-bold outline-none"
                            value={formData.developer}
                            onChange={e => setFormData({...formData, developer: e.target.value})}
                          />
                       </div>
                    </div>
                </div>

                <div className="glass-apple p-12 rounded-[3.5rem] flex flex-col gap-10 border-black/5 dark:border-white/5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="flex flex-col gap-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Artifact_Icon</label>
                         <input 
                           type="file" 
                           accept="image/*"
                           className="hidden"
                           id="icon-upload"
                           onChange={e => setIcon(e.target.files?.[0] || null)}
                         />
                         <label htmlFor="icon-upload" className="glass-apple p-10 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center border-dashed border-black/10 dark:border-white/10">
                            {icon ? (
                              <div className="flex flex-col items-center gap-2">
                                 <CheckCircle size={32} className="text-accent-blue" />
                                 <span className="text-[10px] font-bold uppercase italic">{icon.name}</span>
                              </div>
                            ) : (
                               <>
                                 <UploadCloud size={32} className="opacity-20" />
                                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Select_Image</span>
                               </>
                            )}
                         </label>
                      </div>

                      <div className="flex flex-col gap-4 relative">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Source_Bundle (APK)</label>
                         <input 
                           type="file" 
                           accept=".apk"
                           className="hidden"
                           id="apk-upload"
                           onChange={e => handleApkChange(e.target.files?.[0] || null)}
                         />
                         <label htmlFor="apk-upload" className="glass-apple p-10 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center border-dashed border-black/10 dark:border-white/10 relative overflow-hidden">
                            {analyzing && (
                               <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-10">
                                  <CpuIcon size={24} className="animate-spin text-accent-blue" />
                                  <span className="text-[9px] font-black uppercase tracking-widest italic animate-pulse">Analyzing_Artifact...</span>
                               </div>
                            )}
                            {apk ? (
                              <div className="flex flex-col items-center gap-2">
                                 <CheckCircle size={32} className="text-accent-blue" />
                                 <span className="text-[10px] font-bold uppercase italic">{apk.name}</span>
                                 <span className="text-[8px] font-black text-accent-blue/50 uppercase tracking-widest">{formData.package_name || "Extracted_Pkg"}</span>
                              </div>
                            ) : (
                               <>
                                 <UploadCloud size={32} className="opacity-20" />
                                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Select_APK</span>
                               </>
                            )}
                         </label>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Visual_Verification (Screenshots)</label>
                      <input 
                        type="file" 
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="screen-upload"
                        onChange={e => setScreenshots(e.target.files)}
                      />
                      <label htmlFor="screen-upload" className="glass-apple py-20 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center border-dashed border-black/10 dark:border-white/10">
                         {screenshots ? (
                            <div className="flex items-center gap-4">
                               <CheckCircle size={32} className="text-accent-blue" />
                               <span className="text-[11px] font-black uppercase tracking-[0.2em]">{screenshots.length} IMAGES_STAGED</span>
                            </div>
                         ) : (
                            <>
                              <UploadCloud size={40} className="opacity-20" />
                              <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Batch_Upload_Images</span>
                            </>
                         )}
                      </label>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading || analyzing}
                  className="w-full glass-apple !bg-black dark:!bg-white !text-white dark:!text-black py-8 rounded-[3rem] font-black text-lg uppercase tracking-[0.4em] hover:scale-[1.02] shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(255,255,255,0.15)] active:scale-95 transition-all outline-none disabled:opacity-50"
                >
                  {uploading ? "INITIATING_DEPLOYMENT..." : analyzing ? "WAITING_FOR_METADATA..." : "DEPLOY_TO_ATHENA_NETWORK [+]" }
                </button>
            </form>
          )}
       </main>
    </div>
  );
}
