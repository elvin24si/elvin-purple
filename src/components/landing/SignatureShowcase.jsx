// src/components/landing/SignatureShowcase.jsx
import { Sparkles, Cpu, Gift, ShieldCheck, Star } from "lucide-react";

const SIGNATURE_RIGS = [
  {
    id: "miyako",
    name: "The Miyako Edition",
    description: "Sakura-pink and silver anodized accents. Features customized cables and a custom matching acrylic character standee inside the chassis.",
    gpu: "RTX 4080 Super",
    cpu: "Ryzen 7 7800X3D",
    cooling: "Hardline Loops",
    image: "https://i.imgur.com/sFanPRj.jpeg"
  },
  {
    id: "ayaka",
    name: "The Ayaka Edition",
    description: "Ice-blue frosted themes with clear liquid coolant. Complete with custom etched tempered glass insignias and custom braided lines.",
    gpu: "RTX 4090 Founders",
    cpu: "Ryzen 9 7950X3D",
    cooling: "Clear Dual Radiator",
    image: "https://sc04.alicdn.com/kf/H2cadc07ed1314493a7b5d6008049ec41e.jpg"
  }
];

const MERCH_PACK = {
  title: "Premium Collectors Pack",
  description: "Included universally with every Signature Series build commission. Handcrafted desk collectibles matching your selected system theme.",
  items: [
    "Theme Acrylic Character Standee",
    "Artisan Anodized Metal Escape Keycap",
    "Laser-Etched Metal Crest Keychain",
    "Textured Case Back-Plate Vinyl Wrap"
  ],
  imageUrlPlaceholder: "https://i.imgur.com/azCFDtG.jpeg"
};

export default function SignatureShowcase() {
  return (
    <section id="signature" className="py-24 bg-[#0B0C10] border-t border-white/[0.08] relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-10 pointer-events-none bg-[#7C5CFC]/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 rounded-full px-4 py-1">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9C2FF] font-bold">
              Limited Masterpieces
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">
            The Signature Series
          </h3>
          <p className="text-[#9A9DA6] text-xs md:text-sm font-light leading-relaxed max-w-2xl mx-auto">
            Numbered custom rigs highlighting high-level craftsmanship, theme aesthetics, and exclusive collectors' merchandise.
          </p>
        </div>

        {/* 2-Column Responsive Layout: PCs on left, Merchandise on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left Column: Signature Systems Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#6B6E76] border-b border-white/[0.06] pb-2">
              Featured Systems Gallery
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
              {SIGNATURE_RIGS.map((rig) => (
                <div
                  key={rig.id}
                  className="bg-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#7C5CFC]/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] bg-white/[0.02] border-b border-white/[0.06] relative">
                    <img
                      src={rig.image}
                      alt={rig.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-[#C9C2FF]">
                      {rig.gpu}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-bold text-sm text-[#EDECE7] uppercase tracking-wide">{rig.name}</h5>
                    <p className="text-[11px] text-[#8A8D96] leading-relaxed font-light">{rig.description}</p>
                    <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[9px] font-mono text-[#6B6E76] uppercase">
                      <span>CPU: {rig.cpu.split(" ")[1]}</span>
                      <span>Loop: {rig.cooling}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Merchandise Showcase */}
          <div className="lg:col-span-5 bg-[#0E0F14] border border-white/[0.06] rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFC]/5 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="space-y-6">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#6B6E76] border-b border-white/[0.06] pb-2 flex justify-between items-center">
                <span>Exclusive Add-Ons</span>
                <span className="text-[#A78BFA] flex items-center gap-1">
                  <Gift className="w-3 h-3" /> INCLUDED
                </span>
              </h4>

              {/* Universal Merchandise Image Box */}
              <div className="rounded-xl border border-white/[0.08] bg-black/40 overflow-hidden aspect-[1.5/1]">
                <img
                  src={MERCH_PACK.imageUrlPlaceholder}
                  alt={MERCH_PACK.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-[#F4F3EF] uppercase tracking-wide text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#A78BFA] fill-[#A78BFA]" />
                  {MERCH_PACK.title}
                </h5>
                <p className="text-[11px] text-[#8A8D96] leading-relaxed font-light">
                  {MERCH_PACK.description}
                </p>
              </div>

              {/* Items List */}
              <ul className="space-y-2 pt-2">
                {MERCH_PACK.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-[#EDECE7] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/[0.06] text-[8px] font-mono text-[#5A5D65] uppercase tracking-widest text-center mt-6">
              * Limited run: only 50 serial-coded systems per year.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
