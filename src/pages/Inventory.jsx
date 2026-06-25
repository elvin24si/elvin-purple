// src/pages/Inventory.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchPCCatalog,
  insertPC,
  updatePC,
  deletePC,
  normalizePC,
} from "../lib/supabase";
import { Plus, Search, Pencil, Trash2, X, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

// ─── EMPTY FORM TEMPLATE (mirrors Supabase column names) ─────────────────────
const EMPTY_FORM = {
  product_id: "",
  name: "",
  category: "",
  product_img_url: "",
  retail_price_idr: "",
  component_cogs_idr: "",
  labor_cost_idr: "",
  total_unit_cost: "",
  net_profit_idr: "",
  gross_margin: "",
  cpu_brand: "",
  cpu_model: "",
  gpu_brand: "",
  gpu_model: "",
  ram_specs: "",
  cooler_type: "",
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getAvailabilityClass(status) {
  switch (status) {
    case "In Stock":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Special Order":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "Low Stock":
    case "Limited":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Out of Stock":
      return "bg-red-50 text-red-600 border border-red-200";
    default:
      return "bg-slate-100 text-slate-500 border border-slate-200";
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
    return rows.filter(
      (r) =>
        r.product_id?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
    );
  }, [rows, searchTerm]);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormError(null);
    setModal("add");
  };

  const openEdit = (row) => {
    // Pre-populate form with existing raw values
    setFormData({
      product_id: row.product_id ?? "",
      name: row.name ?? "",
      category: row.category ?? "",
      product_img_url: row.product_img_url ?? "",
      retail_price_idr: row.retail_price_idr ?? "",
      component_cogs_idr: row.component_cogs_idr ?? "",
      labor_cost_idr: row.labor_cost_idr ?? "",
      total_unit_cost: row.total_unit_cost ?? "",
      net_profit_idr: row.net_profit_idr ?? "",
      gross_margin: row.gross_margin ?? "",
      cpu_brand: row.cpu_brand ?? "",
      cpu_model: row.cpu_model ?? "",
      gpu_brand: row.gpu_brand ?? "",
      gpu_model: row.gpu_model ?? "",
      ram_specs: row.ram_specs ?? "",
      cooler_type: row.cooler_type ?? "",
      availability: row.availability ?? "In Stock",
      target_performance: row.target_performance ?? "",
    });
    setFormError(null);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormError(err.message);
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
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory Manager
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? "Loading…" : `${rows.length} active configuration${rows.length !== 1 ? "s" : ""} in pc_catalog`}
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, name, or category…"
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-full transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Refresh */}
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Add */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <p className="text-sm uppercase tracking-widest">Loading inventory…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Specifications</th>
                  <th className="px-6 py-4">Financials</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                      No products match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <InventoryRow
                      key={row.product_id}
                      row={row}
                      onEdit={() => openEdit(row)}
                      onDelete={() => setDeleteTarget(row)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  {modal === "add" ? "Add New Product" : "Edit Product"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {modal === "edit" && `Editing: ${formData.product_id}`}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              {/* Identity */}
              <FieldGroup title="Identity">
                <FormRow>
                  <Field label="Product ID *" name="product_id" value={formData.product_id} onChange={handleFormChange} disabled={modal === "edit"} placeholder="e.g. SIG-001" />
                  <Field label="Name *" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. SIGNATURE // AYAKA" />
                </FormRow>
                <FormRow>
                  <Field label="Category" name="category" value={formData.category} onChange={handleFormChange} placeholder="e.g. Signature, Standard" />
                  <Field label="Image URL" name="product_img_url" value={formData.product_img_url} onChange={handleFormChange} placeholder="https://…" />
                </FormRow>
              </FieldGroup>

              {/* Specifications */}
              <FieldGroup title="Specifications">
                <FormRow>
                  <Field label="CPU Brand" name="cpu_brand" value={formData.cpu_brand} onChange={handleFormChange} placeholder="e.g. AMD, Intel" />
                  <Field label="CPU Model" name="cpu_model" value={formData.cpu_model} onChange={handleFormChange} placeholder="e.g. Ryzen 9 7950X3D" />
                </FormRow>
                <FormRow>
                  <Field label="GPU Brand" name="gpu_brand" value={formData.gpu_brand} onChange={handleFormChange} placeholder="e.g. NVIDIA, AMD" />
                  <Field label="GPU Model" name="gpu_model" value={formData.gpu_model} onChange={handleFormChange} placeholder="e.g. RTX 4090 24GB" />
                </FormRow>
                <FormRow>
                  <Field label="RAM Specs" name="ram_specs" value={formData.ram_specs} onChange={handleFormChange} placeholder="e.g. 64GB DDR5 6400MHz" />
                  <Field label="Cooler Type" name="cooler_type" value={formData.cooler_type} onChange={handleFormChange} placeholder="e.g. Custom Loop, AIO 360mm" />
                </FormRow>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
                    Target Performance / Description
                  </label>
                  <textarea
                    name="target_performance"
                    value={formData.target_performance}
                    onChange={handleFormChange}
                    rows={2}
                    placeholder="e.g. Optimized for 4K gaming and video editing workloads"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                  />
                </div>
              </FieldGroup>

              {/* Financials */}
              <FieldGroup title="Financials (IDR)">
                <FormRow>
                  <Field label="Retail Price (IDR)" name="retail_price_idr" type="number" value={formData.retail_price_idr} onChange={handleFormChange} placeholder="0" />
                  <Field label="Component COGS (IDR)" name="component_cogs_idr" type="number" value={formData.component_cogs_idr} onChange={handleFormChange} placeholder="0" />
                </FormRow>
                <FormRow>
                  <Field label="Labor Cost (IDR)" name="labor_cost_idr" type="number" value={formData.labor_cost_idr} onChange={handleFormChange} placeholder="0" />
                  <Field label="Total Unit Cost (IDR)" name="total_unit_cost" type="number" value={formData.total_unit_cost} onChange={handleFormChange} placeholder="0" />
                </FormRow>
                <FormRow>
                  <Field label="Net Profit (IDR)" name="net_profit_idr" type="number" value={formData.net_profit_idr} onChange={handleFormChange} placeholder="0" />
                  <Field label="Gross Margin (0.000–1.000)" name="gross_margin" type="number" step="0.001" value={formData.gross_margin} onChange={handleFormChange} placeholder="0.350" />
                </FormRow>
              </FieldGroup>

              {/* Logistics */}
              <FieldGroup title="Availability">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
                    Availability Status
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </FieldGroup>

            </form>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="inventory-form"
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {modal === "add" ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Delete Product?</h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  This will permanently remove{" "}
                  <span className="font-semibold text-slate-700">{deleteTarget.name}</span>{" "}
                  (<span className="font-mono text-xs">{deleteTarget.product_id}</span>) from the database. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TABLE ROW ───────────────────────────────────────────────────────────────
function InventoryRow({ row, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">

      {/* Column 1: Product */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={row.product_img_url || "https://via.placeholder.com/40"}
            alt={row.name}
            className="w-10 h-10 rounded-md object-cover border border-slate-200 shadow-sm flex-shrink-0"
            onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
          />
          <div className="min-w-0">
            <p className="text-xs font-mono text-purple-600 mb-0.5">{row.product_id}</p>
            <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{row.name}</p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{row.category ?? "—"}</p>
          </div>
        </div>
      </td>

      {/* Column 2: Specs */}
      <td className="px-6 py-5">
        <div className="space-y-1 text-xs text-slate-600">
          <p><span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">GPU </span>{[row.gpu_brand, row.gpu_model].filter(Boolean).join(" ") || "—"}</p>
          <p><span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">CPU </span>{[row.cpu_brand, row.cpu_model].filter(Boolean).join(" ") || "—"}</p>
          <p><span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">RAM </span>{row.ram_specs || "—"}</p>
        </div>
      </td>

      {/* Column 3: Financials */}
      <td className="px-6 py-5">
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

      {/* Column 4: Status */}
      <td className="px-6 py-5">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getAvailabilityClass(row.availability)}`}>
          {row.availability ?? "Unknown"}
        </span>
      </td>

      {/* Column 5: Actions */}
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-purple-600 rounded-md transition-all"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
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
      <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
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
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
      />
    </div>
  );
}