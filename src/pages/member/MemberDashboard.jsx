// src/pages/member/MemberDashboard.jsx
import { useState, useEffect } from "react";
import pcData from "@/assets/PCList.json";

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Custom Components
import StatCard from "@/components/dashboard/StatCardMember";

export default function MemberDashboard() {
  const clientName = "Jason Vorhees";

  const [fluidProgress, setFluidProgress] = useState(45);
  const [logs, setLogs] = useState([
    { id: 1, time: "Today at 2:15 PM", text: "Custom GPU liquid cooling loop routing initiated." },
    { id: 2, time: "June 16, 2026", text: "Motherboard, RAM, and storage blocks validated on testbench." },
    { id: 3, time: "June 15, 2026", text: "Premium chassis allocation completed & custom paint prepped." }
  ]);

  useEffect(() => {
    // Interval 4 detik
    const interval = setInterval(() => {
      setFluidProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Hentikan jika sudah 100%
          return 100;
        }

        // Tambah progress secara acak antara 5 sampai 15 persen
        const newProgress = prevProgress + Math.floor(Math.random() * 10) + 5;

        // Tambah log otomatis ke Engineering Log jika progress naik
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
    }, 4000); // Berjalan setiap 4 detik

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------

  const customOrders = pcData.filter(pc => pc.clientName === clientName);
  const userBuilds = customOrders.length > 0
    ? customOrders
    : pcData.filter(pc => pc.price > 4000).slice(0, 2);

  const activeBuildsCount = userBuilds.length;
  const totalInvested = userBuilds.reduce((acc, pc) => acc + pc.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-[#08090C] min-h-screen">

      {/* 1. MEMBER WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/[0.07] pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F4F3EF]">Welcome back, {clientName}</h1>
          <p className="text-sm text-[#9A9DA6] mt-1">Track your premium builds, order milestones, and custom commissions.</p>
        </div>
        <div className="flex gap-3">
          <a href="/catalog" className="px-4 py-2 border border-white/[0.1] bg-white/[0.02] rounded-md text-sm font-medium text-[#EDECE7] hover:bg-white/[0.06] transition-colors">
            Browse Catalog
          </a>
          <a href="/custom" className="px-4 py-2 bg-[#7C5CFC] text-white rounded-md text-sm font-medium hover:bg-[#6D4DEF] transition-colors shadow-sm shadow-[#7C5CFC]/20">
            Commission New Build
          </a>
        </div>
      </div>

      {/* 2. MEMBER INSIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Active Orders" value={activeBuildsCount} change="In Production Queue" isPositive={true} isProminent={true} />
        <StatCard label="Total Portfolio Value" value={`$${totalInvested.toLocaleString()}`} change="Hardware Capital" isPositive={true} isStable={true} />
        <StatCard label="Account Status" value="VIP Tier" change="Priority SLA Support Active" isPositive={true} isStable={true} />
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
            <Table>
              <TableHeader>
                <TableRow className="bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.02]">
                  <TableHead className="w-[120px] font-semibold text-[#9A9DA6]">Build ID</TableHead>
                  <TableHead className="font-semibold text-[#9A9DA6]">System Configuration</TableHead>
                  <TableHead className="font-semibold text-[#9A9DA6]">Core Components</TableHead>
                  <TableHead className="font-semibold text-[#9A9DA6]">Status</TableHead>
                  <TableHead className="text-right font-semibold text-[#9A9DA6]">MSRP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBuilds.length > 0 ? (
                  userBuilds.map((pc, idx) => (
                    <TableRow key={pc.id || idx} className="border-white/[0.07] hover:bg-white/[0.02]">
                      <TableCell className="font-medium text-[#9A9DA6]">{pc.id}</TableCell>
                      <TableCell className="font-bold text-[#F4F3EF]">{pc.name}</TableCell>
                      <TableCell className="text-xs text-[#6B6E76] max-w-[200px] truncate">
                        {pc.specs?.cpu} / {pc.specs?.gpu}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${fluidProgress === 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'} font-medium text-xs whitespace-nowrap`}>
                          {fluidProgress === 100 ? "Ready for Shipping" : pc.status || "Fluid Testing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[#D97757]">${pc.price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-white/[0.07]">
                    <TableCell colSpan={5} className="text-center text-[#6B6E76] py-12">
                      <p className="text-sm">You don't have any builds in production right now.</p>
                      <a href="/custom" className="text-[#A78BFA] hover:text-[#C9C2FF] hover:underline text-xs mt-1 inline-block">Commission your first build →</a>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
                  {/* Render Logs secara dinamis dari State */}
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
                {/* Menggunakan state fluidProgress yang dinamis dari useEffect */}
                <Progress value={fluidProgress} className="h-2 bg-white/[0.08] transition-all duration-500" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}