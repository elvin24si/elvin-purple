import pcData from "../assets/PCList.json";
import StatCard from "../components/dashboard/StatCard";
import ActivityTable from "../components/dashboard/ActivityTable";
import CRMNotes from "../components/dashboard/CRMNotes"; // New Component

export default function Dashboard() {
    // CRM Metrics
    const totalClients = 142; // Example static total
    const pendingTickets = 5;
    const avgSatisfaction = "4.9/5";
    const conversionRate = "12.4%";

    // Logistics & Value
    const totalInventoryValue = pcData.reduce((acc, pc) => acc + pc.price, 0);
    const premiumBuilds = pcData.filter(pc => pc.price > 4000);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50/30">
            {/* Header with Quick Action */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Executive CRM</h1>
                    <p className="text-lg text-slate-500 mt-1">Client relations and high-value fulfillment tracking.</p>
                </div>
                <button className="bg-gradient-to-br from-purple-600 to-indigo-300 border-transparent text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors">
                    Create Support Ticket
                </button>
            </div>

            {/* CRM Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* This is the ONLY one with the gradient prop */}
                <StatCard
                    label="Active Clients"
                    value={totalClients}
                    change="Last Month: 136"
                    isPositive={true}
                    isProminent={true}
                />

                <StatCard
                    label="CSAT Score"
                    value={avgSatisfaction}
                    change="Last Month: 4.8"
                    isPositive={true}
                    isStable={true}
                />

                <StatCard
                    label="Pending Tickets"
                    value={pendingTickets}
                    change="Last Month: 5"
                    isPositive={false}
                    isStable={false}
                />

                <StatCard
                    label="Pipeline Value"
                    value={`$${(totalInventoryValue * 0.8).toLocaleString()}`}
                    change="Last Month: $12,000"
                    isPositive={true}
                    isStable={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fulfillment Status (Table) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800">Client Fulfillment Pipeline</h3>
                        <span className="text-[10px] text-slate-400 font-medium uppercase italic">Sorting by: Priority</span>
                    </div>
                    <ActivityTable data={premiumBuilds} />
                </div>

                {/* New CRM Sidebar: Interaction Feed */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Client Interactions</h3>
                        <CRMNotes />
                    </div>

                    {/* Warranty/SLA Tracker */}
                    <div className="bg-slate-900 rounded-lg p-6 text-white shadow-xl">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-indigo-400 mb-4">SLA Compliance</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] mb-1 font-bold">
                                    <span>BUILD ACCURACY</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1 rounded-full"><div className="bg-indigo-500 w-full h-full" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-1 font-bold">
                                    <span>ON-TIME DELIVERY</span>
                                    <span>92%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1 rounded-full"><div className="bg-indigo-500 w-[92%] h-full" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}