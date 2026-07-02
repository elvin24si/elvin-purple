// src/pages/Landing.jsx
import NewNavbar from "../components/NewNavbar";
import Hero from "../components/Hero";
import { Cpu, Terminal, Flame, Shield, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HIGHLIGHTS = [
  {
    icon: Terminal,
    title: "1. Design Consultation",
    desc: "Collaborate with our system architects to outline performance goals, layout parameters, and aesthetic guidelines."
  },
  {
    icon: Cpu,
    title: "2. Handcrafted Assembly",
    desc: "Rigid cleanroom custom loop routing, clean cabling channels, and premium thermal paste applications by master technicians."
  },
  {
    icon: Flame,
    title: "3. 72h Stress Testing",
    desc: "Rigorous diagnostic checks, clock speed stability tuning, and thermal profile verifications to ensure out-of-the-box reliability."
  },
  {
    icon: Shield,
    title: "4. Premium Protection",
    desc: "Every system is backed by a 5-year full components warranty and lifetime customer support."
  }
];

export default function Landing() {
  return (
    <div className="bg-[#08090C] text-[#EDECE7] min-h-screen font-sans antialiased overflow-x-hidden selection:bg-[#7C5CFC] selection:text-white">
      {/* Dynamic Font Imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .ff-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Header Sticky Navbar */}
      <NewNavbar />

      {/* Hero Section */}
      <Hero />

      {/* Features / Crafting Process Section */}
      <section id="features" className="py-24 border-t border-white/[0.08] bg-[#0E0F14] relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full blur-[120px] opacity-10 pointer-events-none bg-[#7C5CFC]/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <p className="font-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase">Engineering Workflow</p>
            <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">
              How We Build Your Dream Machine
            </h3>
            <p className="text-[#9A9DA6] text-sm md:text-base font-light leading-relaxed">
              We reject standard mass manufacturing. Every WhiteFrame Labs system undergoes an elite, individualized assembly process.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] hover:border-[#7C5CFC]/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center border border-[#7C5CFC]/20 text-[#A78BFA] group-hover:bg-[#7C5CFC] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="ff-display text-base font-bold text-[#F4F3EF]">{item.title}</h4>
                    <p className="text-xs text-[#8A8D96] leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing / Callout CTA Section */}
      <section id="pricing" className="py-24 border-t border-white/[0.08] bg-[#08090C] relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-white/[0.01] to-white/[0.03] border border-white/[0.08] p-8 md:p-12 text-center overflow-hidden flex flex-col items-center justify-center space-y-6 shadow-2xl">
            {/* Ambient inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-25 pointer-events-none bg-[#7C5CFC]/20"></div>

            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-3 py-1 rounded-full relative z-10">
              Ready to Upgrade?
            </span>
            
            <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#F4F3EF] max-w-2xl relative z-10">
              Draft Your System Specifications.
            </h3>
            
            <p className="text-[#9A9DA6] text-sm md:text-base font-light max-w-xl relative z-10 leading-relaxed">
              Unlock access to real-time custom rig simulation, parts compatibility checking, and direct technical consultations.
            </p>

            <div className="pt-4 relative z-10">
              <Link 
                to="/guestCatalog"
                className="inline-flex items-center gap-2 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-[#7C5CFC]/20 group"
              >
                Browse Systems Catalog
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.06] bg-[#0E0F14]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#EDECE7]">
              White<span className="text-[#A78BFA]">Frame</span> Labs
            </h4>
            <p className="text-[10px] text-[#6B6E76] uppercase tracking-[0.2em] mt-1">Premium Boutique Custom PC shop</p>
          </div>
          
          <div className="flex gap-6 text-[10px] font-semibold uppercase tracking-widest text-[#6B6E76]">
            <a href="#features" className="hover:text-[#EDECE7] transition-colors">Process</a>
            <a href="#pricing" className="hover:text-[#EDECE7] transition-colors">Pricing</a>
            <Link to="/guestCatalog" className="hover:text-[#EDECE7] transition-colors">Catalog</Link>
            <Link to="/old-landing" className="hover:text-[#EDECE7] transition-colors">Legacy Version</Link>
          </div>
          
          <p className="text-[9px] font-mono text-[#5A5D65] uppercase tracking-widest">
            &copy; 2026 WhiteFrame Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}