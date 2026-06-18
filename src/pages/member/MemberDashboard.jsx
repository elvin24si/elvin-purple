import { useState, useEffect } from "react"; // 1. Import useEffect dan useState
import pcData from "@/assets/PCList.json";

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Custom Components
import StatCard from "@/components/dashboard/StatCard";

export default function MemberDashboard() {
  const clientName = "Acme Corp";
  
  // --- STRATEGI STATE & USEEFFECT ---
  
  // State untuk menyimpan progress simulasi live
  const [fluidProgress, setFluidProgress] = useState(45);
  const [logs, setLogs] = useState([
    { id: 1, time: "Today at 2:15 PM", text: "Custom GPU liquid cooling loop routing initiated." },
    { id: 2, time: "June 16, 2026", text: "Motherboard, RAM, and storage blocks validated on testbench." },
    { id: 3, time: "June 15, 2026", text: "Premium chassis allocation completed & custom paint prepped." }
  ]);

  // PENERAPAN USEEFFECT 1: Untuk simulasi update data live (Interval)
  useEffect(() => {
    // Membuat interval untuk menaikkan progress bar setiap 4 detik
    const interval = setInterval(() => {
      setFluidProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Hentikan jika sudah 100%
          return 100;
        }
        
        // Tambah progress secara acak antara 5 sampai 15 persen
        const newProgress = prevProgress + Math.floor(Math.random() * 10) + 5;
        
        // FITUR BARU: Tambah log otomatis ke Engineering Log jika progress naik
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
    }, 4000); // Berjalan setiap 4000ms (4 detik)

    // CLEANUP FUNCTION: Menghapus interval jika user pindah halaman agar tidak bocor (memory leak)
    return () => clearInterval(interval);
  }, []); // Array kosong berarti hanya berjalan 1x saat komponen dipasang

  // ------------------------------------

  // FILTER LOGIC (Tetap dihitung langsung)
  const customOrders = pcData.filter(pc => pc.clientName === clientName);
  const userBuilds = customOrders.length > 0 
    ? customOrders 
    : pcData.filter(pc => pc.price > 4000).slice(0, 2);

  const activeBuildsCount = userBuilds.length;
  const totalInvested = userBuilds.reduce((acc, pc) => acc + pc.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50/30 min-h-screen">
      
      {/* 1. MEMBER WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {clientName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your premium builds, order milestones, and custom commissions.</p>
        </div>
        <div className="flex gap-3">
          <a href="/catalog" className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors">
            Browse Catalog
          </a>
          <a href="/custom" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
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
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Your Build Pipeline</CardTitle>
              <CardDescription>Live tracking status of systems undergoing assembly</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold text-indigo-600 border-indigo-200 bg-indigo-50/50 px-2.5 py-0.5 animate-pulse">
              Live Updates
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[120px] font-semibold">Build ID</TableHead>
                  <TableHead className="font-semibold">System Configuration</TableHead>
                  <TableHead className="font-semibold">Core Components</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">MSRP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBuilds.length > 0 ? (
                  userBuilds.map((pc, idx) => (
                    <TableRow key={pc.id || idx}>
                      <TableCell className="font-medium text-slate-600">{pc.id}</TableCell>
                      <TableCell className="font-bold text-slate-900">{pc.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {pc.specs?.cpu} / {pc.specs?.gpu}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${fluidProgress === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'} font-medium text-xs whitespace-nowrap`}>
                          {fluidProgress === 100 ? "Ready for Shipping" : pc.status || "Fluid Testing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">${pc.price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      <p className="text-sm">You don't have any builds in production right now.</p>
                      <a href="/custom" className="text-indigo-600 hover:underline text-xs mt-1 inline-block">Commission your first build →</a>
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
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-slate-800">Engineering Log</CardTitle>
              <CardDescription>Updates directly from your dedicated builder</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {/* Render Logs secara dinamis dari State */}
                  {logs.map((log) => (
                    <div key={log.id} className={`border-l-2 ${log.time === "Just Now" ? "border-indigo-600" : "border-slate-200"} pl-3 py-1 space-y-1 transition-all duration-500`}>
                      <p className={`text-xs font-medium ${log.time === "Just Now" ? "text-indigo-600" : "text-muted-foreground"}`}>{log.time}</p>
                      <p className={`text-sm font-medium ${log.time === "Just Now" ? "text-slate-900" : "text-slate-600"}`}>{log.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Delivery & Testing SLA Tracker */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-800">Fulfillment Progress</CardTitle>
              <CardDescription>Milestones for your active commission pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Hardware Testing Phase</span>
                  <span className="text-emerald-600 font-semibold">100%</span>
                </div>
                <Progress value={100} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Fluid Dynamics & Stress Validation</span>
                  <span className={`font-semibold ${fluidProgress === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>{fluidProgress}%</span>
                </div>
                {/* Menggunakan state fluidProgress yang dinamis dari useEffect */}
                <Progress value={fluidProgress} className="h-2 bg-slate-100 transition-all duration-500" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}