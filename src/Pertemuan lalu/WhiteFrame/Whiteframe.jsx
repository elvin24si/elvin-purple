import { useState } from "react";
import pcData from "./PCList.json";

export default function Whiteframe() {
    const [dataForm, setDataForm] = useState({ searchTerm: "", selectedTag: "" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm((prev) => ({ ...prev, [name]: value }));
    };

    const filteredPCs = pcData.filter((pc) => {
        const _search = dataForm.searchTerm.toLowerCase();
        const searchableIndex = [
            pc.name, pc.specs.gpu, pc.specs.cpu, ...pc.tags
        ].join(" ").toLowerCase();

        const matchesSearch = searchableIndex.includes(_search);
        const matchesTag = dataForm.selectedTag ? pc.tags.includes(dataForm.selectedTag) : true;

        return matchesSearch && matchesTag;
    });

    const filterOptions = [...new Set(pcData.flatMap((pc) => pc.tags))];

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-slate-900 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-light tracking-[0.2em] text-slate-800 uppercase">
                            White<span className="font-bold">Frame</span> <span className="text-slate-400">Labs</span>
                        </h1>
                        <p className="text-[11px] text-slate-400 mt-2 uppercase tracking-widest">High-Performance Computing / Est. 2026</p>
                    </div>
                    <div className="flex gap-8 text-[10px] font-medium uppercase tracking-widest text-slate-500">
                        <span>Bespoke Build</span>
                        <span className="text-indigo-600 font-bold">Catalog</span>
                    </div>
                </header>

                {/* Search & Filter */}
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

                {/* PC Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredPCs.map((pc) => (
                        <div key={pc.id} className="group cursor-pointer">
                            <div className="relative aspect-[4/5] bg-[#f9f9f9] mb-6 overflow-hidden border border-slate-100 transition-all hover:shadow-xl hover:shadow-indigo-50/50">
                                <img src={pc.image} alt={pc.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-center p-8">
                                    <div className="space-y-4">
                                        <div className="border-b border-slate-100 pb-2">
                                            <p className="text-[10px] text-indigo-500 font-bold tracking-[0.2em] uppercase mb-1">Technical Manifest</p>
                                            <h3 className="text-sm font-bold text-slate-900 uppercase">{pc.id}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Graphics Engine</p>
                                                <p className="text-xs text-slate-700 font-medium">{pc.specs.gpu}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Processing Power</p>
                                                <p className="text-xs text-slate-700 font-medium">{pc.specs.cpu}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Thermal Solution</p>
                                                <p className="text-xs text-slate-700 font-medium">{pc.thermals.cooler}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-50">
                                            <p className="text-[9px] text-slate-400 italic">Warranty: {pc.meta.warranty}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <h2 className="text-lg font-bold tracking-tight text-slate-900">{pc.name}</h2>
                                    <span className="text-sm font-light text-slate-400">${pc.price.toLocaleString()}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-1 h-1 rounded-full ${pc.meta.availability === "In Stock" ? "bg-green-500" : "bg-orange-400"}`}></span>
                                    {pc.meta.availability}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}