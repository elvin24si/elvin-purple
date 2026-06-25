import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header className="w-full bg-[#fcfcfc] border-b border-slate-100">
      {/* max-w-7xl and px-6 prevents it from touching the very edges */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-slate-800 uppercase">
            White<span className="font-bold">Frame</span> <span className="text-slate-400">Labs</span>
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.3em]">Premium Boutique PC Shop</p>
        </div>
        <nav className="flex gap-8 text-[10px] font-medium uppercase tracking-widest text-slate-500">
          <Link to="/catalog" className="hover:text-indigo-600 transition-colors">Catalog</Link>
          <Link to="/custom" className="hover:text-indigo-600 transition-colors">Custom Build</Link>
        </nav>
      </div>
    </header>
  );
}