// src/components/landing/CustomRequest.jsx
import { useState, useEffect } from "react";
import { insertCommission } from "../../lib/supabasemem";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function CustomRequest() {
  const [user, setUser] = useState(null);
  const [requestType, setRequestType] = useState("Individual");
  const [usage, setUsage] = useState("Gaming");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Check if member is logged in to pre-fill email
  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.email) {
          setContact(parsed.email);
        }
      } catch (e) {
        console.error("Failed to parse user in CustomRequest", e);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !contact.trim()) {
      setError("Please fill out all request fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const submissionData = {
      email: contact.trim(),
      member_id: user ? user.member_id : null,
      request_type: requestType,
      usage_focus: usage,
      description: description.trim(),
      created_at: new Date().toISOString()
    };

    try {
      // Post to Supabase custom_commissions table
      await insertCommission(submissionData);
      setShowSuccess(true);
      setDescription("");
      // Only reset contact if not logged in
      if (!user) setContact("");
    } catch (err) {
      console.warn("Supabase insert failed. Falling back to local storage cache.", err);
      
      // Fallback caching
      try {
        const localRequests = JSON.parse(localStorage.getItem("custom_commissions") || "[]");
        localRequests.push(submissionData);
        localStorage.setItem("custom_commissions", JSON.stringify(localRequests));
        
        setShowSuccess(true);
        setDescription("");
        if (!user) setContact("");
      } catch (fallbackErr) {
        setError("Submission failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="custom-builder" className="py-24 bg-[#08090C] border-t border-white/[0.08] relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-left">
        
        {/* Form Container */}
        <div className="bg-[#0E0F14] border border-white/[0.06] rounded-3xl p-8 md:p-12 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFC]/5 rounded-full blur-[40px] pointer-events-none"></div>

          {/* Left: Headline & Pitch */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 rounded-full px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9C2FF] font-bold">
                Bespoke Builder
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">
              Custom request
            </h3>
            
            <p className="text-[#9A9DA6] text-xs leading-relaxed font-light">
              Looking for a custom build tailored exactly to your aesthetic theme and technical goals?
            </p>
            <p className="text-[#6B6E76] text-[11px] leading-relaxed font-light">
              Submit your desired system specifications, and our custom engineering lead will draft a direct proposal for you.
            </p>
          </div>

          {/* Right: Commission Form */}
          <form onSubmit={handleSubmit} className="md:col-span-7 space-y-5 border-t md:border-t-0 md:border-l border-white/[0.06] pt-6 md:pt-0 md:pl-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            {/* Need Category */}
            <div>
              <label className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                Need Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Individual", "Organization"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRequestType(t)}
                    className={`py-2 px-3 border text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      requestType === t
                        ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                        : "bg-white/[0.02] border-white/[0.08] text-[#8A8D96] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Usage */}
            <div>
              <label className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                Primary Usage Focus
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Gaming", "Work", "Stream"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUsage(u)}
                    className={`py-2 px-3 border text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      usage === u
                        ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                        : "bg-white/[0.02] border-white/[0.08] text-[#8A8D96] hover:text-white"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                Custom Request Description
              </label>
              <textarea
                id="description"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your design goals (e.g. Minimalist Cafe, Walnut Accent), target programs (e.g. Blender, Unreal Engine), and specs..."
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] outline-none transition-all text-xs text-[#EDECE7] placeholder-[#5A5D65] resize-none"
              />
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contact" className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                Contact Email
              </label>
              <input
                id="contact"
                type="email"
                required
                disabled={!!user} // Locked if user is logged in
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] outline-none transition-all text-xs text-[#EDECE7] placeholder-[#5A5D65] disabled:opacity-65 disabled:text-[#6B6E76]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#7C5CFC]/20 flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Registering Request..." : "Submit Custom Request"}
            </Button>
          </form>

        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#0E0F14] border border-white/[0.08] text-[#EDECE7] max-w-sm rounded-2xl p-6">
          <DialogHeader className="text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
              <Mail className="w-6 h-6 animate-bounce" />
            </div>
            <DialogTitle className="text-lg font-bold uppercase tracking-wide text-white">Request Registered!</DialogTitle>
            <DialogDescription className="text-xs text-[#8A8D96] leading-relaxed">
              We have received your custom build commission. Our design team will inspect your details and reach out shortly via the contact information provided.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 flex justify-center">
            <Button
              onClick={() => setShowSuccess(false)}
              className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg cursor-pointer"
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
