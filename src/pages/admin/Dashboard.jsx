// src/pages/admin/Dashboard.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchOrders, fetchPCCatalog, updateOrderStatus, updateOrderItemStatus } from "../../lib/supabasepc";
import { fetchMember, fetchCommissions } from "../../lib/supabasemem";
import { Loader2, Check, X, ClipboardList, BarChart3, TrendingUp, Users, Inbox, ShoppingBag, Sparkles, Clock, RefreshCw, ChevronRight, Wrench, TestTube2, Package } from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";

// ─── SVG CHART: Area Line ────────────────────────────────────────────────────
function AreaLineChart({ data, label, color = "#7C5CFC" }) {
  if (!data || data.length === 0) return null;
  const w = 400, h = 100, pad = 8;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  const linePath = `M ${pts.join(" L ")}`;
  const areaPath = `M ${pts[0]} L ${pts.join(" L ")} L ${pad + (w - pad * 2)},${h - pad} L ${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${label})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const [x, y] = pts[i].split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

// ─── SVG CHART: Donut Ring ───────────────────────────────────────────────────
function DonutRing({ value, max, label, color = "#7C5CFC", size = 80 }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 30, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="800" fill="#1e293b">
        {Math.round(pct * 100)}%
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#94a3b8" fontWeight="600">
        {label}
      </text>
    </svg>
  );
}

// ─── HTML BAR CHART: Horizontal ──────────────────────────────────────────────
function HBarChart({ items }) {
  // items: [{ label, value, color }]
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            <span>{item.label}</span>
            <span className="text-slate-800">{item.value}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PIPELINE STEP INDICATOR ─────────────────────────────────────────────────
const PIPELINE_STEPS = ["confirmed", "building", "testing", "completed"];
const PIPELINE_LABELS = { confirmed: "Confirmed", building: "Building", testing: "Testing", completed: "Shipped" };
const PIPELINE_ICONS = { confirmed: Check, building: Wrench, testing: TestTube2, completed: Package };

function PipelineSteps({ currentStatus }) {
  const idx = PIPELINE_STEPS.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-0">
      {PIPELINE_STEPS.map((step, i) => {
        const Icon = PIPELINE_ICONS[step];
        const done = i <= idx;
        const active = i === idx;
        return (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                active ? "bg-[#7C5CFC] border-[#7C5CFC] shadow-md shadow-[#7C5CFC]/30" :
                done   ? "bg-emerald-500 border-emerald-500" :
                         "bg-white border-slate-200"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${done || active ? "text-white" : "text-slate-300"}`} />
              </div>
              <span className={`text-[8px] mt-1 font-bold uppercase tracking-widest ${
                active ? "text-[#7C5CFC]" : done ? "text-emerald-600" : "text-slate-300"
              }`}>{PIPELINE_LABELS[step]}</span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className={`h-0.5 w-6 mb-4 mx-0.5 ${i < idx ? "bg-emerald-400" : "bg-slate-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("crm");

  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([fetchOrders(), fetchMember(), fetchPCCatalog(), fetchCommissions()])
      .then(([allOrders, allMembers, pcCatalog, allCommissions]) => {
        setOrders(allOrders || []);
        setMembers(allMembers || []);
        setCatalog(pcCatalog || []);
        setCommissions(allCommissions || []);
      })
      .catch((err) => {
        console.error("Dashboard data load failed:", err);
        try {
          setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
          setMembers(JSON.parse(localStorage.getItem("members") || "[]"));
          setCatalog(JSON.parse(localStorage.getItem("pc_catalog") || "[]"));
          setCommissions(JSON.parse(localStorage.getItem("custom_commissions") || "[]"));
        } catch (_) {}
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Handlers ──
  const handleOrderAction = async (orderId, nextStatus) => {
    setActionLoadingId(orderId);
    try { await updateOrderStatus(orderId, nextStatus); loadData(); }
    catch (err) { alert(`Update failed: ${err.message}`); }
    finally { setActionLoadingId(null); }
  };
  const handleItemStatus = async (id, nextStatus) => {
    setActionLoadingId(id);
    try { await updateOrderItemStatus(id, nextStatus); loadData(); }
    catch (err) { alert(`Update failed: ${err.message}`); }
    finally { setActionLoadingId(null); }
  };

  // ── Helpers ──
  const getMemberName = (memberId) => {
    const m = members.find(m => m.member_id === memberId);
    return m ? (m.username || m.email) : (memberId ? memberId.substring(0, 10) + "…" : "Unknown");
  };
  const getMemberEmail = (memberId) => {
    const m = members.find(m => m.member_id === memberId);
    return m?.email || null;
  };
  const getProductName = (productId) => {
    const p = catalog.find(c => c.product_id === productId);
    return p ? p.name : (productId || "System Build");
  };
  const formatIDR = (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
  const formatDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // ── Stats ──
  const totalRevenue = useMemo(() =>
    orders.filter(o => o.status?.toLowerCase() !== "rejected").reduce((a, o) => a + (Number(o.total_cash_paid) || 0), 0)
  , [orders]);

  const membersCount = useMemo(() =>
    members.filter(m => m.role?.toLowerCase() !== "admin").length
  , [members]);

  const pendingCommCount = useMemo(() =>
    commissions.filter(c => ["pending","reviewing"].includes((c.status||"pending").toLowerCase())).length
  , [commissions]);

  const stockAlertCount = useMemo(() =>
    catalog.filter(i => i.availability === "Out of Stock" || i.availability === "Low Stock").length
  , [catalog]);

  // ── Chart Data ──
  // Revenue over the last 7 unique order dates
  const revenueChartData = useMemo(() => {
    const sorted = [...orders].sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
    const grouped = {};
    sorted.forEach(o => {
      const day = (o.order_date || "").slice(0, 10);
      if (day) grouped[day] = (grouped[day] || 0) + (Number(o.total_cash_paid) || 0);
    });
    return Object.values(grouped).slice(-8);
  }, [orders]);

  const commissionStatusData = useMemo(() => {
    const done = commissions.filter(c => ["approved","completed"].includes((c.status||"").toLowerCase())).length;
    return { done, total: commissions.length };
  }, [commissions]);

  const catalogStockBars = useMemo(() => {
    const inStock   = catalog.filter(i => i.availability === "In Stock").length;
    const limited   = catalog.filter(i => i.availability === "Limited").length;
    const outStock  = catalog.filter(i => i.availability === "Out of Stock").length;
    return [
      { label: "In Stock",     value: inStock,  color: "#10b981" },
      { label: "Limited",      value: limited,  color: "#f59e0b" },
      { label: "Out of Stock", value: outStock, color: "#f43f5e" },
    ];
  }, [catalog]);

  // ── Table Data ──
  const recentMembers = useMemo(() =>
    [...members].filter(m => m.role?.toLowerCase() !== "admin")
      .sort((a,b) => new Date(b.join_date||0) - new Date(a.join_date||0)).slice(0,5)
  , [members]);

  const recentOrders = useMemo(() =>
    [...orders].sort((a,b) => new Date(b.order_date||0) - new Date(a.order_date||0)).slice(0,5)
  , [orders]);

  const recentCommissions = useMemo(() =>
    [...commissions]
      .filter(c => ["pending","reviewing"].includes((c.status||"pending").toLowerCase()))
      .sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)).slice(0,4)
  , [commissions]);

  // Order tabs grouping
  const pendingOrdersGrouped = useMemo(() => {
    const groups = {};
    orders.filter(o => o.status === "pending").forEach(o => {
      if (!groups[o.order_id]) groups[o.order_id] = {
        order_id: o.order_id, member_id: o.member_id,
        items: [], total_cash: 0, total_points: 0, order_date: o.order_date
      };
      groups[o.order_id].items.push(o);
      groups[o.order_id].total_cash  += Number(o.total_cash_paid || 0);
      groups[o.order_id].total_points += Number(o.points_used || 0);
    });
    return Object.values(groups).sort((a,b) => new Date(b.order_date||0) - new Date(a.order_date||0));
  }, [orders]);

  const activePipelineItems = useMemo(() =>
    orders.filter(o => ["confirmed","building","testing","completed"].includes(o.status))
      .sort((a,b) => new Date(b.order_date||0) - new Date(a.order_date||0))
  , [orders]);

  const statusBadge = (status) => {
    switch ((status||"").toLowerCase()) {
      case "pending":   return "bg-amber-50 text-amber-700 border-amber-100";
      case "reviewing": return "bg-blue-50 text-blue-700 border-blue-100";
      case "confirmed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected":  return "bg-rose-50 text-rose-700 border-rose-100";
      case "completed": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "building":  return "bg-violet-50 text-violet-700 border-violet-100";
      case "testing":   return "bg-cyan-50 text-cyan-700 border-cyan-100";
      default:          return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8 bg-slate-50/20 min-h-screen">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time insights across catalog, clients, orders, and custom commissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} disabled={loading} title="Refresh"
            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-[#7C5CFC] hover:border-[#7C5CFC]/20 transition-all bg-white cursor-pointer shadow-xs">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 shadow-xs">
            <button onClick={() => setActiveTab("crm")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "crm" ? "bg-white text-[#7C5CFC] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              <BarChart3 className="w-4 h-4" /> Business Analytics
            </button>
            <button onClick={() => setActiveTab("orders")}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "orders" ? "bg-white text-[#7C5CFC] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              <ClipboardList className="w-4 h-4" /> Order Management
              {pendingOrdersGrouped.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center font-black animate-pulse">
                  {pendingOrdersGrouped.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === "crm" ? (
        <>
          {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Sales Revenue" value={formatIDR(totalRevenue)} change="Gross Invoiced Cash" isPositive={true} isProminent={true} />
            <StatCard label="Registered Members"  value={membersCount}            change="Active Client Profiles" isPositive={true}  isStable={true} />
            <StatCard label="Pending Commissions" value={pendingCommCount}         change="Custom Rig Queue"      isPositive={pendingCommCount > 0} isStable={false} />
            <StatCard label="Stock Alerts"         value={stockAlertCount}          change="Low/Out of Stock"     isPositive={false} isStable={true} />
          </div>

          {/* ── CHARTS ROW ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Revenue Trend Area Chart */}
            <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl shadow-xs p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Revenue Trend</p>
                  <h3 className="text-base font-extrabold text-slate-800 mt-0.5">Order Revenue Timeline</h3>
                </div>
                <TrendingUp className="w-5 h-5 text-[#7C5CFC]" />
              </div>
              {revenueChartData.length > 1 ? (
                <AreaLineChart data={revenueChartData} label="revenue" color="#7C5CFC" />
              ) : (
                <div className="h-24 flex items-center justify-center text-slate-400 text-xs">
                  Not enough order data to render trend.
                </div>
              )}
              <p className="text-[10px] text-slate-400">Last {revenueChartData.length} order date buckets · Cash payments only</p>
            </div>

            {/* Commission Resolution Donut */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-xs p-6 flex flex-col items-center justify-center space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Commission Health</p>
              <DonutRing
                value={commissionStatusData.done}
                max={commissionStatusData.total}
                label="Resolved"
                color="#10b981"
                size={100}
              />
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700">{commissionStatusData.done} / {commissionStatusData.total} resolved</p>
                <p className="text-[10px] text-slate-400">Approved + Completed</p>
              </div>
            </div>

            {/* Catalog Stock Horizontal Bars */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-xs p-6 space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Catalog Availability</p>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">Stock Distribution</h3>
              </div>
              <HBarChart items={catalogStockBars} />
              <p className="text-[10px] text-slate-400">{catalog.length} total catalog configurations</p>
            </div>

          </div>

          {/* ── MAIN DATA TABLES ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Recent Members + Transactions */}
            <div className="lg:col-span-8 space-y-8">

              {/* Recent Members */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
                  <Users className="w-4 h-4 text-[#7C5CFC]" />
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Recent Client Registrations</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-6 text-left w-[100px]">Client ID</th>
                      <th className="py-3 px-4 text-left">Username</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-center w-[130px]">Points</th>
                      <th className="py-3 px-6 text-right w-[140px]">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-xs">Loading...</td></tr>
                    ) : recentMembers.length > 0 ? recentMembers.map(m => (
                      <tr key={m.member_id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-slate-400 text-xs">{m.member_id?.substring(0,8)}…</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-xs">{m.username}</td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">{m.email}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-600 text-xs">{m.current_points||0} PTS</td>
                        <td className="py-3.5 px-6 text-right text-slate-500 text-xs">{new Date(m.join_date).toLocaleDateString("id-ID",{month:"short",day:"numeric",year:"numeric"})}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-xs">No members registered yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
                  <ShoppingBag className="w-4 h-4 text-[#7C5CFC]" />
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Recent Transactions</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-6 text-left w-[130px]">Order ID</th>
                      <th className="py-3 px-4 text-left">Member</th>
                      <th className="py-3 px-4 text-left">Build / Item</th>
                      <th className="py-3 px-4 text-center w-[90px]">Method</th>
                      <th className="py-3 px-4 text-center w-[120px]">Status</th>
                      <th className="py-3 px-6 text-right w-[140px]">Cash Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-xs">Loading...</td></tr>
                    ) : recentOrders.length > 0 ? recentOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-slate-400 text-[10px]">{o.order_id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-xs">{getMemberName(o.member_id)}</td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs max-w-[160px] truncate">{getProductName(o.product_id)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                            {o.payment_method}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadge(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-bold text-slate-800 text-xs tabular-nums">{formatIDR(o.total_cash_paid)}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} className="py-10 text-center text-slate-400 text-xs">No transactions recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Right: Commissions + Catalog Analysis */}
            <div className="lg:col-span-4 space-y-6">

              {/* Commission Queue */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                  <Inbox className="w-4 h-4 text-[#7C5CFC]" />
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Custom Rig Requests</h3>
                </div>
                <div className="p-5 space-y-4">
                  {loading ? (
                    <div className="py-8 flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin text-[#7C5CFC]" />
                      <span className="text-xs">Loading queue…</span>
                    </div>
                  ) : recentCommissions.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">No pending requests.</p>
                  ) : recentCommissions.map(c => (
                    <div key={c.id} className="border-l-2 border-[#7C5CFC] pl-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-400">{formatDate(c.created_at)}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${statusBadge(c.request_type === "Organization" ? "reviewing" : "pending")}`}>
                          {c.request_type}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{c.email}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catalog Metrics */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                  <TrendingUp className="w-4 h-4 text-[#7C5CFC]" />
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Catalog Analysis</h3>
                </div>
                <div className="p-5 space-y-4">
                  {catalog.length > 0 ? (() => {
                    const validMargins = catalog.filter(i => i.gross_margin != null);
                    const avgMargin = validMargins.length > 0
                      ? (validMargins.reduce((a, i) => a + Number(i.gross_margin), 0) / validMargins.length) * 100
                      : 0;
                    const avgPrice = catalog.reduce((a, i) => a + (Number(i.retail_price_idr)||0), 0) / catalog.length;
                    const inStock = catalog.filter(i => i.availability === "In Stock").length;
                    return (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600">In-Stock Ratio</span>
                            <span className="text-emerald-600 font-bold">{((inStock/catalog.length)*100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{width:`${(inStock/catalog.length)*100}%`}} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Avg Margin</p>
                            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{avgMargin.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Avg Price</p>
                            <p className="text-sm font-extrabold text-slate-800 mt-1 truncate">{formatIDR(avgPrice)}</p>
                          </div>
                        </div>
                      </>
                    );
                  })() : <p className="text-xs text-slate-400 text-center py-4">No catalog data.</p>}
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        /* ── ORDER MANAGEMENT TAB ───────────────────────────────────────── */
        <div className="space-y-10">

          {/* SECTION 1: Pending Approval Cards */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Order Approvals
                </h2>
                <p className="text-xs text-slate-500 mt-1">Confirm or reject client checkouts to initiate build assembly and award loyalty points.</p>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-full">
                {pendingOrdersGrouped.length} awaiting review
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" /><span>Loading orders…</span>
              </div>
            ) : pendingOrdersGrouped.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs py-16 text-center text-slate-400 text-sm">
                <Clock className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                No orders are pending verification.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {pendingOrdersGrouped.map(group => (
                  <div key={group.order_id} className="bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col">
                    {/* Card Header */}
                    <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex justify-between items-start">
                      <div>
                        <p className="text-[8px] text-amber-600 uppercase font-bold tracking-widest">Pending Approval</p>
                        <p className="text-xs font-mono font-bold text-amber-800 mt-0.5">{group.order_id}</p>
                      </div>
                      <span className="text-[9px] text-amber-600 font-medium">{formatDate(group.order_date)}</span>
                    </div>

                    {/* Client Info */}
                    <div className="px-5 pt-4 pb-2 border-b border-slate-50">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Client</p>
                      <p className="text-sm font-extrabold text-slate-800">{getMemberName(group.member_id)}</p>
                      {getMemberEmail(group.member_id) && (
                        <p className="text-xs text-slate-400">{getMemberEmail(group.member_id)}</p>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="px-5 py-3 flex-1 space-y-2">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">
                        {group.items.length} Item{group.items.length !== 1 ? "s" : ""} in Checkout
                      </p>
                      {group.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-700 font-semibold truncate max-w-[140px]">
                            {getProductName(item.product_id)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 ml-2">×{item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-600">{group.total_points} PTS used</span>
                      <span className="font-extrabold text-slate-800 tabular-nums">{formatIDR(group.total_cash)}</span>
                    </div>

                    {/* Actions */}
                    <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
                      <button
                        disabled={actionLoadingId !== null}
                        onClick={() => handleOrderAction(group.order_id, "confirmed")}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoadingId === group.order_id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <><Check className="w-3.5 h-3.5" /> Confirm Order</>
                        }
                      </button>
                      <button
                        disabled={actionLoadingId !== null}
                        onClick={() => handleOrderAction(group.order_id, "rejected")}
                        className="flex items-center justify-center gap-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold px-3.5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoadingId === group.order_id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <X className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: Assembly Pipeline */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#7C5CFC]" />
                  Fulfillment & Assembly Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">Advance each confirmed order through the assembly lifecycle stages.</p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full">
                {activePipelineItems.length} active items
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" /><span>Loading pipeline…</span>
              </div>
            ) : activePipelineItems.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs py-16 text-center text-slate-400 text-sm">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                No active builds in the pipeline.
              </div>
            ) : (
              <div className="space-y-4">
                {activePipelineItems.map(item => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row items-start md:items-center gap-5">

                    {/* Left: Identity */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[9px] text-slate-400">{item.order_id}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-800">{getProductName(item.product_id)}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Client: <strong className="text-slate-700">{getMemberName(item.member_id)}</strong></span>
                        <span>Qty: <strong className="text-slate-700">{item.qty}</strong></span>
                        <span className="text-[9px] uppercase font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border">{item.payment_method}</span>
                      </div>
                    </div>

                    {/* Center: Pipeline Steps */}
                    <div className="shrink-0">
                      {item.status !== "rejected" && (
                        <PipelineSteps currentStatus={item.status} />
                      )}
                    </div>

                    {/* Right: Controls + Cash */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="font-extrabold text-slate-800 tabular-nums text-sm">{formatIDR(item.total_cash_paid)}</span>
                      <select
                        value={item.status || "confirmed"}
                        disabled={actionLoadingId === item.id}
                        onChange={e => handleItemStatus(item.id, e.target.value)}
                        className="text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#7C5CFC] cursor-pointer"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="building">Building</option>
                        <option value="testing">Stress Testing</option>
                        <option value="completed">Completed / Shipped</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}

    </div>
  );
}
