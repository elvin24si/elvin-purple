import { useState } from "react";
import pcData from "@/assets/PCList.json";

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Custom Components (Reusing your layout style cards)
import StatCard from "@/components/dashboard/StatCard";

export default function MemberDashboard() {
  // Hardcoded for demo/current context: Imagine this is the logged-in user's profile
  const clientName = "Acme Corp";
  
  // Filter builds specific to this client from your central pcData array
  const userBuilds = pcData.filter(pc => pc.clientName === clientName);
  
  // Summary calculations for the member
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
          <a 
            href="/catalog" 
            className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Browse Catalog
          </a>
          <a 
            href="/custom" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
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
            <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold text-indigo-600 border-indigo-200 bg-indigo-50/50 px-2.5 py-0.5">
              Live Updates
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[100px] font-semibold">Build ID</TableHead>
                  <TableHead className="font-semibold">System Configuration</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">MSRP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBuilds.length > 0 ? (
                  userBuilds.map((pc, idx) => (
                    <TableRow key={pc.id || idx}>
                      <TableCell className="font-medium text-slate-600">#{pc.id || idx + 101}</TableCell>
                      <TableCell className="font-medium">{pc.name || "Custom Rig Layout"}</TableCell>
                      <TableCell>
                        {/* Dynamic or Mock status pill depending on what's available in your JSON structure */}
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200 font-medium text-xs">
                          {pc.status || "Assembling Components"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">${pc.price.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
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
                  <div className="border-l-2 border-indigo-600 pl-3 py-1 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Today at 2:15 PM</p>
                    <p className="text-sm font-medium text-slate-800">Custom GPU liquid cooling loop routing initiated.</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-3 py-1 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">June 16, 2026</p>
                    <p className="text-sm font-medium text-slate-600">Motherboard, RAM, and storage blocks validated on testbench.</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-3 py-1 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">June 15, 2026</p>
                    <p className="text-sm font-medium text-slate-600">Premium chassis allocation completed & custom paint prepped.</p>
                  </div>
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
                  <span className="text-indigo-600 font-semibold">45%</span>
                </div>
                <Progress value={45} className="h-2 bg-slate-100" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}