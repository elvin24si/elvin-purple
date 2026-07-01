// src/pages/member/MemberDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMember } from "../../lib/supabasemem";
import { fetchOrders, fetchPCCatalog } from "../../lib/supabasepc";
import { Loader2 } from "lucide-react";

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Custom Components
import StatCard from "@/components/dashboard/StatCardMember";

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [clientName, setClientName] = useState("Guest");
  const [pointsBalance, setPointsBalance] = useState(0);

  // Real DB Data states
  const [orders, setOrders] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fluidProgress, setFluidProgress] = useState(45);
  const [logs, setLogs] = useState([
    { id: 1, time: "Today at 2:15 PM", text: "Custom GPU liquid cooling loop routing initiated." },
    { id: 2, time: "June 16, 2026", text: "Motherboard, RAM, and storage blocks validated on testbench." },
    { id: 3, time: "June 15, 2026", text: "Premium chassis allocation completed & custom paint prepped." }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setClientName(user.username || user.email || "User");
      setPointsBalance(user.current_points || 0);

      // Load DB records
      Promise.all([fetchMember(), fetchOrders(), fetchPCCatalog()])
        .then(([members, allOrders, pcCatalog]) => {
          // Sync fresh member points
          const freshUser = members.find((m) => m.member_id === user.member_id);
          if (freshUser) {
            setPointsBalance(freshUser.current_points || 0);
            localStorage.setItem("current_user", JSON.stringify({ ...user, ...freshUser }));
          }

          // Filter user's specific orders
          const userOrders = allOrders.filter((o) => o.member_id === user.member_id);
          setOrders(userOrders);
          setCatalog(pcCatalog);
        })
        .catch((err) => console.error("Error fetching data from Supabase:", err))
        .finally(() => setLoading(false));

    } catch (e) {
      console.error("Error parsing user data", e);
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFluidProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }

        const newProgress = prevProgress + Math.floor(Math.random() * 10) + 5;

        if (newProgress > prevProgress) {
          setLogs((prevLogs) => [
            {
              id: Date.now(),
              time: "Just Now",
              text: `Fluid dynamics pressure optimization reached ${Math.min(newProgress, 100)}%.`
            },
            ...prevLogs
          ]);
        }

        return Math.min(newProgress, 100);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Compute product name helper
  const getProductName = (productId) => {
    const matched = catalog.find((item) => item.product_id === productId);
    return matched ? matched.name : productId || "Custom Config System";
  };

  // Stats calculation
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const totalSpentIDR = orders
    .filter((o) => o.status === "completed")
    .reduce((acc, o) => acc + (Number(o.total_cash_paid) || 0), 0);

  const formatIDR = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-[#08090C] min-h-screen">

      {/* 1. MEMBER WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/[0.07] pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F4F3EF]">Welcome back, {clientName}</h1>
          <p className="text-sm text-[#9A9DA6] mt-1">Track your premium builds, order milestones, and points redemptions.</p>
        </div>
        <div className="flex gap-3">
          <a href="/catalog" className="px-4 py-2 border border-white/[0.1] bg-white/[0.02] rounded-md text-sm font-medium text-[#EDECE7] hover:bg-white/[0.06] transition-colors">
            Browse Catalog
          </a>
          <a href="/points-shop" className="px-4 py-2 bg-[#7C5CFC] text-white rounded-md text-sm font-medium hover:bg-[#6D4DEF] transition-colors shadow-sm shadow-[#7C5CFC]/20">
            Points Shop
          </a>
        </div>
      </div>

      {/* 2. MEMBER INSIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Pending Orders" value={pendingOrdersCount} change="In Production Queue" isPositive={true} isProminent={true} />
        <StatCard label="Total Cash Invested" value={formatIDR(totalSpentIDR)} change="Fulfillment Completed" isPositive={true} isStable={true} />
        <StatCard label="Loyalty Points" value={`${pointsBalance.toLocaleString()} PTS`} change="Redeemable in Points Shop" isPositive={true} isStable={true} />
      </div>

      {/* 3. MAIN PORTAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Member's Active Hardware Queue */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/[0.07] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-white/[0.07]">
            <div>
              <CardTitle className="text-xl font-bold text-[#F4F3EF]">Your Build Pipeline</CardTitle>
              <CardDescription className="text-[#9A9DA6]">Live tracking status of systems undergoing assembly</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold text-[#C9C2FF] border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-2.5 py-0.5 animate-pulse">
              Live Updates
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-[#6B6E76] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#A78BFA]" />
                <span>Loading pipeline data...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.02]">
                    <TableHead className="w-[150px] font-semibold text-[#9A9DA6]">Order ID</TableHead>
                    <TableHead className="font-semibold text-[#9A9DA6]">System Configuration</TableHead>
                    <TableHead className="font-semibold text-[#9A9DA6]">Payment Details</TableHead>
                    <TableHead className="font-semibold text-[#9A9DA6]">Status</TableHead>
                    <TableHead className="text-right font-semibold text-[#9A9DA6]">Cash Component</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.order_id} className="border-white/[0.06] hover:bg-white/[0.03] transition-colors duration-200">
                        <TableCell className="font-mono text-[#A78BFA] text-[11px] font-bold truncate max-w-[120px]" title={order.order_id}>
                          {order.order_id}
                        </TableCell>
                        <TableCell className="font-bold text-[#F4F3EF] uppercase tracking-wide text-xs">{getProductName(order.product_id)}</TableCell>
                        <TableCell className="text-[11px] text-[#8A8D96] max-w-[200px] truncate" title={order.payment_detail}>
                          <span className="bg-white/[0.03] px-2 py-1 rounded text-white border border-white/[0.04] font-medium text-[10px]">
                            {order.payment_method}
                          </span>
                          {order.points_used > 0 && (
                            <span className="ml-2 font-bold text-amber-400 bg-amber-400/5 border border-amber-400/15 px-1.5 py-0.5 rounded text-[9px]">
                              -{order.points_used} PTS
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`font-black text-[9px] uppercase tracking-widest whitespace-nowrap border px-2 py-0.5 rounded-md
                            ${order.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                              order.status === "rejected" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                              order.status === "confirmed" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                              order.status === "building" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse" :
                              order.status === "testing" ? "bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse" :
                              "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"}`}
                          >
                            {order.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-black text-amber-500 tabular-nums">
                          {formatIDR(order.total_cash_paid)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-white/[0.07]">
                      <TableCell colSpan={5} className="text-center text-[#6B6E76] py-12">
                        <p className="text-sm">You don't have any orders in production right now.</p>
                        <a href="/catalog" className="text-[#A78BFA] hover:text-[#C9C2FF] hover:underline text-xs mt-1 inline-block">Browse our catalog to place your first order →</a>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Right Side: Sidebar Column */}
        <div className="space-y-6">

          {/* Timeline Tracking Card */}
          <Card className="bg-white/[0.02] border-white/[0.07] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-[#F4F3EF]">Engineering Log</CardTitle>
              <CardDescription className="text-[#9A9DA6]">Updates directly from your dedicated builder</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className={`border-l-2 ${log.time === "Just Now" ? "border-[#7C5CFC]" : "border-white/[0.1]"} pl-3 py-1 space-y-1 transition-all duration-500`}>
                      <p className={`text-xs font-medium ${log.time === "Just Now" ? "text-[#A78BFA]" : "text-[#6B6E76]"}`}>{log.time}</p>
                      <p className={`text-sm font-medium ${log.time === "Just Now" ? "text-[#F4F3EF]" : "text-[#9A9DA6]"}`}>{log.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Delivery & Testing SLA Tracker */}
          <Card className="bg-white/[0.02] border-white/[0.07] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-[#F4F3EF]">Fulfillment Progress</CardTitle>
              <CardDescription className="text-[#9A9DA6]">Milestones for your active commission pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-[#EDECE7]">
                  <span>Hardware Testing Phase</span>
                  <span className="text-emerald-400 font-semibold">100%</span>
                </div>
                <Progress value={100} className="h-2 bg-white/[0.08]" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-[#EDECE7]">
                  <span>Fluid Dynamics & Stress Validation</span>
                  <span className={`font-semibold ${fluidProgress === 100 ? 'text-emerald-400' : 'text-[#A78BFA]'}`}>{fluidProgress}%</span>
                </div>
                <Progress value={fluidProgress} className="h-2 bg-white/[0.08] transition-all duration-500" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
