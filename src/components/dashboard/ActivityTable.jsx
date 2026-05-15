const activities = [
    { id: "SYS-902", client: "A. Sterling", model: "Horizon Ultra", status: "Stress Testing", color: "bg-amber-500" },
    { id: "SYS-441", client: "Nova Labs", model: "Obsidian Pro", status: "Shipped", color: "bg-green-500" },
    { id: "SYS-109", client: "J. Wick", model: "Custom Build", status: "Assembly", color: "bg-indigo-500" },
];

export default function ActivityTable() {
    return (
        <div className="w-full border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="p-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Identifier</th>
                        <th className="p-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Client</th>
                        <th className="p-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Model</th>
                        <th className="p-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {activities.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors cursor-default">
                            <td className="p-4 text-xs font-mono text-indigo-600">{row.id}</td>
                            <td className="p-4 text-sm text-slate-900 font-medium">{row.client}</td>
                            <td className="p-4 text-xs text-slate-500 uppercase tracking-tighter">{row.model}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                                    <span className="text-[10px] uppercase font-bold text-slate-400">{row.status}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}