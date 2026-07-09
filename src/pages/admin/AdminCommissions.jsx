// src/pages/admin/AdminCommissions.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchCommissions, updateCommission, deleteCommission } from "../../lib/supabasemem";
import { Search, Pencil, Trash2, X, Loader2, AlertTriangle, RefreshCw, Clock, CheckCircle, XCircle, HelpCircle, Sparkles, User, Mail, MessageSquare } from "lucide-react";

// Helper for Status Badge styling
const getStatusBadge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-100 font-bold";
    case "reviewing":
      return "bg-blue-50 text-blue-700 border border-blue-100 font-bold";
    case "approved":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold";
    case "rejected":
      return "bg-rose-50 text-rose-700 border border-rose-100 font-bold";
    case "completed":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-200";
  }
};

const STATUS_OPTIONS = ["Pending", "Reviewing", "Approved", "Rejected", "Completed"];

export default function AdminCommissions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest

  // Modal State: null | "edit"
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ id: "", status: "Pending", admin_notes: "" });
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load commissions
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCommissions()
      .then(setRows)
      .catch((err) => {
        console.warn("Failed to load commissions from Supabase, loading fallback cache", err);
        // Fallback loading from local storage
        try {
          const cached = JSON.parse(localStorage.getItem("custom_commissions") || "[]");
          setRows(cached.reverse()); // Reverse to show newest first by default
        } catch (e) {
          setError("Failed to load custom requests.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering & Sorting logic
  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.email?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.member_id?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((r) => (r.status || "Pending").toLowerCase() === statusFilter.toLowerCase());
    }

    // Need type filter
    if (typeFilter !== "All") {
      result = result.filter((r) => (r.request_type || "Individual").toLowerCase() === typeFilter.toLowerCase());
    }

    // Role filter
    if (roleFilter !== "All") {
      if (roleFilter === "Member") {
        result = result.filter((r) => r.member_id !== null && r.member_id !== undefined && r.member_id !== "");
      } else {
        result = result.filter((r) => !r.member_id);
      }
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [rows, searchTerm, statusFilter, typeFilter, roleFilter, sortOrder]);

  const handleOpenEdit = (row) => {
    setFormData({
      id: row.id,
      status: row.status || "Pending",
      admin_notes: row.admin_notes || "",
    });
    setFormError(null);
    setModal("edit");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      await updateCommission(formData.id, {
        status: formData.status,
        admin_notes: formData.admin_notes.trim() || null,
      });

      // Update local state directly to avoid full reload delay
      setRows((prev) =>
        prev.map((r) =>
          r.id === formData.id
            ? { ...r, status: formData.status, admin_notes: formData.admin_notes.trim() || null }
            : r
        )
      );
      setModal(null);
    } catch (err) {
      console.warn("Supabase update failed, attempting local cache fallback", err);
      try {
        // Fallback updates in cached storage
        const cached = JSON.parse(localStorage.getItem("custom_commissions") || "[]");
        const updated = cached.map((r) =>
          r.id === formData.id
            ? { ...r, status: formData.status, admin_notes: formData.admin_notes.trim() || null }
            : r
        );
        localStorage.setItem("custom_commissions", JSON.stringify(updated));
        
        setRows((prev) =>
          prev.map((r) =>
            r.id === formData.id
              ? { ...r, status: formData.status, admin_notes: formData.admin_notes.trim() || null }
              : r
          )
        );
        setModal(null);
      } catch (e) {
        setFormError(err.message || "Failed to update commission request.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await deleteCommission(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.warn("Supabase delete failed, attempting local cache fallback", err);
      try {
        const cached = JSON.parse(localStorage.getItem("custom_commissions") || "[]");
        const updated = cached.filter((r) => r.id !== deleteTarget.id);
        localStorage.setItem("custom_commissions", JSON.stringify(updated));
        setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      } catch (e) {
        alert(`Delete failed: ${err.message}`);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8 bg-slate-50/20 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Custom Build Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Review, manage status, and leave architectural notes on custom rig requests.</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#7C5CFC] border border-slate-200 px-4 py-2.5 rounded-xl hover:border-[#7C5CFC]/30 transition-all font-bold shadow-2xs bg-white cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload
        </button>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm items-center">
        {/* Search */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search email or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all duration-200 text-slate-700"
          />
        </div>

        {/* Filter Type */}
        <div className="relative md:col-span-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">Type: All</option>
            <option value="Individual">Individual</option>
            <option value="Organization">Organization</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="relative md:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">Status: All</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Filter Role */}
        <div className="relative md:col-span-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">Sender: All</option>
            <option value="Member">Members Only</option>
            <option value="Guest">Guests Only</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="relative md:col-span-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>
      </div>

      {/* ERROR MESSAGE CUE */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Error loading requests: {error}</span>
        </div>
      )}

      {/* MAIN INVENTORY LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" />
            <span>Loading custom requests...</span>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            No commission requests match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6 w-[130px]">Submitted At</th>
                  <th className="py-4 px-4">Client Detail</th>
                  <th className="py-4 px-4 w-[120px] text-center">Type</th>
                  <th className="py-4 px-4 w-[110px] text-center">Focus</th>
                  <th className="py-4 px-4">Custom Request Description</th>
                  <th className="py-4 px-4 w-[130px] text-center">Status</th>
                  <th className="py-4 px-4 w-[140px]">Notes Preview</th>
                  <th className="py-4 px-6 w-[120px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                    {/* Submitted At */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                      {new Date(row.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {new Date(row.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>

                    {/* Client Detail */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <p className="font-bold text-slate-800 text-xs truncate max-w-[160px]">{row.email}</p>
                        </div>
                        {row.member_id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-black tracking-widest uppercase bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded">
                              MEMBER
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">ID: {row.member_id.substring(0, 8)}</span>
                          </div>
                        ) : (
                          <span className="inline-block text-[8px] font-black tracking-widest uppercase bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                            GUEST
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Need Type */}
                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/50">
                        {row.request_type || "Individual"}
                      </span>
                    </td>

                    {/* Usage Focus */}
                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/50">
                        {row.usage_focus || "Gaming"}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 max-w-[280px]">
                      <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-2" title={row.description}>
                        {row.description}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getStatusBadge(row.status)}`}>
                        {row.status || "Pending"}
                      </span>
                    </td>

                    {/* Notes Preview */}
                    <td className="py-4 px-4 max-w-[140px] text-xs text-slate-400 italic">
                      <p className="truncate" title={row.admin_notes}>
                        {row.admin_notes || "No notes written."}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(row)}
                          className="p-2 text-slate-400 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5 rounded-xl transition-all cursor-pointer"
                          title="Review / Write Notes"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Request"
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

      {/* EDIT STATUS & NOTES MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b p-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
                  Review Commission Request
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update status and architectural notes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-600">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Request Progress Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Architectural Notes / Feedback
                </label>
                <textarea
                  name="admin_notes"
                  value={formData.admin_notes}
                  onChange={handleFormChange}
                  rows={5}
                  placeholder="Provide details such as spec recommendations, components availability, custom build timeline, or pricing quote details..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 text-xs font-medium text-slate-700 resize-none transition-all"
                />
              </div>
            </div>

            <div className="border-t p-5 flex gap-2 justify-end bg-slate-50/50">
              <button
                type="button"
                onClick={() => setModal(null)}
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
                {saving ? "Saving..." : "Save Feedback"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 text-sm text-slate-600 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wide mb-3">Delete Request</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to permanently delete this commission request from <strong className="text-slate-800">{deleteTarget.email}</strong>? This action cannot be reversed.
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
                onClick={handleDelete}
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
