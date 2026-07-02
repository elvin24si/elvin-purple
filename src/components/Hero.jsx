// src/components/Hero.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Cpu, HardDrive, ShieldCheck, Zap } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session in Hero", e);
      }
    }
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/register";
    return (user.role || "").toLowerCase() === "admin" ? "/dashboard" : "/member";
  };

  const handlePrimaryClick = () => {
    navigate(getDashboardPath());
  };

  const handleSecondaryClick = (e) => {
    e.preventDefault();
    const catalogElement = document.getElementById("features");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/guestCatalog");
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center pt-8 pb-16 overflow-hidden bg-[#08090C] text-[#EDECE7]">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-20 pointer-events-none bg-[#7C5CFC]/20"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-15 pointer-events-none bg-[#D97757]/20"></div>
        
        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,252,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,252,0.04)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_95%)] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-sm self-start animate-in fade-in slide-in-from-top-4 duration-500">
              <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9C2FF]">
                Bespoke PC Architecture · Hand-Assembled
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-[#F4F3EF] max-w-2xl">
                Next-Gen Custom Rigs.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#7C5CFC] to-[#D97757] animate-pulse">
                  Engineered to Dominate.
                </span>
              </h2>
              <p className="text-[#9A9DA6] text-sm md:text-base font-light leading-relaxed max-w-xl">
                We design and handcraft breathtaking, high-performance computing systems. Tailored for deep learning training, 8K video timelines, and absolute gaming stability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button
                onClick={handlePrimaryClick}
                className="w-full sm:w-auto bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-[0.15em] px-8 py-5 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-xl hover:shadow-[#7C5CFC]/25 active:scale-95 cursor-pointer group"
              >
                {user ? "Go to Dashboard" : "Get Started Now"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSecondaryClick}
                className="w-full sm:w-auto border-white/10 hover:bg-white/[0.05] text-[#EDECE7] text-xs font-bold uppercase tracking-[0.15em] px-8 py-5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Features
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.08] max-w-lg">
              <div>
                <p className="font-mono text-xl md:text-2xl font-bold text-[#C9C2FF]">5-Year</p>
                <p className="text-[9px] uppercase tracking-widest text-[#6B6E76] mt-1">Full Warranty</p>
              </div>
              <div>
                <p className="font-mono text-xl md:text-2xl font-bold text-[#C9C2FF]">72h</p>
                <p className="text-[9px] uppercase tracking-widest text-[#6B6E76] mt-1">Stress Tested</p>
              </div>
              <div>
                <p className="font-mono text-xl md:text-2xl font-bold text-[#C9C2FF]">0dB</p>
                <p className="text-[9px] uppercase tracking-widest text-[#6B6E76] mt-1">Acoustic Spec</p>
              </div>
            </div>
          </div>

          {/* Right Column: Stylized interactive Rig display */}
          <div className="lg:col-span-5 relative flex justify-center items-center lg:mt-0 mt-8">
            <div className="relative w-80 h-96 md:w-96 md:h-[450px] bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col justify-between group hover:border-[#7C5CFC]/30 transition-all duration-500">
              
              {/* Internal neon ambient loop */}
              <div className="absolute top-10 left-10 w-24 h-48 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-24 h-48 bg-[#7C5CFC]/10 rounded-full blur-[40px] pointer-events-none animate-pulse"></div>

              {/* Top cooling fans graphic */}
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                <span className="font-mono text-[9px] text-[#6B6E76] tracking-widest uppercase">Upper Fan Array [AIO]</span>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full border border-[#7C5CFC]/40 flex items-center justify-center animate-spin duration-1000">
                    <div className="w-1 h-3 bg-[#A78BFA] rounded-full"></div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-[#7C5CFC]/40 flex items-center justify-center animate-spin duration-1000">
                    <div className="w-1 h-3 bg-[#A78BFA] rounded-full"></div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-[#7C5CFC]/40 flex items-center justify-center animate-spin duration-1000">
                    <div className="w-1 h-3 bg-[#A78BFA] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Main Core Architecture representation */}
              <div className="flex-1 my-6 relative border border-white/[0.04] bg-black/20 rounded-xl p-4 flex flex-col justify-between">
                
                {/* Motherboard socket & RAM */}
                <div className="flex justify-between items-start">
                  {/* CPU Socket Block */}
                  <div className="p-3 bg-white/[0.02] border border-white/[0.1] rounded-lg flex flex-col items-center justify-center">
                    <Cpu className="w-6 h-6 text-[#A78BFA]" />
                    <span className="font-mono text-[8px] mt-1 text-[#C9C2FF]">SOCKET v4</span>
                  </div>

                  {/* RAM Modules */}
                  <div className="flex gap-1.5 h-12 items-end">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-1.5 h-full rounded bg-white/[0.04] border border-white/[0.08] relative">
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#A78BFA] opacity-30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated Liquid Tubes */}
                <div className="absolute top-10 left-12 right-20 h-16 pointer-events-none opacity-40">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path d="M 10,10 Q 50,40 90,10" fill="none" stroke="#7C5CFC" strokeWidth="1.5" strokeDasharray="4 2" className="animate-pulse" />
                    <path d="M 10,20 Q 50,48 90,20" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="6 3" />
                  </svg>
                </div>

                {/* GPU Block */}
                <div className="bg-white/[0.03] border border-white/[0.1] p-3 rounded-lg relative overflow-hidden flex justify-between items-center group-hover:border-[#7C5CFC]/40 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-[#D97757]" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-wide text-white">RTX 4090 SUPER</p>
                      <p className="text-[7px] text-[#6B6E76] font-mono">LIQUID WRAPPED CORE</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Bottom Power & Diagnostics */}
              <div className="flex justify-between items-center border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[8px] text-[#9A9DA6] tracking-widest uppercase">System status: OK</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
