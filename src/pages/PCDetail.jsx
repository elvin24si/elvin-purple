// src/pages/PCDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { fetchPCById } from "../lib/supabasepc";
import { useCart } from "../context/CartContext";
import NewNavbar from "../components/NewNavbar";
import {
  ArrowLeft,
  Cpu,
  Layers,
  Settings,
  Shield,
  Clock,
  Sparkles,
  ShoppingCart,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function PCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [pc, setPc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const isMemberView = location.pathname.startsWith("/catalog");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPCById(id)
      .then((data) => {
        if (!data) {
          setError("Product not found.");
        } else {
          setPc(data);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load product details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleOrderClick = () => {
    if (!pc) return;
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    addToCart(pc);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBackClick = () => {
    if (isMemberView) {
      navigate("/catalog");
    } else {
      navigate("/guestCatalog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDECE7] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#A78BFA] animate-spin" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#6B6E76]">Loading build profiles...</span>
      </div>
    );
  }

  if (error || !pc) {
    return (
      <div className="min-h-screen bg-[#08090C] text-[#EDECE7] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#D97757]" />
        <h3 className="text-xl font-bold uppercase tracking-wide">Spec File Retrieval Error</h3>
        <p className="text-sm text-[#8A8D96] max-w-md">{error || "The requested configuration could not be found."}</p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-6 py-3 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const availability = pc.meta?.availability ?? "Unknown";
  const isOutOfStock = availability === "Out of Stock";

  const displayPrice = pc.price
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(pc.price)
    : "—";

  return (
    <div className="w-full min-h-screen bg-[#08090C] text-[#EDECE7] relative overflow-x-clip">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[25%] w-[45vw] h-[45vw] rounded-full blur-[150px] opacity-10 bg-[#7C5CFC]/8"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[130px] opacity-8 bg-[#D97757]/8"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,252,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,252,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      </div>

      {/* Render guest navbar if accessed via guest path */}
      {!isMemberView && <NewNavbar />}

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-32 relative z-10 text-left">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="group inline-flex items-center gap-2 mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8D96] hover:text-[#EDECE7] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Catalog</span>
        </button>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative aspect-[4/5] bg-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group">
              <img
                src={pc.image}
                alt={pc.name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.03]"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x750?text=No+Image";
                }}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-lg">
                <span className="text-[8px] font-mono tracking-[0.25em] text-[#A78BFA] font-bold uppercase">
                  Template ID: {pc.id}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & specs */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badges & Name */}
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="bg-[#7C5CFC]/10 text-[#C9C2FF] border border-[#7C5CFC]/20 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black">
                    {pc.category}
                  </span>
                  <span className="text-[10px] text-white/20">•</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 animate-pulse
                        ${availability === "In Stock" ? "bg-emerald-500" :
                          availability === "Limited" || availability === "Low Stock" ? "bg-amber-500" :
                            "bg-rose-500"}`}
                    />
                    <p className="text-[9px] text-[#8A8D96] uppercase tracking-[0.2em] font-bold">
                      {availability}
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-[#F4F3EF]">
                  {pc.name}
                </h1>
              </div>

              {/* Price Panel */}
              <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[8px] text-[#6B6E76] uppercase tracking-[0.25em] font-bold mb-1">Standard Valuation</p>
                  <p className="text-2xl font-black text-[#D97757] tabular-nums tracking-wide">{displayPrice}</p>
                </div>
                {pc.allowPointsPayment && pc.pointsPrice && (
                  <div className="border-l border-white/10 pl-6 text-right">
                    <p className="text-[8px] text-[#6B6E76] uppercase tracking-[0.25em] font-bold mb-1">Points Equivalent</p>
                    <p className="text-xl font-black text-amber-400 tracking-wide">{pc.pointsPrice.toLocaleString()} PTS</p>
                  </div>
                )}
              </div>

              {/* Hardware Specifications Grid */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A78BFA] font-bold">
                  System Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pc.specs?.gpu && (
                    <SpecCard
                      icon={<Cpu className="w-4 h-4 text-[#A78BFA]" />}
                      label="Graphics Processor"
                      value={pc.specs.gpu}
                    />
                  )}
                  {pc.specs?.cpu && (
                    <SpecCard
                      icon={<Cpu className="w-4 h-4 text-[#A78BFA]" />}
                      label="Central Processor"
                      value={pc.specs.cpu}
                    />
                  )}
                  {pc.specs?.ram && (
                    <SpecCard
                      icon={<Layers className="w-4 h-4 text-[#A78BFA]" />}
                      label="Memory Capacity"
                      value={pc.specs.ram}
                    />
                  )}
                  {pc.thermals?.cooler && pc.thermals.cooler !== "—" && (
                    <SpecCard
                      icon={<Settings className="w-4 h-4 text-[#A78BFA]" />}
                      label="Thermal Solution"
                      value={pc.thermals.cooler}
                    />
                  )}
                  {pc.targetPerformance && (
                    <div className="col-span-1 sm:col-span-2">
                      <SpecCard
                        icon={<Sparkles className="w-4 h-4 text-[#A78BFA]" />}
                        label="Optimized Profile"
                        value={pc.targetPerformance}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-5 pt-6 border-t border-white/[0.08]">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled={isOutOfStock}
                  onClick={handleOrderClick}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer
                    ${isOutOfStock
                      ? "bg-white/[0.02] border-white/[0.06] text-[#5A5D65] cursor-not-allowed"
                      : added
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-[#7C5CFC] border-[#7C5CFC] text-white hover:bg-transparent hover:text-[#C9C2FF] hover:border-[#7C5CFC]/40"
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : added ? "Build Added ✓" : "Add to Cart"}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 text-[#8A8D96] text-[10px] font-medium tracking-wide">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                  <Shield className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>3-Year Warranty Cover</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                  <Clock className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>72-Hour Quality Burn-In</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guest registration bottom banner */}
      {!isMemberView && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-3xl bg-[#0F1115]/80 backdrop-blur-xl border border-white/[0.06] px-6 py-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] z-50 animate-in slide-in-from-bottom-6 duration-500">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Ready to customize your build?</h3>
            <p className="text-[10px] text-[#6B6E76] mt-0.5">Register as a member to customize parts, view metrics, and place orders.</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-center">
            <Link
              to="/login"
              className="text-[10px] font-bold uppercase tracking-widest text-[#9A9DA6] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#7C5CFC]/20 active:scale-95 text-center w-full sm:w-auto"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#0F1115]/30 border border-white/[0.04] hover:border-white/[0.08] transition-colors">
      <div className="p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[8px] text-[#6B6E76] uppercase tracking-widest font-bold mb-0.5">{label}</p>
        <p className="text-xs text-[#EDECE7] font-bold tracking-wide leading-relaxed truncate">{value}</p>
      </div>
    </div>
  );
}
