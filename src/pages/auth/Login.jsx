// src/pages/auth/Login.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    return (
        <div className="animate-in fade-in duration-700">
            <h2 className="text-xl font-bold text-slate-800 mb-8 text-center uppercase tracking-tight">
                Welcome Back
            </h2>

            <form className="space-y-6">
                {/* Email Input */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm placeholder-slate-300"
                        placeholder="architect@whiteframe.com"
                    />
                </div>

                {/* Password Input */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Password
                        </label>
                        <Link
                            to="/forgot"
                            className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-widest transition-colors"
                        >
                            Forgot?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm placeholder-slate-300"
                        placeholder="********"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    onClick={() => navigate("/")}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold py-4 rounded-sm transition-all duration-300 uppercase tracking-[0.3em] shadow-lg shadow-indigo-100"
                >
                    Login
                </button>
            </form>

            {/* Footer Link */}
            <p className="mt-10 text-center text-[11px] text-slate-400 uppercase tracking-widest">
                New Account?{" "}
                <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                    Register Account
                </Link>
            </p>
        </div>
    );
}