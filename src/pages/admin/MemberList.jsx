// src/pages/admin/MemberList.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchMember,
  insertMember,
  updateMember,
  deleteMember,
  normalizeMember,
} from "../../lib/supabasemem";
import { Plus, Search, Pencil, Trash2, X, Loader2, AlertTriangle, RefreshCw, User } from "lucide-react";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  role: "",
  avatar_url: "",
  current_points: 0,
  lifetime_points_earned: 0,
  times_ordered: 0,
  total_spent_idr: 0,
  last_order_date: "",
  notification: false,
};

const ROLE_OPTIONS = ["Individual", "Business/Organization", "Admin"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatIDR(val) {
  const n = Number(val);
  if (!val || isNaN(n)) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

function getRoleClass(role) {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return "bg-purple-50 text-purple-700 border border-purple-100 font-bold";
    case "business/organization":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold";
    case "individual":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-200";
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MemberList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal state: null | "add" | "edit"
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState(null); // set when editing

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null); // raw row
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchMember()
      .then((data) => setRows((data || []).map(normalizeMember)))
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
      // Role filter
      .filter((r) => roleFilter === "All" || (r.role || "").toLowerCase() === roleFilter.toLowerCase())
      // Text search
      .filter(
        (r) =>
          r.member_id?.toLowerCase().includes(q) ||
          r.username?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q)
      );
  }, [rows, searchTerm, roleFilter]);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setActiveMemberId(null);
    setFormError(null);
    setModal("add");
  };

  const openEdit = (row) => {
    setFormData({
      username: row.username ?? "",
      email: row.email ?? "",
      password: row.password ?? "",
      role: row.role ?? "",
      avatar_url: row.avatar_url ?? "",
      current_points: row.current_points ?? 0,
      lifetime_points_earned: row.lifetime_points_earned ?? 0,
      times_ordered: row.times_ordered ?? 0,
      total_spent_idr: row.total_spent_idr ?? 0,
      last_order_date: row.last_order_date ?? "",
      notification: row.notification === true,
    });
    setActiveMemberId(row.member_id);
    setFormError(null);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setActiveMemberId(null);
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Build the payload — convert numeric strings to numbers for Supabase
  const buildPayload = (data) => ({
    ...data,
    current_points: data.current_points !== "" ? Number(data.current_points) : null,
    lifetime_points_earned:
      data.lifetime_points_earned !== "" ? Number(data.lifetime_points_earned) : null,
    times_ordered: data.times_ordered !== "" ? Number(data.times_ordered) : null,
    total_spent_idr: data.total_spent_idr !== "" ? Number(data.total_spent_idr) : null,
    last_order_date: data.last_order_date !== "" ? data.last_order_date : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFormError("Username is required.");
      return;
    }
    if (modal === "add" && !formData.password.trim()) {
      setFormError("Password is required for new accounts.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = buildPayload(formData);
      if (modal === "add") {
        await insertMember({
          ...payload,
          member_id: crypto.randomUUID(),
          join_date: new Date().toISOString(),
        });
      } else {
        await updateMember(activeMemberId, payload);
      }
      closeModal();
      loadData();
    } catch (err) {
      setFormError(err.message || "Failed to save member details.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMember(deleteTarget.member_id);
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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Member List</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Loading members..." : `Configure and manage ${rows.length} registered member account${rows.length !== 1 ? "s" : ""} in the system.`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#7C5CFC]/15 hover:shadow-lg hover:shadow-[#7C5CFC]/25 transition-all duration-300 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search members by username, email, or member ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all duration-200 text-slate-700"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white cursor-pointer"
          >
            <option value="All">Role: All</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
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
          <span>Error loading members: {error}</span>
        </div>
      )}

      {/* MAIN MEMBER LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" />
            <span>Loading members data...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            {searchTerm ? "No members match your search query." : "No member accounts found. Click 'Add Member' to register your first one!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6 w-[80px]">Avatar</th>
                  <th className="py-4 px-4 w-[120px]">Member ID</th>
                  <th className="py-4 px-4">Username</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4 w-[140px] text-center">Points Balance</th>
                  <th className="py-4 px-4 w-[160px] text-right">Total Spent</th>
                  <th className="py-4 px-4 w-[130px] text-center">Role</th>
                  <th className="py-4 px-4 w-[120px] text-center">Notification</th>
                  <th className="py-4 px-6 w-[120px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filtered.map((row) => (
                  <tr key={row.member_id} className="hover:bg-slate-50/40 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                        {row.avatar_url ? (
                          <img
                            src={row.avatar_url}
                            alt={row.username}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=No+Img"; }}
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-500 text-xs">
                      {row.member_id?.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      <div>
                        <p>{row.username}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">Joined {formatDate(row.join_date)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {row.email || "—"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md inline-block">
                          {row.current_points != null ? row.current_points.toLocaleString("id-ID") : "0"} PTS
                        </span>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                          Lifetime: {row.lifetime_points_earned != null ? row.lifetime_points_earned.toLocaleString("id-ID") : "0"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-800 tabular-nums">
                      <div className="space-y-0.5">
                        <p>{formatIDR(row.total_spent_idr)}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">
                          {row.times_ordered ?? 0} order{row.times_ordered === 1 ? "" : "s"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getRoleClass(row.role)}`}>
                        {row.role || "Individual"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={async () => {
                          try {
                            const newVal = !row.notification;
                            await updateMember(row.member_id, { notification: newVal });
                            setRows(prev => prev.map(r => r.member_id === row.member_id ? { ...r, notification: newVal } : r));
                          } catch (err) {
                            alert(`Failed to toggle notification: ${err.message}`);
                          }
                        }}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer select-none
                          ${row.notification
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100 font-bold hover:bg-rose-100"
                          }`}
                      >
                        {row.notification ? "Subscribed" : "Unsubscribed"}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-2 text-slate-400 hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/5 rounded-xl transition-all cursor-pointer"
                          title="Edit Member"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Member"
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
            id="inventory-form"
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b p-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
                  {modal === "add" ? "Create Member" : "Edit Member"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {modal === "edit" && `Editing ID: ${activeMemberId}`}
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
                  <Field label="Username *" name="username" value={formData.username} onChange={handleFormChange} placeholder="e.g. john_doe" />
                  <Field label="Email *" name="email" value={formData.email} onChange={handleFormChange} placeholder="e.g. john.doe@example.com" />
                </FormRow>
                <FormRow>
                  <Field label={modal === "add" ? "Password *" : "Password (Change if needed)"} name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="••••••••" />
                  <Field label="Avatar URL" name="avatar_url" value={formData.avatar_url} onChange={handleFormChange} placeholder="https://…" />
                </FormRow>
              </FieldGroup>

              {/* Loyalty */}
              <FieldGroup title="Loyalty & Account Details">
                <FormRow>
                  <Field label="Current Points" name="current_points" type="number" value={formData.current_points} onChange={handleFormChange} placeholder="0" />
                  <Field label="Lifetime Points Earned" name="lifetime_points_earned" type="number" value={formData.lifetime_points_earned} onChange={handleFormChange} placeholder="0" />
                </FormRow>
                <FormRow>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Account Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                    >
                      <option value="">— Select role —</option>
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Email Notification
                    </label>
                    <select
                      name="notification"
                      value={formData.notification ? "true" : "false"}
                      onChange={(e) => setFormData(prev => ({ ...prev, notification: e.target.value === "true" }))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#7C5CFC] text-xs font-semibold text-slate-700 bg-white"
                    >
                      <option value="true">Subscribed (Yes)</option>
                      <option value="false">Unsubscribed (No)</option>
                    </select>
                  </div>
                </FormRow>
              </FieldGroup>

              {/* Order History */}
              <FieldGroup title="Order History">
                <FormRow>
                  <Field label="Times Ordered" name="times_ordered" type="number" value={formData.times_ordered} onChange={handleFormChange} placeholder="0" />
                  <Field label="Total Spent (IDR)" name="total_spent_idr" type="number" value={formData.total_spent_idr} onChange={handleFormChange} placeholder="0" />
                </FormRow>
              </FieldGroup>

              {/* Dates */}
              <FieldGroup title="Dates">
                <FormRow>
                  <Field label="Last Order Date" name="last_order_date" type="date" value={formData.last_order_date} onChange={handleFormChange} />
                </FormRow>
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
                {saving ? "Saving..." : modal === "add" ? "Create Member" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 text-sm text-slate-600 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wide mb-3">Delete Member</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-slate-800">{deleteTarget.username}</strong> ({deleteTarget.member_id})? This action cannot be reversed.
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
