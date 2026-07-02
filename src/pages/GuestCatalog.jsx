// src/pages/GuestCatalog.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewNavbar from "../components/NewNavbar";
import PCCard from "../components/PCCard";
import { fetchPCCatalog, normalizePC } from "../lib/supabasepc";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

export default function GuestCatalog() {
  const navigate = useNavigate();
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const filteredPCs = useMemo(() => {
    return pcData.filter((pc) => {
      const matchesSearch = 
        pc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pc.specs.cpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pc.specs.gpu.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || 
        pc.category.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [pcData, searchTerm, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-[#08090C] text-[#EDECE7] selection:bg-[#7C5CFC]/30 relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-15 pointer-events-none bg-[#7C5CFC]/10"></div>
        <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-10 pointer-events-none bg-[#D97757]/10"></div>
        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,252,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_95%)] pointer-events-none"></div>
      </div>

      {/* Sticky Header Navbar */}
      <NewNavbar />

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 relative z-10 text-left">
        
        {/* Page Title Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 rounded-full px-3.5 py-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9C2FF] font-bold">
              Systems Catalog
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">
            Explore Custom Rigs
          </h2>
          <p className="text-[#9A9DA6] text-xs md:text-sm font-light leading-relaxed">
            Select a base template below to inspect detailed components specifications and hardware layout structures. Create a member account to personalize options.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white/[0.01] border border-white/[0.06] p-4 rounded-xl mb-12 backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex bg-white/[0.02] p-1 border border-white/[0.06] rounded-lg self-start">
            {["All", "Signature", "Standard"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#7C5CFC] text-white"
                    : "text-[#6B6E76] hover:text-[#EDECE7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6E76]" />
            <input
              type="text"
              placeholder="Search by model, CPU, GPU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] outline-none transition-all text-xs text-[#EDECE7] placeholder-[#5A5D65]"
            />
          </div>
        </div>

        {/* Data Grid Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-[#A78BFA] animate-spin" />
            <span className="font-mono text-xs text-[#6B6E76] uppercase tracking-widest">Querying custom catalog...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white/[0.01] border border-white/[0.06] rounded-2xl">
            <p className="text-sm text-red-400 font-medium">Failed to retrieve catalog: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-white/[0.03] hover:bg-white/[0.06] text-white border border-white/10 px-4 py-2 text-xs flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
            </Button>
          </div>
        ) : filteredPCs.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] border border-white/[0.06] rounded-2xl">
            <p className="text-sm text-[#6B6E76]">No configurations match your current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPCs.map((pc) => (
              <div 
                key={pc.id} 
                className="bg-[#0F1115]/30 border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-4 transition-all duration-300 relative group"
              >
                <PCCard pc={pc} />
                <div className="absolute inset-0 bg-transparent group-hover:bg-[#08090C]/5 transition-colors pointer-events-none rounded-2xl" />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Sticky Bottom CTA Banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-3xl bg-[#0F1115]/80 backdrop-blur-xl border border-white/[0.06] px-6 py-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] z-50">
        <div className="text-center sm:text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Ready to customize your build?</h3>
          <p className="text-[10px] text-[#6B6E76] mt-0.5">Register as a member to customize parts, view metrics, and place orders.</p>
        </div>
        <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-center">
          <Link 
            to="/login" 
            className="text-[10px] font-bold uppercase tracking-widest text-[#9A9DA6] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#7C5CFC]/20 active:scale-95 text-center w-full sm:w-auto"
          >
            Create Account
          </Link>
        </div>
      </div>

    </div>
  );
}