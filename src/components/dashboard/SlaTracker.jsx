export default function SlaTracker() {
  const metrics = [
    { label: "BUILD ACCURACY", percentage: "100%", widthClass: "w-full" },
    { label: "ON-TIME DELIVERY", percentage: "92%", widthClass: "w-[92%]" },
  ];

  return (
    <div className="bg-slate-900 rounded-lg p-6 text-white shadow-xl">
      <h3 className="text-xl font-bold uppercase tracking-widest text-indigo-400 mb-4">
        SLA Compliance
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between text-[10px] mb-1 font-bold">
              <span>{metric.label}</span>
              <span>{metric.percentage}</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full">
              <div className={`bg-indigo-500 h-full ${metric.widthClass}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}