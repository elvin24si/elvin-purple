import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-6">
            {/* The Login Card */}
            <div className="bg-white p-10 border border-slate-100 shadow-xl shadow-indigo-100/20 w-full max-w-md transition-all">
                
                {/* Brand Header */}
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                    <h1 className="text-3xl font-light tracking-[0.2em] text-slate-800 uppercase">
                        White<span className="font-bold text-indigo-600">Frame</span>
                    </h1>
                    <div className="w-8 h-[1px] bg-indigo-600 mt-4 opacity-50"></div>
                    <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-[0.3em]">
                        Administrative Access
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                </div>

                {/* Footer Notice */}
                <div className="mt-12 pt-8 border-t border-slate-50">
                    <p className="text-center text-[9px] text-slate-400 uppercase tracking-widest leading-loose">
                        &copy; 2026 WhiteFrame Labs <br />
                    </p>
                </div>
            </div>
        </div>
    );
}