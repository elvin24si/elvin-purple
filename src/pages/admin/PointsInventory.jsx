// src/pages/admin/PointsInventory.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchPCCatalog,
  insertPC,
  updatePC,
  deletePC,
} from "../../lib/supabasepc";
import { Plus, Search, Pencil, Trash2, X, Loader2, AlertTriangle, RefreshCw, Coins, Image, ToggleLeft, ToggleRight, Check } from "lucide-react";

// ─── EMPTY FORM TEMPLATE ─────────────────────────────────────────────────────
const EMPTY_FORM = {
  product_id: "",
  name: "",
  category: "Accessory",
  product_img_url: "",
  retail_price_idr: "0",
  allow_cash_payment: true,
  allow_points_payment: true,
  points_price: "",
  availability: "In Stock",
  target_performance: "",
};

const AVAILABILITY_OPTIONS = [
  "In Stock",
  "Limited",
  "Low Stock",
  "Out of Stock",
];

const CATEGORY_OPTIONS = [
  "Accessory",
  "Merch",
  "Hardware",
  "PC Part",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getAvailabilityClass(status) {
  switch (status) {
    case "In Stock":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold";
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
  if (!val || isNaN(n)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PointsInventory() {
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPCCatalog()
      .then((data) => {
        // Filter specifically for Point Shop items (where allow_points_payment === true)
        const pointsProducts = data.filter((item) => item.allow_points_payment === true);
        setRows(pointsProducts);
      })
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

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setFormData({
      ...EMPTY_FORM,
      product_id: `PT-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 10)}`, // Auto generate product ID
    });
    setFormError(null);
    setModal("add");
  };

  const handleOpenEdit = (row) => {
    setFormData({
      product_id: row.product_id || "",
      name: row.name || "",
      category: row.category || "Accessory",
      product_img_url: row.product_img_url || "",
      retail_price_idr: String(row.retail_price_idr ?? 0),
      allow_cash_payment: row.allow_cash_payment !== false,
      allow_points_payment: row.allow_points_payment !== false,
      points_price: String(row.points_price ?? ""),
      availability: row.availability || "In Stock",
      target_performance: row.target_performance || "",
    });
    setFormError(null);
    setModal("edit");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.product_id.trim()) return setFormError("Product ID is required.");
    if (!formData.name.trim()) return setFormError("Product Name is required.");
    
    if (formData.allow_points_payment) {
      if (!formData.points_price || isNaN(Number(formData.points_price)) || Number(formData.points_price) <= 0) {
        return setFormError("Points Price must be a valid positive integer.");
      }
    }

    if (!formData.allow_cash_payment && !formData.allow_points_payment) {
      return setFormError("Item must accept either Cash or Points payments (or both).");
    }

    const payload = {
      product_id: formData.product_id.trim(),
      name: formData.name.trim(),
      category: formData.category,
      product_img_url: formData.product_img_url.trim() || null,
      retail_price_idr: Number(formData.retail_price_idr) || 0,
      allow_cash_payment: formData.allow_cash_payment,
      allow_points_payment: formData.allow_points_payment,
      points_price: formData.allow_points_payment ? Number(formData.points_price) : null,
      availability: formData.availability,
      target_performance: formData.target_performance.trim() || null,
    };

    setSaving(true);
    try {
      if (modal === "add") {
        await insertPC(payload);
      } else {
        await updatePC(payload.product_id, payload);
      }
      setModal(null);
      loadData();
    } catch (err) {
      setFormError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePC(deleteTarget.product_id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8 bg-slate-50/20 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Points Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Configure and manage items inside the loyalty Points Shop ecosystem.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#7C5CFC]/15 hover:shadow-lg hover:shadow-[#7C5CFC]/25 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Point Shop Item
        </button>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by name, category, or product ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all duration-200 text-slate-700"
          />
        </div>
        
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#7C5CFC] border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#7C5CFC]/30 transition-all font-bold shadow-2xs bg-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload
        </button>
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
            <span>Loading point shop inventory...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            {searchTerm ? "No products match your search query." : "No Points Shop items found. Click 'Add Points Product' to insert your first one!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6 w-[80px]">Preview</th>
                  <th className="py-4 px-4 w-[120px]">Product ID</th>
                  <th className="py-4 px-4">Item Name</th>
                  <th className="py-4 px-4 w-[130px]">Category</th>
                  <th className="py-4 px-4 w-[130px] text-center">Status</th>
                  <th className="py-4 px-4 w-[130px] text-center">Points Cost</th>
                  <th className="py-4 px-6 w-[160px] text-right">Retail Price</th>
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
                        {row.category || "Accessory"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getAvailabilityClass(row.availability)}`}>
                        {row.availability || "In Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.allow_points_payment ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                          <Coins className="w-3.5 h-3.5" />
                          {row.points_price} PTS
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-800 tabular-nums">
                      {row.allow_cash_payment ? (
                        formatIDR(row.retail_price_idr)
                      ) : (
                        <span className="text-rose-600 bg-rose-50 border border-rose-100 font-extrabold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded">
                          Points Only
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(row)}
                          className="p-2 text-slate-400 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5 rounded-xl transition-all"
                          title="Edit Item"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b p-5">
              <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
                {modal === "add" ? "Create Point Product" : "Edit Point Product"}
              </h2>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-600">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Product ID & Name */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">ID</label>
                  <input
                    type="text"
                    name="product_id"
                    disabled={modal === "edit"}
                    value={formData.product_id}
                    onChange={handleFormChange}
                    placeholder="PT-001"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="WhiteFrame Keycap Set"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                  >
                    {AVAILABILITY_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image URL */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Product Image Link</label>
                <input
                  type="text"
                  name="product_img_url"
                  value={formData.product_img_url}
                  onChange={handleFormChange}
                  placeholder="https://example.com/item-image.png"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-medium text-slate-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description (Performance Tag)</label>
                <textarea
                  name="target_performance"
                  value={formData.target_performance}
                  onChange={handleFormChange}
                  placeholder="A premium custom accessory with textured keycaps and sleek profile..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-medium resize-none text-slate-700"
                />
              </div>

              {/* Payment Rules Checkboxes */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Payment Rules & Pricing</h4>
                
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="allow_cash_payment"
                      checked={formData.allow_cash_payment}
                      onChange={handleFormChange}
                      className="rounded border-slate-300 text-[#7C5CFC] focus:ring-[#7C5CFC]/30 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-600">Allow Cash Purchases</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="allow_points_payment"
                      checked={formData.allow_points_payment}
                      onChange={handleFormChange}
                      className="rounded border-slate-300 text-[#7C5CFC] focus:ring-[#7C5CFC]/30 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-600">Allow Points Redemptions</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1.5">
                  <div>
                    <label className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${formData.allow_cash_payment ? "text-slate-500" : "text-slate-300"}`}>Retail Price (IDR)</label>
                    <input
                      type="number"
                      name="retail_price_idr"
                      disabled={!formData.allow_cash_payment}
                      value={formData.retail_price_idr}
                      onChange={handleFormChange}
                      placeholder="Rp150.000"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-bold disabled:bg-slate-100 disabled:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${formData.allow_points_payment ? "text-slate-500" : "text-slate-300"}`}>Points Price (PTS)</label>
                    <input
                      type="number"
                      name="points_price"
                      disabled={!formData.allow_points_payment}
                      value={formData.points_price}
                      onChange={handleFormChange}
                      placeholder="50"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-bold disabled:bg-slate-100 disabled:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-5 flex gap-2 justify-end bg-slate-50/50">
              <button
                type="button"
                onClick={() => setModal(null)}
                disabled={saving}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7C5CFC]/15 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 text-sm text-slate-600 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wide mb-3">Delete Points Product</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-slate-800">{deleteTarget.name}</strong> ({deleteTarget.product_id})? This action cannot be reversed.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/15 transition-all"
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
