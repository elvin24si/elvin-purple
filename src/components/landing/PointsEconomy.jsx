// src/components/landing/PointsEconomy.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPCCatalog, normalizePC } from "../../lib/supabasepc";
import { Coins, Gift, ArrowRight, Loader2, Star } from "lucide-react";
import { Button } from "../ui/button";

const FALLBACK_ITEMS = [
  {
    id: "pts-fallback-1",
    name: "Character Artisan Keycap",
    pointsPrice: 500,
    category: "Accessory",
    image: "https://via.placeholder.com/200x200?text=Keycap",
    specs: {
      cpu: "Artisan Esc Keycap",
      gpu: "Chibi Metal Base"
    }
  },
  {
    id: "pts-fallback-2",
    name: "Signature Custom Mousepad",
    pointsPrice: 1200,
    category: "Merch",
    image: "https://via.placeholder.com/200x200?text=Mousepad",
    specs: {
      cpu: "900x400mm Fabric Deskmat",
      gpu: "Stitched Borders"
    }
  },
  {
    id: "pts-fallback-3",
    name: "Acoustic RGB Fan Pack (3-in-1)",
    pointsPrice: 2500,
    category: "PC Part",
    image: "https://via.placeholder.com/200x200?text=Fans",
    specs: {
      cpu: "120mm Magnetic Fan Trio",
      gpu: "0dB Acoustic Spec"
    }
  }
];

export default function PointsEconomy() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPCCatalog()
      .then((rows) => {
        const normalized = rows.map(normalizePC);
        // Filter products that support points payments
        const pointsItems = normalized.filter((pc) => pc.allowPointsPayment === true);
        if (pointsItems.length > 0) {
          setRewards(pointsItems.slice(0, 3));
        } else {
          setRewards(FALLBACK_ITEMS);
        }
      })
      .catch((err) => {
        console.error("Failed to load points economy rewards", err);
        setRewards(FALLBACK_ITEMS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="points-economy" className="py-24 bg-[#0E0F14] border-t border-white/[0.08] relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full blur-[130px] opacity-10 pointer-events-none bg-[#7C5CFC]/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Loop explanation */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 rounded-full px-4 py-1 self-start">
                <Coins className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9C2FF]">
                  Gamer Rewards Program
                </span>
              </div>
              
              <h3 className="text-3xl font-extrabold uppercase tracking-tight text-[#F4F3EF]">
                The WhiteFrame Loyalty Economy
              </h3>
              
              <p className="text-[#9A9DA6] text-sm leading-relaxed font-light">
                Earn premium points with every system build commission or hardware catalog order. Use accumulated points to redeem exclusive merch, peripherals, and custom accessories in our member Points Shop.
              </p>
            </div>

            {/* Loop Timeline Steps */}
            <div className="space-y-6">
              {[
                { step: "01", title: "Build custom Rig", desc: "For every IDR spent, earn points directly deposited into your profile." },
                { step: "02", title: "Accumulate loyalty points", desc: "Watch your balance grow and track metrics on your user dashboard." },
                { step: "03", title: "Redeem exclusive merch", desc: "Browse keycaps, deskmats, and fan expansions, paying 100% with points." }
              ].map((s, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="font-mono text-xs font-bold text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-2 py-1 rounded">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#EDECE7]">{s.title}</h4>
                    <p className="text-[11px] text-[#6B6E76] mt-1 leading-relaxed font-light">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/points-shop")}
              className="group bg-transparent border border-white/10 hover:bg-white/[0.04] text-[#EDECE7] text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl cursor-pointer"
            >
              Explore Points Shop
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right Column: Dynamic Rewards Showcase */}
          <div className="lg:col-span-7 bg-[#08090C] border border-white/[0.06] rounded-3xl p-8 md:p-10 space-y-6 relative overflow-hidden">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4F3EF] flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Gift className="w-4 h-4 text-[#A78BFA]" />
              Redeemable Member Goods
            </h4>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-6 h-6 text-[#A78BFA] animate-spin" />
                <span className="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest">Checking inventory...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    onClick={() => navigate("/points-shop")}
                    className="group cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01] hover:bg-white/[0.02] p-4 border border-white/[0.06] rounded-xl hover:border-[#7C5CFC]/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden shrink-0">
                        <img
                          src={reward.image}
                          alt={reward.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/200?text=Reward";
                          }}
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#EDECE7] uppercase tracking-wide group-hover:text-[#C9C2FF] transition-colors">
                          {reward.name}
                        </h5>
                        <p className="font-mono text-[9px] text-[#6B6E76] uppercase tracking-wider mt-1">
                          {reward.specs?.cpu || reward.category}
                        </p>
                      </div>
                    </div>
                    
                    {/* Point tags */}
                    <div className="flex items-center gap-2 self-end sm:self-center bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-3.5 py-1.5 rounded-lg shrink-0">
                      <Star className="w-3.5 h-3.5 text-[#A78BFA] fill-[#A78BFA]" />
                      <span className="font-mono text-xs font-black text-[#A78BFA] tabular-nums">
                        {reward.pointsPrice || 500} PTS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
