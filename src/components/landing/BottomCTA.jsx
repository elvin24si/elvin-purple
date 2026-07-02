// src/components/landing/BottomCTA.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export default function BottomCTA() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user in BottomCTA", e);
      }
    }
  }, []);

  const handleCTAClick = () => {
    if (user) {
      const path = (user.role || "").toLowerCase() === "admin" ? "/dashboard" : "/member";
      navigate(path);
    } else {
      navigate("/register");
    }
  };

  return (
    <section className="py-28 bg-[#08090C] border-t border-white/[0.08] relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-10 pointer-events-none bg-[#7C5CFC]/15"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8 flex flex-col items-center justify-center">
        
        <div className="inline-flex items-center gap-2 bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 rounded-full px-4 py-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9C2FF] font-bold">
            Commission Queue Open
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#F4F3EF] leading-tight">
            Ready to Build Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#7C5CFC] to-[#D97757]">
              Dream Machine?
            </span>
          </h3>
          <p className="text-[#9A9DA6] text-xs md:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Reserve your system queue slot today. Join as a member to configure options, view real-time price matrices, and verify diagnostic ratings.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleCTAClick}
            className="group bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest px-8 py-5 rounded-lg flex items-center gap-2.5 transition-all duration-300 hover:shadow-2xl hover:shadow-[#7C5CFC]/30 active:scale-95 cursor-pointer"
          >
            {user ? "Go to Dashboard" : "Build Your Dream PC"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Footer Utility Links */}
        <div className="w-full pt-16 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-semibold uppercase tracking-widest text-[#6B6E76] mt-12">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-[#EDECE7]">
              White<span className="text-[#A78BFA]">Frame</span> Labs
            </h4>
            <p className="text-[9px] text-[#5A5D65] uppercase tracking-[0.2em] mt-1">Premium Boutique Custom PC shop</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#simulator" className="hover:text-[#EDECE7] transition-colors">Estimator</a>
            <a href="#signature" className="hover:text-[#EDECE7] transition-colors">Signature</a>
            <a href="#catalog-preview" className="hover:text-[#EDECE7] transition-colors">Curated</a>
            <a href="#points-economy" className="hover:text-[#EDECE7] transition-colors">Rewards</a>
            <Link to="/guestCatalog" className="hover:text-[#EDECE7] transition-colors">Catalog</Link>
            <Link to="/old-landing" className="hover:text-[#EDECE7] transition-colors">Legacy View</Link>
          </div>

          <p className="text-[9px] font-mono text-[#5A5D65] uppercase tracking-widest">
            &copy; 2026 WhiteFrame Labs. All rights reserved.
          </p>
        </div>

      </div>
    </section>
  );
}
