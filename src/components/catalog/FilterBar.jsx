// src/components/catalog/FilterBar.jsx
import SelectField from "../form/SelectField";

export default function FilterBar({ searchTerm, selectedTag, filterOptions, onFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-0 mb-20 border border-white/[0.08] rounded-sm overflow-hidden bg-white/[0.02]">
      <input
        type="text"
        name="searchTerm"
        value={searchTerm}
        placeholder="Search specifications..."
        className="flex-grow bg-transparent p-6 text-sm text-[#EDECE7] outline-none placeholder:text-[#5A5D65]"
        onChange={onFilterChange}
      />

      <SelectField
        name="selectedTag"
        value={selectedTag}
        options={filterOptions}
        defaultLabel="Filter Tags"
        onChange={onFilterChange}
      />
    </div>
  );
}