import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all duration-300
        ${isActive ?
            "text-indigo-600 bg-indigo-50 font-extrabold shadow-sm" :
            "text-gray-500 hover:text-indigo-600 hover:bg-slate-50"
        }`;

    return (
        <aside className="w-64 border-r border-slate-100 bg-white flex flex-col sticky top-0 h-screen">
            {/* Logo Area */}
            <div className="p-8 mb-4">
                <h1 className="text-xl font-light tracking-[0.2em] text-slate-800 uppercase">
                    White<span className="font-bold text-black-600">Frame</span>
                </h1>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.3em]">Labs</p>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="px-4 mt-4">
                <ul className="space-y-3">
                    <li>
                        <NavLink to="/" className={menuClass}>
                            Catalog
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/custom" className={menuClass}>
                            Custom Build
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="flex-grow"></div>

            {/* Logout Section */}
            <button 
                onClick={() => navigate("/login")}
                className="mt-auto border-t border-slate-100 px-8 py-8 text-[11px] text-left uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 hover:text-red-700 transition-all font-bold group"
            >
                <span className="flex items-center gap-2">
                    Logout 
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </span>
            </button>
        </aside>
    );
}