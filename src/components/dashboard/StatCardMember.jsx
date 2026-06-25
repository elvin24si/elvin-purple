// src/components/dashboard/StatCardMember.jsx
export default function StatCardMember({ label, value, change, isPositive, isProminent }) {
    // Standard color logic for non-prominent cards
    const statusColor = isPositive
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-rose-500/10 text-rose-400";

    return (
        <div className={`p-6 transition-all rounded-2xl border
            ${isProminent
                ? 'bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] border-transparent text-white shadow-lg shadow-[#7C5CFC]/20'
                : 'bg-white/[0.02] border-white/[0.07] text-[#F4F3EF] hover:border-white/[0.12]'
            }`}
        >
            {/* Top: Small Label */}
            <p className={`text-[9px] uppercase tracking-widest mb-4
                ${isProminent ? 'text-white/70' : 'text-[#6B6E76]'}`}
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
                            ? 'bg-white/15 text-white backdrop-blur-md border border-white/15'
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