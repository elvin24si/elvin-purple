export default function StatCard({ label, value, change, isPositive, isProminent }) {
    // Standard color logic for non-prominent cards
    const statusColor = isPositive 
        ? "bg-emerald-50 text-emerald-600" 
        : "bg-rose-50 text-rose-600";

    return (
        <div className={`p-6 shadow-sm hover:shadow-md transition-all rounded-2xl border 
            ${isProminent 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-300 border-transparent text-white' 
                : 'bg-white border-slate-100 text-slate-900'
            }`}
        >
            {/* Top: Small Label */}
            <p className={`text-[9px] uppercase tracking-widest mb-4 
                ${isProminent ? 'text-indigo-100' : 'text-gray-500'}`}
            >
                {label}
            </p>

            {/* Content: Value and Change stacked vertically */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight leading-none">
                    {value}
                </h2>
                
                <div className="flex mt-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full 
                        ${isProminent 
                            ? 'bg-white/20 text-white backdrop-blur-md border border-white/10' 
                            : statusColor
                        }`}
                    >
                        {change}
                    </span>
                </div>
            </div>
        </div>
    );
}