// src/pages/admin/Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import pcData from "../../assets/PCList.json";
import { fetchOrders, fetchPCCatalog, updateOrderStatus, updateOrderItemStatus } from "../../lib/supabasepc";
import { fetchMember } from "../../lib/supabasemem";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, ClipboardList, TrendingUp } from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("crm"); // "crm" | "orders"

  // Data states
  const [orders, setOrders] = useState([]);
  const [members, setMembers] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null); // track which order is being approved/rejected

  const totalClients = 142;
  const pendingTickets = 5;
  const avgSatisfaction = "4.9/5";

  // Logistics & Value Logic
  const totalInventoryValue = pcData.reduce((acc, pc) => acc + pc.price, 0);
  const premiumBuilds = pcData.filter(pc => pc.price > 4000);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchOrders(), fetchMember(), fetchPCCatalog()])
      .then(([allOrders, allMembers, pcCatalog]) => {
        setOrders(allOrders);
        setMembers(allMembers);
        setCatalog(pcCatalog);
      })
      .catch((err) => console.error("Failed to load admin data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (orderId, nextStatus) => {
    setActionLoadingId(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
      // Reload records to reflect changes
      loadData();
    } catch (err) {
      alert(`Failed to update order status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper mappings
  const getMemberName = (memberId) => {
    const matched = members.find((m) => m.member_id === memberId);
    return matched ? matched.username || matched.email : memberId || "Unknown Member";
  };

  const getProductName = (productId) => {
    const matched = catalog.find((item) => item.product_id === productId);
    return matched ? matched.name : productId || "System Build";
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Pending orders filter
  const pendingOrders = orders.filter((o) => o.status === "pending");

  // Group pending orders by order_id
  const pendingOrdersGrouped = useMemo(() => {
    const groups = {};
    orders.forEach((o) => {
      if (o.status === "pending") {
        if (!groups[o.order_id]) {
          groups[o.order_id] = {
            order_id: o.order_id,
            member_id: o.member_id,
            items: [],
            total_cash: 0,
            total_points: 0,
            order_date: o.order_date
          };
        }
        groups[o.order_id].items.push(o);
        groups[o.order_id].total_cash += Number(o.total_cash_paid || 0);
        groups[o.order_id].total_points += Number(o.points_used || 0);
      }
    });
    return Object.values(groups);
  }, [orders]);

  // Active production pipeline items
  const activePipelineItems = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "confirmed" ||
        o.status === "building" ||
        o.status === "testing" ||
        o.status === "completed"
    );
  }, [orders]);

  const handleItemStatusUpdate = async (id, nextStatus) => {
    setActionLoadingId(id);
    try {
      await updateOrderItemStatus(id, nextStatus);
      loadData();
    } catch (err) {
      alert(`Failed to update item status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50/30 min-h-screen">

      {/* 1. HEADER & TAB NAVIGATION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage client accounts, catalog builds, and loyalty Point Shop orders.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab("crm")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === "crm"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            CRM Insights
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all relative ${activeTab === "orders"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Order Management
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">
                {pendingOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "crm" ? (
        <>
          {/* 2. CRM STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Clients" value={totalClients} change="Last Month: 136" isPositive={true} isProminent={true} />
            <StatCard label="CSAT Score" value={avgSatisfaction} change="Last Month: 4.8" isPositive={true} isStable={true} />
            <StatCard label="Pending Tickets" value={pendingTickets} change="Last Month: 5" isPositive={false} isStable={false} />
            <StatCard label="Pipeline Value" value={`$${(totalInventoryValue * 0.8).toLocaleString()}`} change="Last Month: $12,000" isPositive={true} isStable={true} />
          </div>

          {/* 3. MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Side: Pipeline Table Container */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">Client Fulfillment Pipeline</CardTitle>
                  <CardDescription>Premium builds currently in production queue</CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px] tracking-wider uppercase italic font-semibold text-slate-500 px-2.5 py-0.5">
                  Sorting by: Priority
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="w-[100px] font-semibold">Build ID</TableHead>
                      <TableHead className="font-semibold">Client Name</TableHead>
                      <TableHead className="font-semibold">Specs / CPU</TableHead>
                      <TableHead className="text-right font-semibold">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {premiumBuilds.length > 0 ? (
                      premiumBuilds.map((pc, idx) => (
                        <TableRow key={pc.id || idx}>
                          <TableCell className="font-medium text-slate-600">#{pc.id || idx + 101}</TableCell>
                          <TableCell className="font-medium">{pc.clientName || "Corporate Account"}</TableCell>
                          <TableCell>{pc.name || "Custom Rig Layout"}</TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600">${pc.price.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          No high-value premium builds currently tracked.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Right Side: Sidebar Column */}
            <div className="space-y-6">

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-slate-800">Client Interactions</CardTitle>
                  <CardDescription>Latest touchpoints and status logs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[240px] pr-4">
                    <div className="space-y-4">
                      <div className="border-l-2 border-slate-900 pl-3 py-1 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Today at 2:15 PM</p>
                        <p className="text-sm font-medium">Acme Corp requested custom GPU waterblock routing update.</p>
                      </div>
                      <div className="border-l-2 border-slate-300 pl-3 py-1 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Yesterday</p>
                        <p className="text-sm font-medium">Stark Industries shipment cleared customs tracking threshold.</p>
                      </div>
                      <div className="border-l-2 border-slate-300 pl-3 py-1 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">June 9, 2026</p>
                        <p className="text-sm font-medium">Follow-up call with Oscorp regarding recurring order contracts finalized.</p>
                      </div>
                      <div className="border-l-2 border-slate-300 pl-3 py-1 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">June 8, 2026</p>
                        <p className="text-sm font-medium">Initial specs discovery meeting with Cyberdyne Systems.</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* SLA Tracker Component using Shadcn Card & Progress */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-800">SLA Performance</CardTitle>
                  <CardDescription>Target response times & client commitments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Premium Build Delivery (Within 7 Days)</span>
                      <span className="text-emerald-600 font-semibold">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-slate-100" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Support Ticket Response (&lt; 2 Hours)</span>
                      <span className="text-amber-500 font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-2 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </>
      ) : (
        /* ORDER MANAGEMENT TAB */
        <div className="space-y-8">

          {/* PANEL 1: PENDING APPROVAL QUEUE */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Pending Order Approvals</CardTitle>
                <CardDescription>Confirm grouped checkouts to award loyalty points and initiate custom assembly.</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200 font-semibold">
                {pendingOrdersGrouped.length} Grouped Orders Pending
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-24 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" />
                  <span>Loading pending orders...</span>
                </div>
              ) : pendingOrdersGrouped.length === 0 ? (
                <div className="py-24 text-center text-slate-400 text-sm">
                  No orders are currently pending verification.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="w-[150px] font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Member</TableHead>
                      <TableHead className="font-semibold">Items in Checkout</TableHead>
                      <TableHead className="font-semibold text-center w-[120px]">Points Used</TableHead>
                      <TableHead className="font-semibold text-right w-[150px]">Total Cash</TableHead>
                      <TableHead className="font-semibold text-center w-[200px]">Action Queue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrdersGrouped.map((group) => (
                      <TableRow key={group.order_id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100">
                        <TableCell className="font-mono text-indigo-600 text-xs font-bold">
                          {group.order_id}
                        </TableCell>
                        <TableCell className="font-extrabold text-slate-800">
                          {getMemberName(group.member_id)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5 py-1">
                            {group.items.map((item, idx) => (
                              <span key={idx} className="text-xs text-slate-600 font-medium">
                                • <strong className="text-slate-800">{getProductName(item.product_id)}</strong> (Qty: {item.qty})
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-amber-600 text-xs">
                          {group.total_points || 0} PTS
                        </TableCell>
                        <TableCell className="text-right font-black text-slate-700 text-xs tabular-nums">
                          {formatIDR(group.total_cash)}
                        </TableCell>
                        <TableCell className="flex justify-center gap-2 py-3">
                          <Button
                            size="sm"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleAction(group.order_id, "confirmed")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 px-3.5 rounded-lg shadow-sm"
                          >
                            {actionLoadingId === group.order_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Confirm
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleAction(group.order_id, "rejected")}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-8 px-3.5 rounded-lg shadow-sm"
                          >
                            {actionLoadingId === group.order_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* PANEL 2: ACTIVE PIPELINE / ASSEMBLY STEPS */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Fulfillment & Assembly Pipeline</CardTitle>
                <CardDescription>Manually transition order status through assembly phases per item.</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold">
                {activePipelineItems.length} Active Items
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-24 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" />
                  <span>Loading assembly pipeline...</span>
                </div>
              ) : activePipelineItems.length === 0 ? (
                <div className="py-24 text-center text-slate-400 text-sm">
                  No active builds or points orders in the pipeline.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Member</TableHead>
                      <TableHead className="font-semibold">System / Item</TableHead>
                      <TableHead className="font-semibold text-center w-[80px]">Qty</TableHead>
                      <TableHead className="font-semibold text-center w-[120px]">Payment</TableHead>
                      <TableHead className="font-semibold text-right w-[130px]">Cash Paid</TableHead>
                      <TableHead className="font-semibold text-center w-[180px]">Assembly Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activePipelineItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100">
                        <TableCell className="font-mono text-indigo-600 text-xs font-bold">
                          {item.order_id}
                        </TableCell>
                        <TableCell className="font-bold text-slate-800 text-xs">
                          {getMemberName(item.member_id)}
                        </TableCell>
                        <TableCell className="font-extrabold text-slate-700 text-xs uppercase tracking-wide">
                          {getProductName(item.product_id)}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-slate-600">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                            {item.payment_method}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-800 text-xs tabular-nums">
                          {formatIDR(item.total_cash_paid)}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <select
                            value={item.status || "confirmed"}
                            disabled={actionLoadingId === item.id}
                            onChange={(e) => handleItemStatusUpdate(item.id, e.target.value)}
                            className="text-xs font-extrabold border border-slate-200 rounded-lg p-1.5 bg-white text-slate-800 focus:outline-none focus:border-[#7C5CFC] cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="building">Building / Assembly</option>
                            <option value="testing">Stress Testing</option>
                            <option value="completed">Completed / Shipped</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
