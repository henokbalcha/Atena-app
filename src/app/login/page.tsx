"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserIcon, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });
                if (signUpError) throw signUpError;
                
                setError("Verification protocol sent. Please check your credentials inbox.");
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                
                // Success - Redirect
                router.push("/publish");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "Credential verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen liquid-bg flex items-center justify-center p-6 transition-colors duration-500">
            {/* Nav Back */}
            <Link href="/" className="fixed top-12 left-12 flex items-center gap-2 dark:text-white/40 text-black/40 hover:dark:text-white hover:text-black transition-all group">
               <ArrowLeft size={16} />
               <span className="text-[10px] font-black tracking-widest uppercase italic">Root_System</span>
            </Link>

            <div className="glass-apple p-12 md:p-16 rounded-[4rem] w-full max-w-xl shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 border-black/5 dark:border-white/5">
                <div className="flex flex-col items-center mb-12">
                   <div className="w-20 h-20 glass-apple rounded-3xl flex items-center justify-center mb-6 shadow-2xl border-black/5 dark:border-white/10">
                      <ShieldCheck size={32} className="text-accent-blue" />
                   </div>
                   <h1 className="text-4xl font-bold tracking-tighter dark:text-white text-black mb-2 uppercase italic">ATHENA_AUTH</h1>
                   <p className="text-[10px] font-black dark:text-white/20 text-black/30 tracking-[0.4em] uppercase">Unified Network Credentials</p>
                </div>

                {error && (
                    <div className="p-5 glass-apple border-red-500/20 text-red-500 rounded-2xl mb-8 text-xs font-bold leading-relaxed uppercase tracking-widest text-center shadow-lg animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="flex flex-col gap-6">
                    {isSignUp && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest dark:text-white/30 text-black/30 ml-4">Full_Name</label>
                            <input
                                type="text"
                                placeholder="Identification Record"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:dark:bg-white/10 focus:bg-black/10 transition-all dark:text-white text-black"
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest dark:text-white/30 text-black/30 ml-4">Protocol_Email</label>
                        <input
                            type="email"
                            placeholder="user@athena.net"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:dark:bg-white/10 focus:bg-black/10 transition-all dark:text-white text-black"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest dark:text-white/30 text-black/30 ml-4">Access_Key</label>
                        <input
                            type="password"
                            placeholder="Symbols & Cyphers"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="glass-apple bg-black/5 dark:bg-white/5 border-none px-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:dark:bg-white/10 focus:bg-black/10 transition-all dark:text-white text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-apple mt-6 py-6 font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm border-none"
                    >
                        {loading ? 'Executing_Auth...' : (isSignUp ? 'Initialize_Account [+]' : 'Authenticate_Identity ->')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[10px] font-black uppercase tracking-widest dark:text-white/30 text-black/30 mt-6 hover:dark:text-white hover:text-black transition-all"
                    >
                        {isSignUp ? 'Already own an identity? Sign In' : 'New to Athena? Initialize Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
