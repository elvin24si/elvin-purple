// src/pages/GuestCatalog.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PCCard from "../components/PCCard";
import { fetchPCCatalog, normalizePC } from "../lib/supabasepc";

export default function GuestCatalog() {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPCCatalog()
      .then((rows) => {
        const normalized = rows.map(normalizePC);
        setPcData(normalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#08090C]">
        <div className="inline-flex flex-col items-center gap-4 text-[#6B6E76]">
          <div className="w-8 h-8 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
          <p className="ff-mono text-[10px] uppercase tracking-widest font-medium">Loading Gallery…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#08090C]">
        <div className="text-center">
          <p className="text-sm text-[#E27B7B] font-medium">Failed to load gallery: {error}</p>
        </div>
      </div>
    );
  }

  return (
    /* FILED FIX: Changed max-w-7xl to w-full and added min-h-screen to 
      ensure the background expands edge-to-edge, removing white/gray side bands.
    */
    <div className="w-full min-h-screen bg-[#08090C] text-[#F4F3EF] selection:bg-[#A78BFA]/30 relative overflow-x-hidden">
      
      {/* Blueprint Grid Ambient Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,252,0.03)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top_left,black_30%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-40 relative z-10">
        
        {/* Editorial Header */}
        <div className="max-w-2xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
            <span className="ff-mono text-[9px] uppercase tracking-[0.2em] text-[#A78BFA]">
              Preview Access
            </span>
          </div>
          
          <h1 className="ff-display text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none text-[#F4F3EF]">
            The Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#7C5CFC]">Collection</span>
          </h1>
          
          <p className="text-[#9A9DA6] text-sm md:text-base font-light leading-relaxed max-w-xl">
            Browse our flagship system configurations, precision-engineered for extreme performance. 
            Create an account to unlock custom specifications, live benchmarking, and commissioning modules.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {pcData.map((pc) => (
            <div key={pc.id} className="group relative bg-[#0F1115]/40 border border-white/[0.03] hover:border-white/[0.08] rounded-xl p-4 transition-all duration-300">
              <PCCard pc={pc} />
              {/* Overlay mask hinting interaction limitation */}
              <div className="absolute inset-0 bg-transparent group-hover:bg-[#08090C]/5 transition-colors pointer-events-none rounded-xl" />
            </div>
          ))}
        </div>

        {/* Sticky Conversion Footer */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-3xl bg-[#0F1115]/80 backdrop-blur-xl border border-white/[0.06] px-6 py-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="text-center sm:text-left">
            <h3 className="ff-display text-sm font-bold uppercase tracking-wider text-white">Ready to customize your build?</h3>
            <p className="text-xs text-[#6B6E76] mt-0.5">Join as a member to view live matrix pricing and configure hardware options.</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-center">
            <Link 
              to="/login" 
              className="ff-mono text-[10px] font-bold uppercase tracking-widest text-[#9A9DA6] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white ff-mono text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-[#7C5CFC]/20 active:scale-95 text-center w-full sm:w-auto"
            >
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}