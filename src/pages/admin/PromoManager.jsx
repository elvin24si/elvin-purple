// src/pages/admin/PromoManager.jsx
import { useState, useEffect, useCallback } from "react";
import { fetchPCCatalog } from "../../lib/supabasepc";
import {
  getPromos, addPromo, updatePromo, deletePromo,
  getFeaturedOrder, saveFeaturedOrder,
} from "../../lib/promoStore";
import {
  Plus, Trash2, X, Loader2, RefreshCw, Megaphone, Star,
  ChevronUp, ChevronDown, Eye, EyeOff, AlertTriangle, GripVertical,
} from "lucide-react";

// ── Promo type options
const PROMO_TYPES = ["Banner", "New Release", "Sale", "Flash Deal", "Featured"];
const PROMO_COLORS = [
  { label: "Purple",  bg: "#7C5CFC", text: "white" },
  { label: "Gold",    bg: "#F59E0B", text: "#1e293b" },
  { label: "Crimson", bg: "#E11D48", text: "white" },
  { label: "Emerald", bg: "#10B981", text: "white" },
  { label: "Slate",   bg: "#334155", text: "white" },
];

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  type: "Banner",
  color: "#7C5CFC",
  textColor: "white",
  linked_product_id: "",
  cta_label: "Shop Now",
  active: true,
};

