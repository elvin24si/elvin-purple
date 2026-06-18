import { useState, useEffect } from "react"; // 1. Import hooks yang diperlukan
import pcData from "../assets/PCList.json";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import StatCard from "../components/dashboard/StatCard";

export default function Dashboard() {
  // 2. Siapkan State untuk menampung data yang akan berubah/diambil dari API
  const [stats, setStats] = useState({
    totalClients: 142,
    pendingTickets: 5,
    avgSatisfaction: "4.9/5",
  });
  const [premiumBuilds, setPremiumBuilds] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Fitur Baru: Status Loading

  // 3. USEEFFECT 1: Mengambil & mengkalkulasi data pertama kali (Simulasi API Fetching)
  useEffect(() => {
    // Kita simulasikan loading jaringan selama 1 detik
    const timer = setTimeout(() => {
      const totalValue = pcData.reduce((acc, pc) => acc + pc.price, 0);
      const filteredPremium = pcData.filter(pc => pc.price > 4000);

      setTotalInventoryValue(totalValue);
      setPremiumBuilds(filteredPremium);
      setIsLoading(false); // Matikan loading setelah data siap
    }, 1000);

    return () => clearTimeout(timer); // Cleanup function untuk membersihkan timer
  }, []); // Array kosong [] artinya ini hanya berjalan 1x pas halaman dibuka

  // 4. USEEFFECT 2: Fitur Baru (Auto-Refresh / Polling untuk Jumlah Tiket)
  useEffect(() => {
    // Jalankan interval setiap 5 detik untuk mensimulasikan tiket baru masuk/selesai
    const interval = setInterval(() => {
      setStats((prev) => {
        // Simulasi naik turunnya tiket acak antara 3 sampai 8
        const randomTickets = Math.floor(Math.random() * 6) + 3;
        return {
          ...prev,
          pendingTickets: randomTickets
        };
      });
      console.log("Dashboard data auto-refreshed!"); // Bukti di console kalau useEffect bekerja
    }, 5000);

    return () => clearInterval(interval); // Kunci Penting! Bersihkan interval saat user pindah halaman
  }, []);

  // Tampilan Antarmuka saat Loading
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-500 animate-pulse">Loading Executive CRM Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50/30 min-h-screen">
      
      {/* 1. CLEAN HEADER */}
      <div className="border-b pb-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Client relations and high-value fulfillment tracking.</p>
        </div>
        {/* Indikator Fitur Baru */}
        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 animate-pulse">
          ● Live Sync Active
        </Badge>
      </div>

      {/* 2. CRM STAT CARDS (Menggunakan data dari state yang dinamis) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Clients" value={stats.totalClients} change="Last Month: 136" isPositive={true} isProminent={true} />
        <StatCard label="CSAT Score" value={stats.avgSatisfaction} change="Last Month: 4.8" isPositive={true} isStable={true} />
        <StatCard label="Pending Tickets" value={stats.pendingTickets} change="Last Month: 5" isPositive={stats.pendingTickets < 5} isStable={false} />
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
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* SLA Tracker */}
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
    </div>
  );
}