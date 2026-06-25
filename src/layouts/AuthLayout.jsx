import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#08090C] p-6 relative overflow-hidden">
            {/* Subtle Neon Background Glow Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-25 pointer-events-none bg-[#7C5CFC]/20"></div>

            {/* The Login Card */}
            <div className="bg-[#0B0C10] p-8 md:p-10 border border-white/[0.06] shadow-2xl shadow-[#7C5CFC]/5 w-full max-w-md transition-all rounded-2xl relative z-10">
                
                {/* Brand Header */}
                <div className="flex flex-col items-start justify-start mb-10">
                    <h1 className="text-2xl font-light tracking-[0.2em] text-[#F4F3EF] uppercase">
                        White<span className="font-bold text-[#A78BFA]">Frame</span>
                    </h1>
                    <div className="w-8 h-[1px] bg-[#7C5CFC] mt-3 opacity-60"></div>
                    <p className="text-[9px] text-[#6B6E76] mt-3 uppercase tracking-[0.3em] font-medium">
                        Administrative Access
                    </p>
                </div>

                {/* Main Content (Outlet hosts the Login component) */}
                <Outlet />

                {/* Footer Notice */}
                <div className="mt-12 pt-6 border-t border-white/[0.06]">
                    <p className="text-center text-[9px] text-[#5A5D65] uppercase tracking-widest leading-loose">
                        &copy; 2026 WhiteFrame Labs <br />
                        All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}