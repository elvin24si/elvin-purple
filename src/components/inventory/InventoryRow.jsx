export default function InventoryRow({ pc }) {
  // Logika pewarnaan badge status ketersediaan
  const getAvailabilityClass = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "Special Order":
        return "bg-indigo-50 text-indigo-700 border border-indigo-100";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-100";
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      {/* Kolom 1: Detail Produk & Identitas */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img 
            src={pc.image} 
            alt={pc.name} 
            className="w-10 h-10 rounded-md object-cover border border-slate-200 shadow-sm" 
          />
          <div>
            <p className="text-xs font-mono text-indigo-600 mb-0.5">{pc.id}</p>
            <p className="text-sm font-semibold text-slate-900 leading-tight">{pc.name}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">${pc.price.toLocaleString()}</p>
          </div>
        </div>
      </td>

      {/* Kolom 2: Atribut / Tags */}
      <td className="px-6 py-5">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {pc.tags.map((tag) => (
            <span key={tag} className="text-[9px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Kolom 3: Logistik & Layanan */}
      <td className="px-6 py-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-slate-600 font-medium">
              {pc.meta.buildTime} <span className="text-slate-400 font-normal ml-1">Lead</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs text-slate-600 font-medium">{pc.meta.warranty}</span>
          </div>
        </div>
      </td>

      {/* Kolom 4: Status Ketersediaan */}
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getAvailabilityClass(pc.meta.availability)}`}>
            {pc.meta.availability}
          </span>
        </div>
      </td>

      {/* Kolom 5: Aksi */}
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-1">
          <button className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-md transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}