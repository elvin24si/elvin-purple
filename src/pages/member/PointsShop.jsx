// src/pages/member/PointsShop.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPCCatalog, normalizePC } from "../../lib/supabasepc";
import { fetchMember } from "../../lib/supabasemem";
import FilterBar from "../../components/catalog/FilterBar";
import { useCart } from "../../context/CartContext";
import { Badge } from "../../components/ui/badge";
import { Loader2, Coins, Sparkles, ArrowRight } from "lucide-react";

export default function PointsShop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataForm, setDataForm] = useState({ searchTerm: "", selectedTag: "" });
  
  // User Profile State for tracking Points
  const [userPoints, setUserPoints] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // Added animation state
  const [addedId, setAddedId] = useState(null);

  // Fetch products and sync user points on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setCurrentUser(parsedUser);
    setUserPoints(parsedUser.current_points || 0);

    // Sync fresh points from database
    fetchMember()
      .then((members) => {
        const freshUser = members.find((m) => m.member_id === parsedUser.member_id);
        if (freshUser) {
          setUserPoints(freshUser.current_points || 0);
          const updatedUserObj = { ...parsedUser, current_points: freshUser.current_points };
          localStorage.setItem("current_user", JSON.stringify(updatedUserObj));
        }
      })
      .catch((err) => console.error("Failed to sync points:", err));

    setLoading(true);
    fetchPCCatalog()
      .then((rows) => {
        const normalized = rows.map(normalizePC);
        // Filter products that support points payments
        const pointsItems = normalized.filter((pc) => pc.allowPointsPayment === true);
        setPcData(pointsItems);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPCs = useMemo(() => {
    return pcData.filter((pc) => {
      const _search = dataForm.searchTerm.toLowerCase();
      const searchableIndex = [pc.name, pc.specs.gpu, pc.specs.cpu, ...pc.tags]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchableIndex.includes(_search);
      const matchesTag = dataForm.selectedTag
        ? pc.tags.includes(dataForm.selectedTag)
        : true;
      return matchesSearch && matchesTag;
    });
  }, [pcData, dataForm]);

  const filterOptions = useMemo(
    () => [...new Set(pcData.flatMap((pc) => pc.tags))],
    [pcData]
  );

  const handleRedeem = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center bg-[#08090C]">
        <div className="inline-flex flex-col items-center gap-4 text-[#6B6E76]">
          <div className="w-8 h-8 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm uppercase tracking-widest font-semibold">Loading Points Shop…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center bg-[#08090C]">
        <p className="text-sm text-[#E27B7B] font-medium">Failed to load shop: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-xs uppercase tracking-widest text-[#A78BFA] underline hover:text-[#C9C2FF]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 bg-[#08090C] min-h-screen text-[#EDECE7] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#7C5CFC]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#A78BFA]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Points Shop Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/[0.07] pb-8 mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#7C5CFC]/10 text-[#C9C2FF] border-[#7C5CFC]/20 px-2 py-0.5 text-[9px] uppercase tracking-widest font-black">
              Members Club
            </Badge>
            <span className="text-[10px] text-white/30 uppercase tracking-widest">•</span>
            <span className="text-[9px] text-[#A78BFA] font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> Exclusive Redemptions
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-wider text-[#F4F3EF] uppercase">Points Shop</h2>
          <p className="text-xs text-[#9A9DA6] mt-1.5 leading-relaxed max-w-xl">
            Redeem exclusive WhiteFrame brand merchandise or discount computer accessories using earned loyalty points.
          </p>
        </div>

        {/* Dynamic Points Balance Card */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#7C5CFC]/15 to-[#A78BFA]/10 border border-[#7C5CFC]/20 p-5 rounded-2xl shadow-xl shadow-[#7C5CFC]/5 transition-all hover:border-[#7C5CFC]/35">
          <div className="p-3 bg-[#7C5CFC]/10 rounded-xl border border-[#7C5CFC]/25 shadow-inner">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-[9px] text-[#A78BFA] uppercase tracking-widest font-bold">Your Balance</p>
            <p className="text-xl font-black text-white tracking-wide">{userPoints.toLocaleString()} <span className="text-xs text-[#6B6E76] font-medium">PTS</span></p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <FilterBar
        searchTerm={dataForm.searchTerm}
        selectedTag={dataForm.selectedTag}
        filterOptions={filterOptions}
        onFilterChange={handleChange}
      />

      {filteredPCs.length === 0 ? (
        <div className="py-24 text-center text-[#6B6E76] text-sm">
          No items found matching the filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-10">
          {filteredPCs.map((product) => {
            const displayPrice = product.price ? formatCurrency(product.price) : "—";
            const isPurePoints = product.allowCashPayment === false;

            return (
              <div key={product.id} className="group cursor-pointer flex flex-col">
                {/* Image & Hover Container */}
                <div className="relative aspect-[4/5] bg-white/[0.01] mb-6 overflow-hidden border border-white/[0.05] rounded-2xl transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-[#7C5CFC]/10 group-hover:border-[#7C5CFC]/30 group-hover:-translate-y-1.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-103"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=No+Image"; }}
                  />

                  {/* Technical Overlay */}
                  <div className="absolute inset-0 bg-[#08090C]/96 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8">
                    {/* Specs / Details */}
                    <div className="space-y-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="border-b border-white/[0.08] pb-4">
                        <span className={`text-[8px] font-black px-2.5 py-1 rounded tracking-widest uppercase border ${
                          isPurePoints
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-[#7C5CFC]/10 text-[#C9C2FF] border-[#7C5CFC]/20"
                        }`}>
                          {isPurePoints ? "Pure Points (Merch)" : "Hybrid (Accessory)"}
                        </span>
                        <h3 className="text-base font-black text-[#EDECE7] uppercase tracking-wider mt-3.5 leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="space-y-3.5 text-xs">
                        <p className="text-[#8A8D96] leading-relaxed">
                          {product.targetPerformance || "Exclusive members-only boutique accessory built with high manufacturing standards."}
                        </p>
                      </div>
                    </div>

                    {/* Order Trigger Button */}
                    <div className="translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-75">
                      <button
                        onClick={() => handleRedeem(product)}
                        className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border
                          ${addedId === product.id
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-[#7C5CFC] hover:bg-transparent border border-[#7C5CFC] text-white hover:text-[#C9C2FF] hover:border-[#7C5CFC]/40"
                          }`}
                      >
                        {addedId === product.id ? "Added to Cart ✓" : "Redeem to Cart"} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Always Visible Product Info */}
                <div className="space-y-2.5 px-2">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-sm font-bold tracking-wide text-[#F4F3EF] group-hover:text-[#C9C2FF] transition-colors uppercase line-clamp-1 leading-tight">
                      {product.name}
                    </h2>
                    <div className="text-right shrink-0">
                      {isPurePoints ? (
                        <p className="text-sm font-black text-amber-400 tracking-wide">{product.pointsPrice} PTS</p>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-[#D97757]">{displayPrice}</p>
                          <p className="text-[9px] text-[#A78BFA] mt-0.5 font-bold uppercase tracking-wider">Or {product.pointsPrice || Math.floor(product.price / 1000)} PTS</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] text-[#8A8D96] uppercase tracking-[0.2em] font-bold">Available in Stock</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
