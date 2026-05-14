import { useState } from "react";
import pcData from "../assets/PCList.json";
import PCCard from "../components/PCCard";

export default function Catalog() {
    const [dataForm, setDataForm] = useState({ searchTerm: "", selectedTag: "" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm((prev) => ({ ...prev, [name]: value }));
    };

    const filteredPCs = pcData.filter((pc) => {
        const _search = dataForm.searchTerm.toLowerCase();
        const searchableIndex = [pc.name, pc.specs.gpu, pc.specs.cpu, ...pc.tags].join(" ").toLowerCase();
        const matchesSearch = searchableIndex.includes(_search);
        const matchesTag = dataForm.selectedTag ? pc.tags.includes(dataForm.selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    const filterOptions = [...new Set(pcData.flatMap((pc) => pc.tags))];

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Search & Filter - Simplified and spaced */}
            <div className="flex flex-col md:flex-row gap-0 mb-20 shadow-sm border border-slate-100 rounded-sm overflow-hidden">
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Search specifications..."
                    className="flex-grow bg-white p-6 text-sm outline-none placeholder:text-slate-300"
                    onChange={handleChange}
                />
                <select
                    name="selectedTag"
                    className="bg-white p-6 text-[10px] font-bold uppercase tracking-[0.2em] border-l border-slate-50 outline-none md:w-72 text-slate-500"
                    onChange={handleChange}
                >
                    <option value="">Filter Tags</option>
                    {filterOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            {/* PC Grid - 3 columns for that boutique feel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {filteredPCs.map((pc) => (
                    <PCCard key={pc.id} pc={pc} />
                ))}
            </div>
        </div>
    );
}