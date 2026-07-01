// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { insertMember, checkEmailExists } from "../../lib/supabasemem";

export default function Register() {
    const navigate = useNavigate();

    // Input States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Status Trackers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password) {
            setError("All input registration fields are required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const emailTaken = await checkEmailExists(email);
            if (emailTaken) {
                throw new Error("This email is already linked to another account.");
            }

            const payload = {
                member_id: crypto.randomUUID(),
                username: name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                role: "Individual", // Assigned fallback default role
                avatar_url: "https://placeholder.com/default-avatar.png",
                current_points: 0,
                lifetime_points_earned: 0,
                times_ordered: 0,
                total_spent_idr: 0,
                join_date: new Date().toISOString().split('T')[0] // Formats cleanly as YYYY-MM-DD
            };

            await insertMember(payload);
            setSuccess(true);

            setTimeout(() => {
                navigate("/member");
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-bold text-[#F4F3EF] mb-6 text-center uppercase tracking-tight">
                Create Account
            </h2>

            {/* Error Indicators */}
            {error && (
                <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Success Indicators */}
            {success && (
                <div className="mb-5 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs font-medium">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Profile registered successfully! Logging you in…</span>
                </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
                <div>
                    <label className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-sm focus:border-[#7C5CFC] outline-none transition-colors text-sm text-[#EDECE7] placeholder-[#5A5D65]"
                        placeholder="********"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-[#F4F3EF] hover:bg-[#7C5CFC] disabled:bg-white/20 text-[#08090C] hover:text-white disabled:text-[#6B6E76] text-[11px] font-bold py-4 rounded-sm transition duration-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Registering…" : "Create Account"}
                </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-[#6B6E76] uppercase tracking-widest">
                Already Have an Account? <Link to="/login" className="text-[#A78BFA] font-bold hover:text-[#C9C2FF] hover:underline">Login</Link>
            </p>
        </div>
    );
}