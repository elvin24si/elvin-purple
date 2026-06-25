// src/pages/Catalog.jsx
import { useState, useEffect, useMemo } from "react";
import PCCard from "../components/PCCard";
import FilterBar from "../components/catalog/FilterBar";
import { fetchPCCatalog, normalizePC } from "../lib/supabase";

export default function Catalog() {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataForm, setDataForm] = useState({ searchTerm: "", selectedTag: "" });

  // Fetch from Supabase on mount
  useEffect(() => {
    setLoading(true);
    fetchPCCatalog()
      .then((rows) => setPcData(rows.map(normalizePC)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPCs = useMemo(() => {
    return pcData.filter((pc) => {
      const _search = dataForm.searchTerm.toLowerCase();
      const searchableIndex = [pc.name, pc.specs.gpu, pc.specs.cpu, ...pc.tags]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchableIndex.includes(_search);
      const matchesTag = dataForm.selectedTag
        ? pc.tags.includes(dataForm.selectedTag)
        : true;
      return matchesSearch && matchesTag;
    });
  }, [pcData, dataForm]);

  const filterOptions = useMemo(
    () => [...new Set(pcData.flatMap((pc) => pc.tags))],
    [pcData]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex flex-col items-center gap-4 text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm uppercase tracking-widest font-medium">Loading Catalog…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <p className="text-sm text-red-500 font-medium">Failed to load catalog: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-xs uppercase tracking-widest text-indigo-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Search & Filter */}
      <FilterBar
        searchTerm={dataForm.searchTerm}
        selectedTag={dataForm.selectedTag}
        filterOptions={filterOptions}
        onFilterChange={handleChange}
      />

      {filteredPCs.length === 0 ? (
        <div className="py-24 text-center text-slate-400 text-sm">
          No products match your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredPCs.map((pc) => (
            <PCCard key={pc.id} pc={pc} />
          ))}
        </div>
      )}
    </div>
  );
}