// src/components/landing/WorkProcess.jsx
import { Terminal, HardDrive, Cpu, Flame, Truck } from "lucide-react";

const STAGES = [
  {
    step: "01",
    title: "Consultation & Design",
    desc: "Drafting layout specifications, aesthetic themes, and performance bounds.",
    icon: Terminal
  },
  {
    step: "02",
    title: "Inventory Selection",
    desc: "Sourcing verified components, matching cable sleeving, and custom coolant options.",
    icon: HardDrive
  },
  {
    step: "03",
    title: "Professional Assembly",
    desc: "Precise custom loop bending, cable management, and cleanroom craftsmanship.",
    icon: Cpu
  },
  {
    step: "04",
    title: "Diagnostic Tests",
    desc: "72 hours continuous stress benchmark cycles for absolute system stability.",
    icon: Flame
  },
  {
    step: "05",
    title: "Secure Crated Delivery",
    desc: "Shipped in custom wooden frames, fully plug-and-play ready for setup.",
    icon: Truck
  }
];

export default function WorkProcess() {
  return (
    <section id="work-process" className="py-24 bg-[#0E0F14] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6 text-left relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <p className="font-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase">Our Commissioning Steps</p>
          <h3 className="text-3xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">
            The Commissioning Workflow
          </h3>
          <p className="text-[#9A9DA6] text-xs md:text-sm font-light leading-relaxed max-w-2xl mx-auto">
            From blueprints to your desk, here is how we construct and validate your custom boutique computer rig.
          </p>
        </div>

        {/* Responsive Milestones Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          
          {/* Connecting line for desktop larger screen viewports */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[1px] bg-white/[0.06] z-0"></div>

          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="relative z-10 flex flex-col items-start space-y-5 bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl md:hover:border-[#7C5CFC]/20 transition-all duration-300 group"
              >
                {/* Milestone Node bubble */}
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#9A9DA6] flex items-center justify-center group-hover:bg-[#7C5CFC] group-hover:border-[#7C5CFC] group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-[#6B6E76] uppercase tracking-widest font-black block">
                    STAGE {s.step}
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#EDECE7] group-hover:text-[#C9C2FF] transition-colors duration-300">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#8A8D96] leading-relaxed font-light">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
