// src/pages/auth/Forgot.jsx
import { Link } from "react-router-dom";

export default function Forgot() {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 text-center uppercase tracking-tight">
                Recovery
            </h2>
            
            <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest leading-relaxed">
                Enter your credentials to receive a system reset link.
            </p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:border-indigo-500 outline-none transition-colors text-sm"
                        placeholder="architect@whiteframe.com"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold py-4 rounded-sm transition duration-300 uppercase tracking-[0.2em]"
                >
                    Send Recovery Link
                </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-slate-500 uppercase tracking-widest">
                Already Have an Account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Back to Login</Link>
            </p>
        </div>
    );
}