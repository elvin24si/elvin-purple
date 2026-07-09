// src/pages/admin/Inventory.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchPCCatalog,
  insertPC,
  updatePC,
  deletePC,
} from "../../lib/supabasepc";
import { Plus, Search, Pencil, Trash2, X, Loader2, AlertTriangle, RefreshCw, Image } from "lucide-react";

// ─── EMPTY FORM TEMPLATE (mirrors Supabase column names) ─────────────────────
const EMPTY_FORM = {
  product_id: "",
  name: "",
  category: "Standard",
  product_img_url: "",
  retail_price_idr: "",
  component_cogs_idr: "",
  labor_cost_idr: "",
  // Computed (derived) — do not let user type these:
  total_unit_cost: "",
  net_profit_idr: "",
  gross_margin: "",
  cpu_brand: "AMD",
  cpu_model: "",
  gpu_brand: "Nvidia",
  gpu_model: "",
  ram_specs: "",
  cooler_type: "Air Cooler",
  availability: "In Stock",
  target_performance: "",
};

const AVAILABILITY_OPTIONS = [
  "In Stock",
  "Limited",
  "Low Stock",
  "Special Order",
  "Out of Stock",
];

// Only these categories show in the inventory manager (excludes Point Shop items)
const WHITELISTED_CATEGORIES = ["Standard", "Signature"];
const CATEGORY_FILTER_OPTIONS = ["All", "Standard", "Signature"];

