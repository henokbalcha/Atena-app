"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star } from "lucide-react";

export function ReviewForm({ appId }: { appId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("reviews").insert([
      {
        app_id: appId,
        user_name: name || "Anonymous User",
        rating,
        comment,
      },
    ]);

    if (!error) {
      setSuccess(true);
      setComment("");
      setName("");
      setRating(5);
    }
    setSubmitting(false);
  };

  if (success) return (
    <div className="glass-apple p-12 rounded-[3.5rem] border-white/5 text-center animate-in fade-in zoom-in duration-500">
       <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star fill="#0A84FF" className="text-accent-blue" />
       </div>
       <h4 className="text-xl font-bold mb-2 uppercase italic tracking-tight">Feedback_Integrated</h4>
       <p className="text-sm font-medium text-white/30 italic">Thank you for contributing to the Athena network.</p>
       <button onClick={() => setSuccess(false)} className="mt-8 text-[10px] font-black uppercase tracking-widest text-accent-blue hover:text-white transition-colors">Submit_Another [+]</button>
    </div>
  );

  return (
    <div className="glass-apple p-12 rounded-[4rem] border-white/5 relative overflow-hidden group">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"></div>

      <h3 className="text-3xl font-bold mb-10 uppercase italic">Add Artifact Insight</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        <div className="flex flex-col gap-3">
           <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">User_Identification</label>
           <input
             required
             placeholder="Athena ID or Name"
             className="glass-apple bg-white/5 border-none px-8 py-5 rounded-3xl text-sm font-bold outline-none focus:bg-white/10 transition-all placeholder:text-white/10"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />
        </div>

        <div className="flex flex-col gap-3">
           <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Network_Trust_Rating</label>
           <div className="flex gap-4 p-4 glass-apple w-fit rounded-full border-white/5">
             {[1, 2, 3, 4, 5].map((star) => (
               <button
                 key={star}
                 type="button"
                 onClick={() => setRating(star)}
                 className={`p-2 transition-all duration-300 ${rating >= star ? "text-yellow-400 scale-125" : "text-white/10 hover:text-white/20"}`}
               >
                 <Star fill={rating >= star ? "currentColor" : "none"} size={24} />
               </button>
             ))}
           </div>
        </div>

        <div className="flex flex-col gap-3">
           <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4">Deep_Analysis (Comment)</label>
           <textarea
             required
             rows={3}
             placeholder="Synchronizing your thoughts with the community..."
             className="glass-apple bg-white/5 border-none px-8 py-6 rounded-3xl text-sm font-medium outline-none focus:bg-white/10 transition-all resize-none placeholder:text-white/10"
             value={comment}
             onChange={(e) => setComment(e.target.value)}
           />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-apple-glass !py-6 w-full font-black uppercase tracking-[0.5em] hover:scale-[1.02] shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-95 transition-all mt-4"
        >
          {submitting ? "UPLOADING_FEEDBACK..." : "PUBLISH_INSIGHT [+]" }
        </button>
      </form>
    </div>
  );
}
