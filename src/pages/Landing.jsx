// src/pages/Landing.jsx
import NewNavbar from "../components/NewNavbar";
import Hero from "../components/Hero";
import BudgetSlider from "../components/landing/BudgetSlider";
import SignatureShowcase from "../components/landing/SignatureShowcase";
import CatalogPreview from "../components/landing/CatalogPreview";
import PointsEconomy from "../components/landing/PointsEconomy";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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

      {/* 1. Dynamic Budget & Performance Estimator */}
      <BudgetSlider />

      {/* 2. Signature Series Showcase */}
      <SignatureShowcase />

      {/* 3. Curated Catalog Preview Grid */}
      <CatalogPreview />

      {/* 4. Points & Merch Economy ("Gamer Rewards") */}
      <PointsEconomy />

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
            <a href="#simulator" className="hover:text-[#EDECE7] transition-colors">Estimator</a>
            <a href="#signature" className="hover:text-[#EDECE7] transition-colors">Signature</a>
            <a href="#catalog-preview" className="hover:text-[#EDECE7] transition-colors">Curated</a>
            <a href="#points-economy" className="hover:text-[#EDECE7] transition-colors">Rewards</a>
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