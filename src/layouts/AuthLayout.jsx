import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Shield, User, Copy, Check, Key } from "lucide-react";

function CredentialsCard() {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const accounts = [
        {
            role: "Admin",
            email: "a@a.c",
            pass: "123123123",
            color: "text-[#A78BFA]",
            bgColor: "bg-[#A78BFA]/10",
            borderColor: "border-[#A78BFA]/20",
            icon: Shield
        },
        {
            role: "Member",
            email: "berenang@gmail.com",
            pass: "123123123",
            color: "text-[#22C55E]",
            bgColor: "bg-[#22C55E]/10",
            borderColor: "border-[#22C55E]/20",
            icon: User
        }
    ];

    const handleSelect = (account, index) => {
        // Dispatch custom event to fill in the login form
        const event = new CustomEvent("autofill-login", {
            detail: { email: account.email, password: account.pass }
        });
        window.dispatchEvent(event);

        // Copy to clipboard
        navigator.clipboard.writeText(`Email: ${account.email}\nPassword: ${account.pass}`).catch(() => {});

        // Show copied feedback
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-[#0B0C10] p-8 md:p-10 border border-white/[0.06] shadow-2xl shadow-[#7C5CFC]/5 w-full max-w-sm transition-all rounded-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col items-start justify-start mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-[#A78BFA]" />
                    <h2 className="text-sm font-bold text-[#F4F3EF] uppercase tracking-[0.2em]">
                        Demo Accounts
                    </h2>
                </div>
                <div className="w-8 h-[1px] bg-[#7C5CFC] mt-1 opacity-60"></div>
                <p className="text-[10px] text-[#6B6E76] mt-3 uppercase tracking-wider text-left">
                    Click an account to autofill & copy credentials
                </p>
            </div>

            {/* Account List */}
            <div className="space-y-4">
                {accounts.map((acc, idx) => {
                    const IconComponent = acc.icon;
                    const isCopied = copiedIndex === idx;

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(acc, idx)}
                            className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#7C5CFC]/50 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer relative overflow-hidden focus:outline-none"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${acc.bgColor} ${acc.color}`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${acc.color}`}>
                                        {acc.role}
                                    </span>
                                </div>
                                <div className="text-[10px] text-[#6B6E76] group-hover:text-[#A78BFA] transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider">
                                    {isCopied ? (
                                        <>
                                            <Check className="w-3 h-3 text-[#22C55E]" />
                                            <span className="text-[#22C55E]">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3" />
                                            <span>Use account</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5 text-xs text-[#9A9DA6] font-mono">
                                <div className="flex justify-between">
                                    <span className="text-[#5A5D65] uppercase text-[9px] tracking-wider font-sans">Email:</span>
                                    <span className="text-[#EDECE7]">{acc.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#5A5D65] uppercase text-[9px] tracking-wider font-sans">Password:</span>
                                    <span className="text-[#EDECE7]">{acc.pass}</span>
                                </div>
                            </div>

                            {/* Subtle hover effect border accent */}
                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#7C5CFC]/0 to-transparent group-hover:via-[#7C5CFC]/40 transition-all duration-500"></div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-center">
                <span className="text-[9px] text-[#5A5D65] uppercase tracking-widest leading-loose">
                    Development Sandbox Mode
                </span>
            </div>
        </div>
    );
}

export default function AuthLayout() {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-[#08090C] p-6 gap-6 lg:gap-10 relative overflow-hidden">
            {/* Subtle Neon Background Glow Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none bg-[#7C5CFC]/20"></div>

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

            {/* Credentials Card (visible only on login interface) */}
            {isLoginPage && <CredentialsCard />}
        </div>
    );
}