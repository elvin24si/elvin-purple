// src/components/landing/CatalogPreview.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchPCCatalog, normalizePC } from "../../lib/supabasepc";
import { Cpu, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const FALLBACK_PCS = [
  {
    id: "pc-fallback-1",
    name: "The Esports Elite",
    category: "Signature",
    image: "https://via.placeholder.com/400x500",
    price: 35990000,
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "NVIDIA RTX 4080 Super 16GB",
      ram: "32GB DDR5 7200MHz"
    }
  },
  {
    id: "pc-fallback-2",
    name: "The Cinema Studio",
    category: "Signature",
    image: "https://via.placeholder.com/400x500",
    price: 52990000,
    specs: {
      cpu: "Intel Core i9-14900KS",
      gpu: "NVIDIA RTX 4090 FE 24GB",
      ram: "64GB DDR5 6400MHz"
    }
  },
  {
    id: "pc-fallback-3",
    name: "The Stealth Architect",
    category: "Standard",
    image: "https://via.placeholder.com/400x500",
    price: 28990000,
    specs: {
      cpu: "Intel Core i7-14700",
      gpu: "NVIDIA RTX 4070 Ti Super 16GB",
      ram: "32GB DDR5 6000MHz"
    }
  }
];

export default function CatalogPreview() {
  const navigate = useNavigate();
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPCCatalog()
      .then((rows) => {
        const normalized = rows.map(normalizePC);
        // Take popular/signature pre-built custom PCs
        const filtered = normalized.slice(0, 4);
        if (filtered.length > 0) {
          setPcs(filtered);
        } else {
          setPcs(FALLBACK_PCS);
        }
      })
      .catch((err) => {
        console.error("Failed to load catalog preview", err);
        setPcs(FALLBACK_PCS);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <section id="catalog-preview" className="py-24 bg-[#08090C] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4 text-left">
          <div className="space-y-3">
            <p className="font-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase">Featured Builds</p>
            <h3 className="text-3xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">Curated Catalog Rigs</h3>
            <p className="text-[#9A9DA6] text-sm font-light max-w-xl">
              Explore our top-selling handcrafted desktop computer configurations. Fully validated under heavy multi-threaded test cycles.
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/guestCatalog")}
            className="group shrink-0 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg shadow-[#7C5CFC]/20 cursor-pointer"
          >
            Explore Full Catalog
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#A78BFA] animate-spin" />
            <span className="font-mono text-xs text-[#6B6E76] uppercase tracking-widest">Accessing Database catalog...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pcs.map((pc) => (
              <div
                key={pc.id}
                onClick={() => navigate("/guestCatalog")}
                className="group cursor-pointer flex flex-col bg-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#7C5CFC]/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#7C5CFC]/10"
              >
                {/* Product image container */}
                <div className="aspect-[4/5] bg-white/[0.02] overflow-hidden relative border-b border-white/[0.06]">
                  <img
                    src={pc.image}
                    alt={pc.name}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x500?text=WhiteFrame+Rig";
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-[#08090C]/80 backdrop-blur-sm border border-white/[0.08] rounded-full px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-[#C9C2FF]">
                    {pc.category}
                  </div>
                </div>

                {/* Specs and Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-[#EDECE7] uppercase tracking-wide text-xs group-hover:text-[#C9C2FF] transition-colors line-clamp-2">
                        {pc.name}
                      </h4>
                      <span className="font-mono text-xs font-black text-[#D97757] tabular-nums whitespace-nowrap shrink-0">
                        {formatIDR(pc.price)}
                      </span>
                    </div>
                    
                    {/* GPU/CPU quick readout */}
                    <div className="pt-2 flex flex-col gap-1 text-[10px] text-[#6B6E76] font-mono uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 truncate">
                        <Cpu className="w-3.5 h-3.5 text-[#6B6E76] shrink-0" />
                        {pc.specs?.cpu || "—"}
                      </span>
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="w-3.5 h-3.5 border border-[#6B6E76]/50 rounded-sm flex items-center justify-center font-bold text-[7px] leading-none shrink-0">GPU</span>
                        {pc.specs?.gpu || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-[#A78BFA] group-hover:text-[#C9C2FF] pt-3.5 border-t border-white/[0.06]">
                    <span>Configure System</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
