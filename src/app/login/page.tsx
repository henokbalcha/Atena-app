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
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });
                if (error) throw error;
                setError("Verification email sent! Please check your inbox.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/publish");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen liquid-bg flex items-center justify-center p-6">
            {/* Nav Back */}
            <Link href="/" className="fixed top-12 left-12 flex items-center gap-2 text-white/40 hover:text-white transition-all group">
               <ArrowLeft size={16} />
               <span className="text-[10px] font-black tracking-widest uppercase">Root_System</span>
            </Link>

            <div className="glass-apple p-12 md:p-16 rounded-[4rem] w-full max-w-xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
                <div className="flex flex-col items-center mb-12">
                   <div className="w-20 h-20 glass-apple rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                      <ShieldCheck size={32} className="text-accent-blue" />
                   </div>
                   <h1 className="text-4xl font-bold tracking-tight text-white mb-2">ATHENA_AUTH</h1>
                   <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">Unified Network Credentials</p>
                </div>

                {error && (
                    <div className="p-5 glass-apple border-red-500/20 text-red-400 rounded-2xl mb-8 text-xs font-bold leading-relaxed uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="flex flex-col gap-6">
                    {isSignUp && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Full_Name</label>
                            <input
                                type="text"
                                placeholder="Identification Record"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="glass-apple bg-white/5 border-none px-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:bg-white/10 transition-all"
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Protocol_Email</label>
                        <input
                            type="email"
                            placeholder="user@athena.net"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="glass-apple bg-white/5 border-none px-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Access_Key</label>
                        <input
                            type="password"
                            placeholder="Symbols & Cyphers"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="glass-apple bg-white/5 border-none px-8 py-5 rounded-[2rem] text-sm font-bold outline-none focus:bg-white/10 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-apple mt-6 py-6 font-black uppercase tracking-[0.3em]"
                    >
                        {loading ? 'Executing_Auth...' : (isSignUp ? 'Initialize_Account [+]' : 'Log_In ->')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-6 hover:text-white transition-all"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : 'New to Athena? Create Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
