import { useState } from "react";
import pcData from "../assets/PCList.json";
import PCCard from "../components/PCCard";
import FilterBar from "../components/catalog/FilterBar"; // Import komponen baru

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
            {/* Search & Filter Component */}
            <FilterBar 
                searchTerm={dataForm.searchTerm}
                selectedTag={dataForm.selectedTag}
                filterOptions={filterOptions}
                onFilterChange={handleChange}
            />

            {/* PC Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {filteredPCs.map((pc) => (
                    <PCCard key={pc.id} pc={pc} />
                ))}
            </div>
        </div>
    );
}