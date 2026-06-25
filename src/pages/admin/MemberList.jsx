
import { useState, useEffect, useMemo, useCallback } from "react";
import {
    fetchMember,
    insertMember,
    updateMember,
    deleteMember,
    normalizeMember,
} from "../../lib/supabasemem";
import { Plus, Search, Pencil, Trash2, X, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

// ─── EMPTY FORM TEMPLATE (mirrors Supabase column names) ─────────────────────
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
};

const ROLE_OPTIONS = ["Individual", "Business/Organization", "Admin"];

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
            return "bg-purple-50 text-purple-600 border border-purple-100";
        case "staff":
            return "bg-blue-50 text-blue-600 border border-blue-100";
        case "vip":
            return "bg-amber-50 text-amber-600 border border-amber-100";
        default:
            return "bg-slate-50 text-slate-500 border border-slate-200";
    }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MemberList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
        return rows.filter(
            (r) =>
                r.member_id?.toLowerCase().includes(q) ||
                r.username?.toLowerCase().includes(q) ||
                r.email?.toLowerCase().includes(q)
        );
    }, [rows, searchTerm]);

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
            password: row.password ?? "", // ◄ Added
            role: row.role ?? "",
            avatar_url: row.avatar_url ?? "",
            current_points: row.current_points ?? 0,
            lifetime_points_earned: row.lifetime_points_earned ?? 0,
            times_ordered: row.times_ordered ?? 0,
            total_spent_idr: row.total_spent_idr ?? 0,
            last_order_date: row.last_order_date ?? "",
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
        // Empty string means "not set" — send null so Supabase stores it as empty, not "".
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
                // member_id and join_date are generated at write-time, not user input.
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
        <div className="max-w-7xl mx-auto px-6 py-10">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Member List
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {loading ? "Loading…" : `${rows.length} active member${rows.length !== 1 ? "s" : ""} in members`}
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, username, or email…"
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
                        Add Member
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
                        <p className="text-sm uppercase tracking-widest">Loading members…</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                    <th className="px-6 py-4">Member</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Points</th>
                                    <th className="px-6 py-4">Orders / Spend</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                                            No members match your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row) => (
                                        <MemberRow
                                            key={row.member_id}
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
                                    {modal === "add" ? "Add New Member" : "Edit Member"}
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {modal === "edit" && `Editing: ${activeMemberId}`}
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
                        <form id="inventory-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

                            {formError && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    {formError}
                                </div>
                            )}

                            {/* Identity */}
                            <FieldGroup title="Identity">
                                <FormRow>
                                    <Field
                                        label="Username *"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleFormChange}
                                        placeholder="e.g. john_doe"
                                    />
                                    <Field
                                        label="Email *"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        placeholder="e.g. john.doe@example.com"
                                    />
                                </FormRow>

                                <FormRow>
                                    {/* New Password Field Row Control */}
                                    <Field
                                        label={modal === "add" ? "Password *" : "Password (Change if needed)"}
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        placeholder="••••••••"
                                    />
                                    <Field
                                        label="Avatar URL"
                                        name="avatar_url"
                                        value={formData.avatar_url}
                                        onChange={handleFormChange}
                                        placeholder="https://…"
                                    />
                                </FormRow>
                                <p className="text-[11px] text-slate-400">
                                    Member ID and Join Date are generated automatically when this is saved.
                                </p>
                            </FieldGroup>

                            {/* Loyalty */}
                            <FieldGroup title="Loyalty">
                                <FormRow>
                                    <Field label="Current Points" name="current_points" type="number" value={formData.current_points} onChange={handleFormChange} placeholder="0" />
                                    <Field label="Lifetime Points Earned" name="lifetime_points_earned" type="number" value={formData.lifetime_points_earned} onChange={handleFormChange} placeholder="0" />
                                </FormRow>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleFormChange}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    >
                                        <option value="">— Select role —</option>
                                        {ROLE_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
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
                                    <Field label="Last Order Date (optional)" name="last_order_date" type="date" value={formData.last_order_date} onChange={handleFormChange} />
                                </FormRow>
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
                                disabled={saving}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all"
                            >
                                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {modal === "add" ? "Create Member" : "Save Changes"}
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
                                <h2 className="text-base font-bold text-slate-900">Delete Member?</h2>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    This will permanently remove{" "}
                                    <span className="font-semibold text-slate-700">{deleteTarget.username}</span>{" "}
                                    (<span className="font-mono text-xs">{deleteTarget.member_id}</span>) from the database. This action cannot be undone.
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
function MemberRow({ row, onEdit, onDelete }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">

            {/* Column 1: Member */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <img
                        src={row.avatar_url || "https://via.placeholder.com/40"}
                        alt={row.username}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                    />
                    <div className="min-w-0">
                        <p className="text-xs font-mono text-purple-600 mb-0.5">{row.member_id}</p>
                        <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{row.username}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            Joined {formatDate(row.join_date)}
                        </p>
                    </div>
                </div>
            </td>

            {/* Column 2: Contact */}
            <td className="px-6 py-5">
                <p className="text-xs text-slate-600 truncate max-w-[220px]">{row.email || "—"}</p>
            </td>

            {/* Column 3: Points */}
            <td className="px-6 py-5">
                <div className="space-y-1 text-xs">
                    <p className="text-slate-800 font-semibold">
                        {row.current_points != null ? row.current_points.toLocaleString("id-ID") : "—"} pts
                    </p>
                    <p className="text-slate-400">
                        Lifetime: {row.lifetime_points_earned != null ? row.lifetime_points_earned.toLocaleString("id-ID") : "—"}
                    </p>
                </div>
            </td>

            {/* Column 4: Orders / Spend */}
            <td className="px-6 py-5">
                <div className="space-y-1 text-xs">
                    <p className="text-slate-800 font-semibold">{formatIDR(row.total_spent_idr)}</p>
                    <p className="text-slate-400">
                        {row.times_ordered ?? 0} order{row.times_ordered === 1 ? "" : "s"}
                    </p>
                    <p className="text-slate-400">Last: {formatDate(row.last_order_date)}</p>
                </div>
            </td>

            {/* Column 5: Role */}
            <td className="px-6 py-5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getRoleClass(row.role)}`}>
                    {row.role || "Unknown"}
                </span>
            </td>

            {/* Column 6: Actions */}
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

