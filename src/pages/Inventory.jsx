import { useState } from "react";
import pcData from "../assets/PCList.json";
import InventoryRow from "../components/inventory/InventoryRow";

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPCs = pcData.filter(pc => 
        pc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pc.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Bagian Atas: Header & Kolom Filter Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Manager</h1>
                    <p className="text-sm text-slate-500">Managing {pcData.length} active configurations</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <input 
                        type="text"
                        placeholder="Filter by ID or Name..."
                        className="px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-72 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Bagian Utama: Tabel Data */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                            <th className="px-6 py-4">Product Detail</th>
                            <th className="px-6 py-4">Attributes</th>
                            <th className="px-6 py-4">Logistics & Service</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPCs.map((pc) => (
                            <InventoryRow key={pc.id} pc={pc} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}