// src/pages/member/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { updateMember, deleteMember } from "../../lib/supabasemem";
import { Loader2, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  
  // Storage references
  const [currentUser, setCurrentUser] = useState(null);
  
  // Controlled fields state binds
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Status hooks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize data hook
  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(savedUser);
    setCurrentUser(user);
    setUsername(user.username || "");
    setPassword(user.password || "");
    setNotificationsEnabled(user.notification === true);
  }, [navigate]);

  // Handle saving the username or password changes
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Fields cannot be left blank.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedFields = { 
        username: username.trim(), 
        password: password,
        notification: notificationsEnabled 
      };
      
      // Patch database entry using existing key reference
      await updateMember(currentUser.member_id, updatedFields);
      
      // Update local tracking session representation
      const refreshedUserObj = { ...currentUser, ...updatedFields };
      localStorage.setItem("current_user", JSON.stringify(refreshedUserObj));
      setCurrentUser(refreshedUserObj);
      
      setSuccessMessage("Account changes saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle destroying account
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteMember(currentUser.member_id);
      
      // Clear tracking variables, break session, bounce out
      localStorage.removeItem("current_user");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDECE7] font-sans">

      <main className="max-w-2xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold uppercase tracking-widest text-[#F4F3EF] mb-2">
          Account Settings
        </h2>
        <p className="text-xs text-[#6B6E76] mb-10">
          Manage your boutique storefront profile information and security access.
        </p>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-md text-xs font-medium">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Profile Update Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
              Email Address (Immutable)
            </label>
            <input
              type="text"
              disabled
              value={currentUser.email}
              className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.05] rounded-md text-sm text-[#6B6E76] outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="settings-username" className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              id="settings-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-md focus:border-[#7C5CFC] outline-none transition-colors text-sm text-[#EDECE7]"
            />
          </div>

          <div>
            <label htmlFor="settings-password" className="block text-[10px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="settings-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-md focus:border-[#7C5CFC] outline-none transition-colors text-sm text-[#EDECE7]"
            />
          </div>

          {/* Email notifications custom styled toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="space-y-0.5">
              <label htmlFor="settings-notification" className="text-xs font-bold text-[#EDECE7] uppercase tracking-wider block cursor-pointer">
                Email Updates & Promos
              </label>
              <span className="text-[10px] text-[#6B6E76] block">
                Receive notifications about exclusive custom builds and events.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="settings-notification"
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#EDECE7] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7C5CFC]"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#7C5CFC] hover:bg-[#6D4DEF] disabled:bg-[#7C5CFC]/50 text-white text-[11px] font-bold px-6 py-3 rounded-md uppercase tracking-widest transition duration-200 flex items-center gap-2"
          >
            {loading && !showDeleteConfirm && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Changes
          </button>
        </form>

        {/* Danger Zone Separation */}
        <div className="mt-14 pt-8 border-t border-white/[0.08]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-xs text-[#6B6E76] mb-4">
            Deleting your profile deletes all acquired loyalty points, metadata tier items, and orders instantly. This action cannot be reversed.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-950/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 text-[11px] font-bold px-4 py-2.5 rounded-md uppercase tracking-widest transition duration-200 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Account
            </button>
          ) : (
            <div className="bg-red-500/5 border border-red-500/20 rounded-md p-4 max-w-md">
              <p className="text-xs font-semibold text-red-400 mb-3">
                Are you absolutely sure you want to delete this profile?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white text-[10px] font-bold px-4 py-2 rounded-sm uppercase tracking-wider transition flex items-center gap-1"
                >
                  {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                  Yes, Delete Permanently
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-[10px] font-bold px-4 py-2 rounded-sm uppercase tracking-wider transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}