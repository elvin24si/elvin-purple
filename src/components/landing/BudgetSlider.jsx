// src/components/landing/BudgetSlider.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Monitor, Cpu, Flame, Layers } from "lucide-react";
import { Button } from "../ui/button";

export default function BudgetSlider() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(35000000);

  const getSimulatorRecommendation = (val) => {
    if (val < 25000000) {
      return {
        tier: "Standard Core System",
        experience: "Optimized for fluid 1440p gaming, office workloads, and home media.",
        gpu: "NVIDIA RTX 4060 Ti 16GB",
        cpu: "AMD Ryzen 5 7600 (6 Cores)",
        gamingFeel: "85 FPS · 1440p High",
        creationFeel: "Standard Render Speed",
        silentFeel: "Quiet Operation",
        model: "STORM BREAKER",
        gamingScore: 45,
        creationScore: 40,
        silentScore: 60
      };
    } else if (val < 45000000) {
      return {
        tier: "Professional Mid-Range System",
        experience: "Designed for high-frame rate 1440p gaming, 4K rendering, and fast file exports.",
        gpu: "NVIDIA RTX 4070 Super 12GB",
        cpu: "Intel Core i7-14700K (20 Cores)",
        gamingFeel: "120 FPS · 1440p Ultra",
        creationFeel: "Accelerated timeline encoding",
        silentFeel: "Whisper-quiet fans",
        model: "NEBULA STRIKE",
        gamingScore: 75,
        creationScore: 70,
        silentScore: 80
      };
    } else if (val < 60000000) {
      return {
        tier: "Signature Elite System",
        experience: "Premium liquid-cooled setup. Native 4K gaming and professional 3D viewport rendering.",
        gpu: "NVIDIA RTX 4080 Super 16GB",
        cpu: "AMD Ryzen 7 7800X3D (V-Cache)",
        gamingFeel: "75 FPS · Native 4K Ultra",
        creationFeel: "Accelerated 3D rendering",
        silentFeel: "Liquid-cooled silence",
        model: "SIGNATURE // MIYAKO",
        gamingScore: 92,
        creationScore: 85,
        silentScore: 95
      };
    } else {
      return {
        tier: "Signature Flagship System",
        experience: "Ultimate performance design. Custom hardline liquid loop, premium layout, and peak compute power.",
        gpu: "NVIDIA RTX 4090 24GB Founders Edition",
        cpu: "AMD Ryzen 9 7950X3D (16 Cores)",
        gamingFeel: "115 FPS · Native 4K Ultra RT",
        creationFeel: "Production-grade render speed",
        silentFeel: "Custom loop ultra-quiet",
        model: "SIGNATURE // AYAKA",
        gamingScore: 100,
        creationScore: 100,
        silentScore: 99
      };
    }
  };

  const rec = getSimulatorRecommendation(budget);

  const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <section id="simulator" className="py-24 bg-[#08090C] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Range Input and recommended model */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 text-left">
              <p className="font-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase">Interactive Estimator</p>
              <h3 className="text-3xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">Benchmark Simulator</h3>
              <p className="text-[#9A9DA6] text-sm leading-relaxed font-light">
                Select your target budget below. Our calculator dynamically projects system performance indices and recommends matching boutique rigs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.06] backdrop-blur-md space-y-8">
              {/* Budget Display */}
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]">Target Budget</span>
                <span className="font-mono text-2xl font-bold text-[#F4F3EF] tabular-nums">{formatIDR(budget)}</span>
              </div>

              {/* Slider Input */}
              <div className="space-y-4">
                <input
                  type="range"
                  min="15000000"
                  max="75000000"
                  step="500000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7C5CFC] focus:outline-none"
                />
                <div className="flex justify-between font-mono text-[8px] uppercase tracking-widest text-[#5A5D65]">
                  <span>Rp 15M (Core)</span>
                  <span>Rp 45M (Elite)</span>
                  <span>Rp 75M (Ultimate)</span>
                </div>
              </div>

              {/* Recommended Build Card */}
              <div className="pt-6 border-t border-white/[0.06] space-y-4 text-left">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#6B6E76]">Recommended Hardware Profile</p>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/[0.02] p-5 border border-white/[0.08] rounded-xl hover:border-[#7C5CFC]/20 transition-all duration-300">
                  <div>
                    <h4 className="font-bold text-[#C9C2FF] uppercase tracking-wide text-sm">{rec.model}</h4>
                    <p className="font-mono text-[9px] text-[#6B6E76] uppercase mt-1">{rec.tier}</p>
                    <p className="text-[11px] text-[#8A8D96] mt-2 line-clamp-2 font-light leading-relaxed max-w-[240px]">
                      {rec.experience}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/guestCatalog")}
                    className="self-start sm:self-center bg-white/[0.03] hover:bg-white/[0.07] text-[#EDECE7] border border-white/10 text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg cursor-pointer"
                  >
                    View Models
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Performance Projections */}
          <div className="lg:col-span-7 bg-[#0E0F14] border border-white/[0.06] rounded-3xl p-8 md:p-10 space-y-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C5CFC]/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4F3EF] flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Terminal className="w-4 h-4 text-[#A78BFA]" />
              Real-time Output Specifications
            </h4>

            {/* Simulated Load Progress Bars */}
            <div className="space-y-6">
              {/* Gaming FPS */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#9A9DA6] flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-[#6B6E76]" />
                    Gaming Target (4K presets)
                  </span>
                  <span className="font-mono text-[#C9C2FF] font-bold">{rec.gamingFeel}</span>
                </div>
                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA] transition-all duration-500 rounded-full"
                    style={{ width: `${rec.gamingScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Creative Speed */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#9A9DA6] flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-[#6B6E76]" />
                    Render Timeline & AI Training Speed
                  </span>
                  <span className="font-mono text-[#C9C2FF] font-bold">{rec.creationFeel}</span>
                </div>
                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#D97757] transition-all duration-500 rounded-full"
                    style={{ width: `${rec.creationScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Acoustic/Thermal index */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#9A9DA6] flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-[#6B6E76]" />
                    Acoustic Quietness & Thermal Index
                  </span>
                  <span className="font-mono text-[#C9C2FF] font-bold">{rec.silentFeel}</span>
                </div>
                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-[#A78BFA] to-cyan-500 transition-all duration-500 rounded-full"
                    style={{ width: `${rec.silentScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Spec Footprints details */}
            <div className="pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
              <div className="bg-white/[0.01] border border-white/[0.06] p-4 rounded-xl">
                <p className="font-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">Est. Graphics Processing Unit</p>
                <p className="text-xs text-[#EDECE7] font-semibold mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"></span>
                  {rec.gpu}
                </p>
              </div>
              <div className="bg-white/[0.01] border border-white/[0.06] p-4 rounded-xl">
                <p className="font-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">Est. Processor Unit</p>
                <p className="text-xs text-[#EDECE7] font-semibold mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]"></span>
                  {rec.cpu}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