const CATEGORY_OPTIONS = ["Standard", "Signature"];
const CPU_BRANDS = ["AMD", "Intel"];
const GPU_BRANDS = ["AMD", "Nvidia", "Intel"];
const COOLER_TYPES = ["Air Cooler", "AIO 120mm", "AIO 240mm", "AIO 360mm", "Custom Loop", "Passive"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getAvailabilityClass(status) {
  switch (status) {
    case "In Stock":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold";
    case "Special Order":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold";
    case "Low Stock":
    case "Limited":
      return "bg-amber-50 text-amber-700 border border-amber-100 font-bold";
    case "Out of Stock":
      return "bg-rose-50 text-rose-700 border border-rose-100 font-bold";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-200";
  }
}

function formatIDR(val) {
  const n = Number(val);
  if (!val || isNaN(n)) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal state: null | "add" | "edit"
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null); // raw row
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPCCatalog()
      .then(setRows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Filtering (operates on raw rows) ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return rows
      // 1. Whitelist: only Standard and Signature categories
      .filter((r) => WHITELISTED_CATEGORIES.includes(r.category))
      // 2. Category dropdown filter
      .filter((r) => categoryFilter === "All" || r.category === categoryFilter)
      // 3. Text search
      .filter(
        (r) =>
          r.product_id?.toLowerCase().includes(q) ||
          r.name?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      );
  }, [rows, searchTerm, categoryFilter]);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setFormData({
      ...EMPTY_FORM,
      product_id: `SIG-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 10)}`, // Auto generate product ID
    });
    setFormError(null);
    setModal("add");
  };

  const openEdit = (row) => {
    // Pre-populate form with existing raw values
    const base = {
      product_id: row.product_id ?? "",
      name: row.name ?? "",
      category: row.category ?? "Standard",
      product_img_url: row.product_img_url ?? "",
      retail_price_idr: row.retail_price_idr ?? "",
      component_cogs_idr: row.component_cogs_idr ?? "",
      labor_cost_idr: row.labor_cost_idr ?? "",
      total_unit_cost: row.total_unit_cost ?? "",
      net_profit_idr: row.net_profit_idr ?? "",
      gross_margin: row.gross_margin ?? "",
      cpu_brand: row.cpu_brand ?? "AMD",
      cpu_model: row.cpu_model ?? "",
      gpu_brand: row.gpu_brand ?? "Nvidia",
      gpu_model: row.gpu_model ?? "",
      ram_specs: row.ram_specs ?? "",
      cooler_type: row.cooler_type ?? "Air Cooler",
      availability: row.availability ?? "In Stock",
      target_performance: row.target_performance ?? "",
    };
    // Recompute derived fields from stored raw values
    setFormData({ ...base, ...computeFinancials(base) });
    setFormError(null);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setFormError(null);
  };

  // Auto-compute derived financials when inputs change
  const computeFinancials = (data) => {
    const retail = Number(data.retail_price_idr) || 0;
    const cogs   = Number(data.component_cogs_idr) || 0;
    const labor  = Number(data.labor_cost_idr) || 0;
    const total  = cogs + labor;
    const profit = retail - total;
    const margin = retail > 0 ? profit / retail : 0;
    return {
      total_unit_cost: total > 0 ? total : "",
      net_profit_idr: retail > 0 ? profit : "",
      gross_margin: retail > 0 ? Number(margin.toFixed(4)) : "",
    };
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Recalculate derived fields whenever a financial input changes
      if (["retail_price_idr", "component_cogs_idr", "labor_cost_idr"].includes(name)) {
        return { ...updated, ...computeFinancials(updated) };
      }
      return updated;
    });
  };

  // Build the payload — convert numeric strings to numbers for Supabase
  const buildPayload = (data) => ({
    ...data,
    retail_price_idr: data.retail_price_idr !== "" ? Number(data.retail_price_idr) : null,
    component_cogs_idr: data.component_cogs_idr !== "" ? Number(data.component_cogs_idr) : null,
    labor_cost_idr: data.labor_cost_idr !== "" ? Number(data.labor_cost_idr) : null,
    total_unit_cost: data.total_unit_cost !== "" ? Number(data.total_unit_cost) : null,
    net_profit_idr: data.net_profit_idr !== "" ? Number(data.net_profit_idr) : null,
    gross_margin: data.gross_margin !== "" ? Number(data.gross_margin) : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_id.trim()) {
      setFormError("Product ID is required.");
      return;
    }
    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = buildPayload(formData);
      if (modal === "add") {
        await insertPC(payload);
      } else {
        // Don't send product_id in body for PATCH (it's the filter key)
        const { product_id, ...rest } = payload;
        await updatePC(formData.product_id, rest);
      }
      closeModal();
      loadData();
    } catch (err) {
      setFormError(err.message || "Failed to save product configuration.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePC(deleteTarget.product_id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8 bg-slate-50/20 min-h-screen">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Inventory Manager</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Loading active configurations..." : `Configure and manage ${rows.length} active PC system configuration${rows.length !== 1 ? "s" : ""} in the catalog.`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#7C5CFC]/15 hover:shadow-lg hover:shadow-[#7C5CFC]/25 transition-all duration-300 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product Configuration
        </button>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by name, category, or product ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all duration-200 text-slate-700"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white cursor-pointer"
          >
            {CATEGORY_FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt === "All" ? "Category: All" : opt}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3 flex justify-end">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#7C5CFC] border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#7C5CFC]/30 transition-all font-bold shadow-2xs bg-white cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Reload
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE CUE */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Error loading inventory: {error}</span>
        </div>
      )}

      {/* MAIN INVENTORY LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" />
            <span>Loading system inventory...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            {searchTerm ? "No products match your search query." : "No inventory configurations found. Click 'Add Product' to insert your first one!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6 w-[80px]">Preview</th>
                  <th className="py-4 px-4 w-[120px]">Product ID</th>
                  <th className="py-4 px-4">System Name</th>
                  <th className="py-4 px-4 w-[130px]">Category</th>
                  <th className="py-4 px-4">Specifications</th>
                  <th className="py-4 px-4">Financials</th>
                  <th className="py-4 px-4 w-[130px] text-center">Status</th>
                  <th className="py-4 px-6 w-[120px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filtered.map((row) => (
                  <tr key={row.product_id} className="hover:bg-slate-50/40 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="relative group/img w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                        {row.product_img_url ? (
                          <img
                            src={row.product_img_url}
                            alt={row.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=No+Img"; }}
                          />
                        ) : (
                          <Image className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-500 text-xs">
                      {row.product_id}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {row.name}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/50">
                        {row.category || "Standard"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs text-slate-600">
                        <p><span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">GPU </span>{[row.gpu_brand, row.gpu_model].filter(Boolean).join(" ") || "—"}</p>
                        <p><span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">CPU </span>{[row.cpu_brand, row.cpu_model].filter(Boolean).join(" ") || "—"}</p>
                        <p><span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">RAM </span>{row.ram_specs || "—"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs">
                        <p className="text-slate-800 font-semibold">{formatIDR(row.retail_price_idr)}</p>
                        <p className="text-slate-400">
                          Cost: {formatIDR(row.total_unit_cost)}
                        </p>
                        {row.gross_margin != null && (
                          <p className="text-emerald-600 font-medium">
                            {(Number(row.gross_margin) * 100).toFixed(1)}% margin
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getAvailabilityClass(row.availability)}`}>
                        {row.availability || "In Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-2 text-slate-400 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5 rounded-xl transition-all cursor-pointer"
                          title="Edit Item"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b p-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
                  {modal === "add" ? "Create Product" : "Edit Product"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {modal === "edit" && `Editing ID: ${formData.product_id}`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-600">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Identity */}
              <FieldGroup title="Identity">
                <FormRow>
                  <Field label="Product ID *" name="product_id" value={formData.product_id} onChange={handleFormChange} disabled={modal === "edit"} placeholder="e.g. SIG-001" />
                  <Field label="Name *" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. SIGNATURE // AYAKA" />
                </FormRow>
                <FormRow>
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                    >
                      {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <Field label="Image URL" name="product_img_url" value={formData.product_img_url} onChange={handleFormChange} placeholder="https://…" />
                </FormRow>
              </FieldGroup>

              {/* Specifications */}
              <FieldGroup title="Specifications">
                <FormRow>
                  {/* CPU Brand Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">CPU Brand</label>
                    <select
                      name="cpu_brand"
                      value={formData.cpu_brand}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                    >
                      {CPU_BRANDS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <Field label="CPU Model" name="cpu_model" value={formData.cpu_model} onChange={handleFormChange} placeholder="e.g. Ryzen 9 7950X3D" />
                </FormRow>
                <FormRow>
                  {/* GPU Brand Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">GPU Brand</label>
                    <select
                      name="gpu_brand"
                      value={formData.gpu_brand}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                    >
                      {GPU_BRANDS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <Field label="GPU Model" name="gpu_model" value={formData.gpu_model} onChange={handleFormChange} placeholder="e.g. RTX 4090 24GB" />
                </FormRow>
                <FormRow>
                  <Field label="RAM Specs" name="ram_specs" value={formData.ram_specs} onChange={handleFormChange} placeholder="e.g. 64GB DDR5 6400MHz" />
                  {/* Cooler Type Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Cooler Type</label>
                    <select
                      name="cooler_type"
                      value={formData.cooler_type}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                    >
                      {COOLER_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </FormRow>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Target Performance / Description
                  </label>
                  <textarea
                    name="target_performance"
                    value={formData.target_performance}
                    onChange={handleFormChange}
                    rows={2}
                    placeholder="e.g. Optimized for 4K gaming and video editing workloads..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-medium text-slate-700 resize-none"
                  />
                </div>
              </FieldGroup>

              {/* Financials */}
              <FieldGroup title="Financials (IDR)">
                <FormRow>
                  <Field label="Retail Price (IDR) *" name="retail_price_idr" type="number" value={formData.retail_price_idr} onChange={handleFormChange} placeholder="0" />
                  <Field label="Component COGS (IDR) *" name="component_cogs_idr" type="number" value={formData.component_cogs_idr} onChange={handleFormChange} placeholder="0" />
                </FormRow>
                <FormRow>
                  <Field label="Labor Cost (IDR) *" name="labor_cost_idr" type="number" value={formData.labor_cost_idr} onChange={handleFormChange} placeholder="0" />
                  {/* Spacer — keeps grid aligned */}
                  <div />
                </FormRow>

                {/* Auto-computed read-only preview */}
                {(formData.retail_price_idr || formData.component_cogs_idr || formData.labor_cost_idr) && (
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Cost</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                        {formatIDR(formData.total_unit_cost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Profit</p>
                      <p className={`text-sm font-extrabold mt-0.5 ${
                        Number(formData.net_profit_idr) >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {formatIDR(formData.net_profit_idr)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Gross Margin</p>
                      <p className={`text-sm font-extrabold mt-0.5 ${
                        Number(formData.gross_margin) >= 0.2 ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {formData.gross_margin !== "" ? `${(Number(formData.gross_margin) * 100).toFixed(1)}%` : "—"}
                      </p>
                    </div>
                  </div>
                )}
              </FieldGroup>

              {/* Logistics */}
              <FieldGroup title="Logistics">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Availability Status
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </FieldGroup>
            </div>

            <div className="border-t p-5 flex gap-2 justify-end bg-slate-50/50">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7C5CFC]/15 hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving..." : modal === "add" ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 text-sm text-slate-600 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wide mb-3">Delete Product</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-slate-800">{deleteTarget.name}</strong> ({deleteTarget.product_id})? This action cannot be reversed.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/15 transition-all cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── FORM HELPERS ─────────────────────────────────────────────────────────────
function FieldGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormRow({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, name, value, onChange, type = "text", disabled = false, placeholder = "", step }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        step={step}
        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-semibold text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
      />
    </div>
  );
}