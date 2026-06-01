import SelectField from "../form/SelectField";

export default function FilterBar({ searchTerm, selectedTag, filterOptions, onFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-0 mb-20 shadow-sm border border-slate-100 rounded-sm overflow-hidden">
      <input
        type="text"
        name="searchTerm"
        value={searchTerm}
        placeholder="Search specifications..."
        className="flex-grow bg-white p-6 text-sm outline-none placeholder:text-slate-300"
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