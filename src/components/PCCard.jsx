// src/components/PCCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertOrder } from "../lib/supabasepc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { useCart } from "../context/CartContext";

export default function PCCard({ pc }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const availability = pc.meta?.availability ?? "Unknown";
  const isOutOfStock = availability === "Out of Stock";

  const displayPrice = pc.price
    ? new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(pc.price)
    : "—";

  const handleOrderClick = (e) => {
    e.stopPropagation();
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    addToCart(pc);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    const isMemberView = window.location.pathname.startsWith("/catalog") || window.location.pathname.startsWith("/member");
    if (isMemberView) {
      navigate(`/catalog/pc/${pc.id}`);
    } else {
      navigate(`/pc/${pc.id}`);
    }
  };

  return (
    <div className="group cursor-pointer flex flex-col" onClick={handleDetailsClick}>
      {/* Image & Hover Container */}
      <div className="relative aspect-[4/5] bg-white/[0.02] mb-6 overflow-hidden border border-white/[0.07] rounded-xl transition-all duration-700 group-hover:shadow-xl group-hover:shadow-[#7C5CFC]/10 group-hover:-translate-y-1.5">
        <img
          src={pc.image}
          alt={pc.name}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=No+Image"; }}
        />

        {/* Technical Overlay */}
        <div className="absolute inset-0 bg-[#08090C]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8">
          {/* Top Section: Specs */}
          <div className="space-y-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="border-b border-white/[0.08] pb-3">
              <p className="text-[9px] text-[#A78BFA] font-bold tracking-[0.3em] uppercase mb-1.5">
                Build Identifier
              </p>
              <h3 className="text-base font-semibold text-[#EDECE7] uppercase tracking-wider">
                {pc.id}
              </h3>
            </div>

            <div className="space-y-3.5">
              {pc.specs?.gpu && <SpecDetail label="GPU" value={pc.specs.gpu} />}
              {pc.specs?.cpu && <SpecDetail label="CPU" value={pc.specs.cpu} />}
              {pc.thermals?.cooler && pc.thermals.cooler !== "—" && (
                <SpecDetail label="Cooling" value={pc.thermals.cooler} />
              )}
              {pc.specs?.ram && <SpecDetail label="RAM" value={pc.specs.ram} />}
              {pc.targetPerformance && (
                <SpecDetail label="Optimized For" value={pc.targetPerformance} />
              )}
            </div>
          </div>

          {/* Bottom Section: Buttons */}
          <div className="flex gap-2.5 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-75 w-full">
            <button
              type="button"
              onClick={handleDetailsClick}
              className="flex-1 py-3 text-[9px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all duration-300 border border-white/20 text-[#EDECE7] hover:bg-white/[0.05] hover:border-white/40 text-center"
            >
              Details
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleOrderClick}
              className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all duration-300 border text-center
                ${isOutOfStock
                  ? "bg-white/[0.02] border-white/[0.06] text-[#5A5D65] cursor-not-allowed"
                  : added
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-[#7C5CFC] border-[#7C5CFC] text-white hover:bg-transparent hover:text-[#C9C2FF] hover:border-[#7C5CFC]/40"
                }`}
            >
              {isOutOfStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info (Always Visible) */}
      <div className="space-y-2.5 px-1.5">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-base font-bold tracking-wide text-[#F4F3EF] group-hover:text-[#C9C2FF] transition-colors uppercase line-clamp-1 leading-tight">
            {pc.name}
          </h2>
          <p className="text-xs font-bold text-[#D97757] tabular-nums shrink-0 mt-0.5">
            {displayPrice}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse
              ${availability === "In Stock" ? "bg-emerald-500" :
                availability === "Limited" || availability === "Low Stock" ? "bg-amber-500" :
                  "bg-rose-500"}`}
          />
          <p className="text-[9px] text-[#8A8D96] uppercase tracking-[0.2em] font-medium">
            {availability}
          </p>
        </div>

        {pc.category && (
          <div className="pt-1">
            <span className="inline-flex text-[8px] font-bold uppercase tracking-widest bg-white/[0.03] text-[#6B6E76] border border-white/[0.06] px-2 py-0.5 rounded">
              {pc.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecDetail({ label, value }) {
  return (
    <div>
      <p className="text-[8px] text-[#6B6E76] uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs text-[#EDECE7] font-medium tracking-wide leading-relaxed line-clamp-1">{value}</p>
    </div>
  );
}