// ── Small helpers
function Badge({ type }) {
  const colors = {
    Banner:     "bg-purple-50 text-purple-700 border-purple-100",
    "New Release":"bg-amber-50 text-amber-700 border-amber-100",
    Sale:       "bg-rose-50 text-rose-700 border-rose-100",
    "Flash Deal":"bg-orange-50 text-orange-700 border-orange-100",
    Featured:   "bg-indigo-50 text-indigo-700 border-indigo-100",
  };
  return (
    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colors[type] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {type}
    </span>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{children}</label>;
}

// ── Main
export default function PromoManager() {
  const [promos, setPromos]   = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [formErr, setFormErr] = useState(null);

  // Featured ordering state
  const [featuredIds, setFeaturedIds] = useState([]);
  const [featuredSaved, setFeaturedSaved] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [promoData, orderData, catalogData] = await Promise.all([
        getPromos(),
        getFeaturedOrder(),
        fetchPCCatalog(),
      ]);
      setPromos(promoData);
      setFeaturedIds(orderData);
      setCatalog(catalogData.filter((r) => ["Standard", "Signature"].includes(r.category)));
    } catch (err) {
      console.error("PromoManager load failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ── Promo CRUD
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormErr("Title is required."); return; }
    setSaving(true);
    setFormErr(null);
    try {
      await addPromo(form);
      await reload();
      setModal(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, current) => {
    try { await updatePromo(id, { active: !current }); await reload(); }
    catch (err) { alert(`Failed: ${err.message}`); }
  };

  const removePromo = async (id) => {
    try { await deletePromo(id); await reload(); }
    catch (err) { alert(`Failed: ${err.message}`); }
  };

  // ── Featured ordering
  const isFeaturePinned = (product_id) => featuredIds.includes(product_id);

  const togglePin = (product_id) => {
    setFeaturedIds((prev) =>
      prev.includes(product_id)
        ? prev.filter((id) => id !== product_id)
        : [...prev, product_id]
    );
    setFeaturedSaved(false);
  };

  const moveFeatured = (product_id, dir) => {
    setFeaturedIds((prev) => {
      const idx = prev.indexOf(product_id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
    setFeaturedSaved(false);
  };

  const saveFeatured = async () => {
    try {
      await saveFeaturedOrder(featuredIds);
      setFeaturedSaved(true);
      setTimeout(() => setFeaturedSaved(false), 2000);
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-10 bg-slate-50/20 min-h-screen">

      {/* ── HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Promo Manager</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create promotional banners, highlight new releases, and control the default catalog ordering.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} disabled={loading}
            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-[#7C5CFC] hover:border-[#7C5CFC]/20 bg-white transition-all cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => { setForm(EMPTY_FORM); setFormErr(null); setModal(true); }}
            className="flex items-center gap-2 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#7C5CFC]/15 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> New Promo
          </button>
        </div>
      </div>

      {/* ── SECTION 1: Active Promos */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#7C5CFC]" />
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Active Promotions</h2>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 ml-1">
            {promos.filter(p => p.active).length} live
          </span>
        </div>

        {/* Live Preview Banner (first active promo) */}
        {(() => {
          const live = promos.find(p => p.active);
          if (!live) return null;
          return (
            <div
              className="relative rounded-2xl overflow-hidden p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: `linear-gradient(135deg, ${live.color}ee, ${live.color}99)` }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(45deg,white_1px,transparent_1px),linear-gradient(-45deg,white_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative flex-1 space-y-1">
                <Badge type={live.type} />
                <h3 className="text-xl font-extrabold mt-1" style={{ color: live.textColor }}>{live.title}</h3>
                {live.subtitle && <p className="text-sm opacity-80" style={{ color: live.textColor }}>{live.subtitle}</p>}
              </div>
              {live.cta_label && (
                <div className="relative shrink-0">
                  <div
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border"
                    style={{ borderColor: live.textColor + "40", color: live.textColor, background: live.textColor === "white" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)" }}
                  >
                    {live.cta_label}
                  </div>
                </div>
              )}
              <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest opacity-50" style={{ color: live.textColor }}>
                Live Preview
              </span>
            </div>
          );
        })()}

        {/* Promo List */}
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#7C5CFC]" /> Loading promos…
          </div>
        ) : promos.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl py-12 text-center text-slate-400 text-sm">
            <Megaphone className="w-8 h-8 mx-auto mb-3 text-slate-200" />
            No promos yet. Create one to display on the catalog page.
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-5 text-left w-4"></th>
                  <th className="py-3 px-5 text-left">Title</th>
                  <th className="py-3 px-4 text-left w-[110px]">Type</th>
                  <th className="py-3 px-4 text-left">Subtitle</th>
                  <th className="py-3 px-4 text-center w-[90px]">Status</th>
                  <th className="py-3 px-5 text-center w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: promo.color }} />
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-800 text-xs">{promo.title}</td>
                    <td className="py-4 px-4"><Badge type={promo.type} /></td>
                    <td className="py-4 px-4 text-slate-500 text-xs truncate max-w-[200px]">{promo.subtitle || "—"}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        promo.active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}>
                        {promo.active ? "Live" : "Paused"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => toggleActive(promo.id, promo.active)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                          title={promo.active ? "Pause" : "Activate"}>
                          {promo.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => removePromo(promo.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── SECTION 2: Featured Catalog Order */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Default Catalog Ordering</h2>
          </div>
          <button
            onClick={saveFeatured}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              featuredSaved
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-[#7C5CFC] text-white border-[#7C5CFC] shadow-md shadow-[#7C5CFC]/15 hover:bg-[#6D4DEF]"
            }`}
          >
            {featuredSaved ? "✓ Saved!" : "Save Order"}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Star items to pin them to the top of the catalog's default view. Drag the rank arrows to reorder. This only applies when a visitor hasn't searched or filtered.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-8 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#7C5CFC]" /> Loading catalog…
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">

            {/* Pinned items row */}
            {featuredIds.length > 0 && (
              <div className="border-b border-slate-100 bg-amber-50/30">
                <div className="px-5 py-3 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Pinned to Top ({featuredIds.length})</span>
                </div>
                <div className="px-5 pb-3 space-y-2">
                  {featuredIds.map((pid, idx) => {
                    const item = catalog.find(c => c.product_id === pid);
                    if (!item) return null;
                    return (
                      <div key={pid} className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest">{item.category} · {item.product_id}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => moveFeatured(pid, "up")} disabled={idx === 0}
                            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-25 cursor-pointer">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveFeatured(pid, "down")} disabled={idx === featuredIds.length - 1}
                            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-25 cursor-pointer">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => togglePin(pid)}
                            className="p-1.5 text-amber-500 hover:text-slate-400 cursor-pointer">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All catalog items table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-5 text-left w-[60px]">Image</th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left w-[100px]">Category</th>
                  <th className="py-3 px-4 text-left w-[120px]">Availability</th>
                  <th className="py-3 px-5 text-center w-[90px]">Feature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {catalog.map((item) => {
                  const pinned = isFeaturePinned(item.product_id);
                  return (
                    <tr key={item.product_id} className={`hover:bg-slate-50/40 transition-colors ${pinned ? "bg-amber-50/20" : ""}`}>
                      <td className="py-4 px-5">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                          {item.product_img_url ? (
                            <img src={item.product_img_url} alt={item.name} className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://placehold.co/40x40?text=?"; }} />
                          ) : (
                            <span className="text-slate-300 text-[10px]">?</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{item.product_id}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">{item.availability}</td>
                      <td className="py-4 px-5 text-center">
                        <button onClick={() => togglePin(item.product_id)}
                          title={pinned ? "Unpin from featured" : "Pin to featured"}
                          className="p-2 rounded-xl hover:bg-amber-50 transition-all cursor-pointer">
                          <Star className={`w-4 h-4 ${pinned ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── CREATE PROMO MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b p-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">New Promotion</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure a promo that appears on the catalog page.</p>
              </div>
              <button type="button" onClick={() => setModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-600">
              {formErr && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" /><span>{formErr}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FieldLabel>Title *</FieldLabel>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Ryzen X Series Now Available"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-800" />
                </div>

                <div className="col-span-2">
                  <FieldLabel>Subtitle</FieldLabel>
                  <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                    placeholder="e.g. Unleash next-gen performance with AMD Ryzen 9"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-800" />
                </div>

                <div>
                  <FieldLabel>Type</FieldLabel>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white">
                    {PROMO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <FieldLabel>CTA Button Label</FieldLabel>
                  <input value={form.cta_label} onChange={e => setForm(f => ({ ...f, cta_label: e.target.value }))}
                    placeholder="e.g. Shop Now, View Build"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-800" />
                </div>

                <div>
                  <FieldLabel>Banner Color</FieldLabel>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {PROMO_COLORS.map(c => (
                      <button key={c.bg} type="button"
                        onClick={() => setForm(f => ({ ...f, color: c.bg, textColor: c.text }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${form.color === c.bg ? "border-slate-800 scale-110" : "border-transparent"}`}
                        style={{ background: c.bg }} title={c.label} />
                    ))}
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest cursor-pointer">
                      <input type="color" value={form.color}
                        onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                        className="w-7 h-7 rounded-full border border-slate-200 cursor-pointer p-0" />
                      Custom
                    </label>
                  </div>
                </div>

                <div>
                  <FieldLabel>Linked Product (optional)</FieldLabel>
                  <select value={form.linked_product_id} onChange={e => setForm(f => ({ ...f, linked_product_id: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white">
                    <option value="">— None —</option>
                    {catalog.map(c => <option key={c.product_id} value={c.product_id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Live Mini Preview */}
                <div className="col-span-2">
                  <FieldLabel>Preview</FieldLabel>
                  <div className="rounded-xl overflow-hidden p-4 flex items-center gap-3"
                    style={{ background: `linear-gradient(135deg, ${form.color}ee, ${form.color}88)` }}>
                    <div className="flex-1 min-w-0">
                      <Badge type={form.type} />
                      <p className="text-sm font-extrabold mt-1 truncate" style={{ color: form.textColor }}>
                        {form.title || "Your title here"}
                      </p>
                      {form.subtitle && (
                        <p className="text-[11px] opacity-75 mt-0.5 truncate" style={{ color: form.textColor }}>
                          {form.subtitle}
                        </p>
                      )}
                    </div>
                    {form.cta_label && (
                      <div className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
                        style={{ borderColor: form.textColor + "50", color: form.textColor, background: form.textColor === "white" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)" }}>
                        {form.cta_label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-5 flex gap-2 justify-end bg-slate-50/50">
              <button type="button" onClick={() => setModal(false)} disabled={saving}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 bg-white cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving…" : "Create Promo"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
