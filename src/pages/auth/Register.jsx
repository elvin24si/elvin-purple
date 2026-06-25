// src/pages/auth/Register.jsx
import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div>
            <h2 className="text-xl font-bold text-[#F4F3EF] mb-6 text-center uppercase tracking-tight">
                Create Account
            </h2>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-sm focus:border-[#7C5CFC] outline-none transition-colors text-sm text-[#EDECE7] placeholder-[#5A5D65]"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-sm focus:border-[#7C5CFC] outline-none transition-colors text-sm text-[#EDECE7] placeholder-[#5A5D65]"
                        placeholder="architect@whiteframe.com"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-sm focus:border-[#7C5CFC] outline-none transition-colors text-sm text-[#EDECE7] placeholder-[#5A5D65]"
                        placeholder="********"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#F4F3EF] hover:bg-[#7C5CFC] text-[#08090C] hover:text-white text-[11px] font-bold py-4 rounded-sm transition duration-300 uppercase tracking-[0.2em]"
                >
                    Create Account
                </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-[#6B6E76] uppercase tracking-widest">
                Already Have an Account? <Link to="/login" className="text-[#A78BFA] font-bold hover:text-[#C9C2FF] hover:underline">Login</Link>
            </p>
        </div>
    );
}