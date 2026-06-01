export default function DashboardHeader({ title, description, onActionClick, actionLabel }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900">{title}</h1>
        <p className="text-lg text-slate-500 mt-1">{description}</p>
      </div>
      {actionLabel && (
        <button 
          onClick={onActionClick}
          className="bg-gradient-to-br from-purple-600 to-indigo-300 border-transparent text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}