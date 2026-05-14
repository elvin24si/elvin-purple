// src/components/PCCard.jsx

export default function PCCard({ pc }) {
  const isOutOfStock = pc.meta.availability === "Out of Stock";
  
  return (
    <div className="group cursor-pointer flex flex-col">
      {/* Image & Hover Container */}
      <div className="relative aspect-[4/5] bg-white mb-8 overflow-hidden border border-slate-100 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-indigo-100/50 group-hover:-translate-y-2">
        <img 
          src={pc.image} 
          alt={pc.name} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
        />
        
        {/* Technical Overlay */}
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-10">
          {/* Top Section: Specs */}
          <div className="space-y-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="border-b border-slate-700 pb-4">
              <p className="text-[9px] text-indigo-400 font-bold tracking-[0.3em] uppercase mb-2">Build Identifier</p>
              <h3 className="text-lg font-light text-white uppercase tracking-widest">{pc.id}</h3>
            </div>
            
            <div className="space-y-4">
              <SpecDetail label="GPU" value={pc.specs.gpu} />
              <SpecDetail label="CPU" value={pc.specs.cpu} />
              <SpecDetail label="Cooling" value={pc.thermals.cooler} />
            </div>
          </div>

          {/* Bottom Section: Order Button */}
          <div className="translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
            <button
              disabled={isOutOfStock}
              className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border
                ${isOutOfStock 
                  ? "bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed" 
                  : "bg-white border-white text-slate-900 hover:bg-transparent hover:text-white"
                }`}
            >
              {isOutOfStock ? "Out of Stock" : "Order Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info (Always Visible) */}
      <div className="space-y-3 px-2">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic">
            {pc.name}
          </h2>
          <p className="text-sm font-light text-slate-400 tabular-nums">
            ${pc.price.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Dot color logic */}
          <span className={`w-1.5 h-1.5 rounded-full 
            ${pc.meta.availability === "In Stock" ? "bg-green-500" : 
              pc.meta.availability === "Limited" ? "bg-amber-500" : "bg-red-500"}`}
          ></span>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
            {pc.meta.availability}
          </p>
        </div>
      </div>
    </div>
  );
}

function SpecDetail({ label, value }) {
  return (
    <div>
      <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs text-slate-200 font-medium tracking-wide leading-relaxed">{value}</p>
    </div>
  );
}