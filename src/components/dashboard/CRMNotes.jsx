export default function CRMNotes() {
    const notes = [
        { user: "Sarah J.", action: "requested specs update on", target: "SIG-001", time: "2h ago" },
        { user: "Marcus V.", action: "approved final quote for", target: "ORD-992", time: "5h ago" },
        { user: "System", action: "sent warranty renewal to", target: "Client #88", time: "1d ago" },
    ];

    return (
        <div className="space-y-5">
            {notes.map((note, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                        {note.user[0]}
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs text-slate-600 leading-tight">
                            <span className="font-bold text-slate-900">{note.user}</span> {note.action} <span className="font-mono text-indigo-600">{note.target}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-medium">{note.time}</p>
                    </div>
                </div>
            ))}
            <button className="w-full py-2 mt-2 border-t border-slate-50 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:bg-slate-50">
                View Interaction Logs
            </button>
        </div>
    );
}