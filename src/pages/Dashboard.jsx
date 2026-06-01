import pcData from "../assets/PCList.json";
import StatCard from "../components/dashboard/StatCard";
import ActivityTable from "../components/dashboard/ActivityTable";
import CRMNotes from "../components/dashboard/CRMNotes";
import DashboardHeader from "../components/dashboard/DashboardHeader"; // Import Baru
import SlaTracker from "../components/dashboard/SlaTracker";         // Import Baru

export default function Dashboard() {
    // CRM Metrics Logic
    const totalClients = 142;
    const pendingTickets = 5;
    const avgSatisfaction = "4.9/5";

    // Logistics & Value Logic
    const totalInventoryValue = pcData.reduce((acc, pc) => acc + pc.price, 0);
    const premiumBuilds = pcData.filter(pc => pc.price > 4000);

    const handleCreateTicket = () => {
        alert("Support Ticket Created!"); // Ganti dengan fungsi aslimu nanti
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50/30">
            {/* 1. Header Component */}
            <DashboardHeader 
                title="Executive CRM"
                description="Client relations and high-value fulfillment tracking."
                actionLabel="Create Support Ticket"
                onActionClick={handleCreateTicket}
            />

            {/* 2. CRM Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Clients" value={totalClients} change="Last Month: 136" isPositive={true} isProminent={true} />
                <StatCard label="CSAT Score" value={avgSatisfaction} change="Last Month: 4.8" isPositive={true} isStable={true} />
                <StatCard label="Pending Tickets" value={pendingTickets} change="Last Month: 5" isPositive={false} isStable={false} />
                <StatCard label="Pipeline Value" value={`$${(totalInventoryValue * 0.8).toLocaleString()}`} change="Last Month: $12,000" isPositive={true} isStable={true} />
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fulfillment Status (Table) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800">Client Fulfillment Pipeline</h3>
                        <span className="text-[10px] text-slate-400 font-medium uppercase italic">Sorting by: Priority</span>
                    </div>
                    <ActivityTable data={premiumBuilds} />
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Client Interactions</h3>
                        <CRMNotes />
                    </div>

                    {/* 4. SLA Tracker Component */}
                    <SlaTracker />
                </div>
            </div>
        </div>
    );
}