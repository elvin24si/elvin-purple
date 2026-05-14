import { useState } from "react";
import pcData from "./PCList.json";

export default function AdminInventory() {
    const [dataForm, setDataForm] = useState({ searchTerm: "", selectedTag: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm(prev => ({ ...prev, [name]: value }));
    };

    const filteredPCs = pcData.filter((pc) => {
        const _search = dataForm.searchTerm.toLowerCase();
        const searchableIndex = [
            pc.id, pc.name, pc.specs.gpu, pc.specs.cpu, ...pc.tags
        ].join(" ").toLowerCase();

        const matchesSearch = searchableIndex.includes(_search);
        const matchesTag = dataForm.selectedTag ? pc.tags.includes(dataForm.selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    const filterOptions = [...new Set(pcData.flatMap((pc) => pc.tags))];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-900">
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                
                <header className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Inventory Control</h1>
                        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Fleet Status / {pcData.length} Records Verified</p>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-0 mb-16 shadow-sm border border-slate-100 rounded-sm">
                    <input
                        type="text"
                        name="searchTerm"
                        placeholder="Search specifications (e.g. RTX 4090, Ryzen 9...)"
                        className="flex-grow bg-white p-5 text-sm outline-none"
                        onChange={handleChange}
                    />
                    <select
                        name="selectedTag"
                        className="bg-white p-5 text-[11px] font-bold uppercase tracking-widest text-slate-600 outline-none md:w-72"
                        onChange={handleChange}
                    >
                        <option value="">Filter Tags</option>
                        {filterOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                <th className="px-6 py-5">Node Identity</th>
                                <th className="px-6 py-5">Hardware Specs (Nested)</th>
                                <th className="px-6 py-5">Thermal Config</th>
                                <th className="px-6 py-5">Deployment Metadata</th>
                                <th className="px-6 py-5 text-right">Valuation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPCs.map((pc) => (
                                <tr key={pc.id} className="hover:bg-indigo-50/20 transition-colors">
                                    {/* Identity */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={pc.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                                            <div>
                                                <div className="text-[10px] font-mono font-bold text-indigo-500 uppercase">{pc.id}</div>
                                                <div className="text-sm font-bold text-slate-800">{pc.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] leading-relaxed">
                                            <p><span className="text-slate-400 font-bold uppercase mr-1">GPU:</span> {pc.specs.gpu}</p>
                                            <p><span className="text-slate-400 font-bold uppercase mr-1">CPU:</span> {pc.specs.cpu}</p>
                                            <p><span className="text-slate-400 font-bold uppercase mr-1">RAM:</span> {pc.specs.ram}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px]">
                                            <p className="font-bold text-slate-700">{pc.thermals.cooler}</p>
                                            <p className="text-slate-400 mt-0.5 uppercase text-[9px] font-bold tracking-tighter">
                                                {pc.thermals.type} // {pc.thermals.fanCount} Fans
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex gap-1">
                                                {pc.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded uppercase">{tag}</span>
                                                ))}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                <span className="font-bold text-slate-400">BUILD:</span> {pc.meta.buildTime}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-bold text-slate-900">${pc.price.toLocaleString()}</div>
                                        <div className={`text-[9px] font-black uppercase mt-1 ${pc.meta.availability === "In Stock" ? "text-green-500" : "text-orange-500"}`}>
                                            {pc.meta.availability}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}