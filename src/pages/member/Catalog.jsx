// src/pages/member/Catalog.jsx
import { useState, useEffect, useMemo } from "react";
import PCCard from "../../components/PCCard";
import FilterBar from "../../components/catalog/FilterBar";
import { fetchPCCatalog, normalizePC } from "../../lib/supabasepc";
import { getPromos, applyFeaturedOrder, getFeaturedOrder } from "../../lib/promoStore";
import { X } from "lucide-react";

// ── Inline Promo Banner
function PromoBanner({ promo, onDismiss }) {
  const tc = promo.text_color ?? promo.textColor ?? "white";
  const isImageBg = promo.bg_type === "image" && (promo.bg_image_url ?? promo.bgImageUrl);
  const bgStyle = isImageBg
    ? {
        backgroundImage: `url(${promo.bg_image_url ?? promo.bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(135deg, ${promo.color}ee, ${promo.color}77)`,
      };

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5"
      style={bgStyle}
    >
      {/* Readability backdrop overlay for image background */}
      {isImageBg && (
        <div className={`absolute inset-0 pointer-events-none ${tc === "white" || tc.toLowerCase() === "#ffffff" ? "bg-black/40" : "bg-white/20"}`} />
      )}
      
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(45deg,white_1px,transparent_1px),linear-gradient(-45deg,white_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <div className="relative flex-1 min-w-0">
        <span
          className="inline-block text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border mb-1"
          style={{
            borderColor: tc === "white" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)",
            color: tc === "white" ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.6)",
            background: tc === "white" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
          }}
        >
          {promo.type}
        </span>
        <h3 className="text-base font-extrabold truncate" style={{ color: tc }}>{promo.title}</h3>
        {promo.subtitle && <p className="text-xs opacity-75 mt-0.5 truncate" style={{ color: tc }}>{promo.subtitle}</p>}
      </div>
      {promo.cta_label && (
        <span
          className="relative shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-default"
          style={{
            borderColor: tc + "50",
            color: tc,
            background: tc === "white" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
          }}
        >{promo.cta_label}</span>
      )}
      <button onClick={onDismiss}
        className="absolute top-3 right-3 p-1 cursor-pointer z-10"
        style={{ color: tc + "80" }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function Catalog() {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataForm, setDataForm] = useState({ searchTerm: "", selectedTag: "" });

  const [promos, setPromos] = useState([]);
  const [featuredOrder, setFeaturedOrder] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);

  // Fetch from Supabase on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPCCatalog(),
      getPromos(),
      getFeaturedOrder(),
    ])
      .then(([rows, promoRows, orderIds]) => {
        const normalized = rows
          .filter((r) => ["Standard", "Signature"].includes(r.category))
          .map(normalizePC)
          .filter((pc) => !pc.allowPointsPayment);
        setPcData(normalized);
        setPromos(promoRows.filter((p) => p.active));
        setFeaturedOrder(orderIds);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  // Default = no user-applied search or tag filter
  const isDefault = !dataForm.searchTerm && !dataForm.selectedTag;

  const filteredPCs = useMemo(() => {
    const base = pcData.filter((pc) => {
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

    return applyFeaturedOrder(base, isDefault, featuredOrder);
  }, [pcData, dataForm, isDefault, featuredOrder]);

  const filterOptions = useMemo(
    () => [...new Set(pcData.flatMap((pc) => pc.tags))],
    [pcData]
  );

  const visiblePromos = useMemo(
    () => promos.filter((p) => !dismissedIds.includes(p.id)),
    [promos, dismissedIds]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center bg-[#08090C]">
        <div className="inline-flex flex-col items-center gap-4 text-[#6B6E76]">
          <div className="w-8 h-8 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm uppercase tracking-widest font-medium">Loading Catalog…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center bg-[#08090C]">
        <p className="text-sm text-[#E27B7B] font-medium">Failed to load catalog: {error}</p>
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
    <div className="max-w-7xl mx-auto px-8 py-12 bg-[#08090C]">

      {/* Promo Banners — only shown in default (unfiltered) view */}
      {isDefault && visiblePromos.length > 0 && (
        <div className="space-y-3 mb-4">
          {visiblePromos.map((promo) => (
            <PromoBanner
              key={promo.id}
              promo={promo}
              onDismiss={() => setDismissedIds((prev) => [...prev, promo.id])}
            />
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <FilterBar
        searchTerm={dataForm.searchTerm}
        selectedTag={dataForm.selectedTag}
        filterOptions={filterOptions}
        onFilterChange={handleChange}
      />

      {filteredPCs.length === 0 ? (
        <div className="py-24 text-center text-[#6B6E76] text-sm">
          No products match your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredPCs.map((pc, idx) => (
            <div key={pc.id} className="relative">
              {/* Featured badge for top-pinned item in default view */}
              {isDefault && idx === 0 && (
                <div className="absolute -top-3 left-0 z-10 bg-[#7C5CFC] text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  ★ Featured
                </div>
              )}
              <PCCard pc={pc} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}