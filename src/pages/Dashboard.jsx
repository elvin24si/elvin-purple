import pcData from "../assets/PCList.json";

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Custom Components
import StatCard from "../components/dashboard/StatCard";

export default function Dashboard() {
  const totalClients = 142;
  const pendingTickets = 5;
  const avgSatisfaction = "4.9/5";

  // Logistics & Value Logic
  const totalInventoryValue = pcData.reduce((acc, pc) => acc + pc.price, 0);
  const premiumBuilds = pcData.filter(pc => pc.price > 4000);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50/30 min-h-screen">
      
      {/* 1. CLEAN HEADER (No Ticket Creation Button/Dialog) */}
      <div className="border-b pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive CRM</h1>
        <p className="text-sm text-muted-foreground mt-1">Client relations and high-value fulfillment tracking.</p>
      </div>

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
          
          {/* CRM Notes Component using Shadcn Card & ScrollArea */}
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
    </div>
  );
}