// src/pages/member/Custom.jsx
import { useState, useEffect, useCallback } from "react";
import { insertCommission, fetchMemberCommissions } from "../../lib/supabasemem";
import { Loader2, RefreshCw, Clock, CheckCircle, XCircle, HelpCircle, Sparkles, Inbox } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Custom() {
  const [user, setUser] = useState(null);
  
  // Form State
  const [requestType, setRequestType] = useState("Individual");
  const [usage, setUsage] = useState("Gaming");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // History State
  const [commissions, setCommissions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  // Retrieve user session
  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.email) {
          setEmail(parsed.email);
        }
      } catch (e) {
        console.error("Failed to parse user session in Custom", e);
      }
    }
  }, []);

  // Fetch past commissions
  const loadHistory = useCallback(() => {
    if (!user || !user.member_id) return;
    setLoadingHistory(true);
    setHistoryError(null);

    fetchMemberCommissions(user.member_id)
      .then((data) => {
        setCommissions(data || []);
      })
      .catch((err) => {
        console.warn("Failed to fetch commissions from Supabase, loading fallback", err);
        // Fallback to local storage
        try {
          const localData = JSON.parse(localStorage.getItem("custom_commissions") || "[]");
          const filteredLocal = localData.filter((item) => item.member_id === user.member_id);
          setCommissions(filteredLocal.reverse());
        } catch (e) {
          setHistoryError("Failed to fetch commission history.");
        }
      })
      .finally(() => setLoadingHistory(false));
  }, [user]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe your custom request.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const submissionData = {
      email: email.trim(),
      member_id: user ? user.member_id : null,
      request_type: requestType,
      usage_focus: usage,
      description: description.trim(),
      created_at: new Date().toISOString()
    };

    try {
      await insertCommission(submissionData);
      setSuccess(true);
      setDescription("");
      loadHistory();
    } catch (err) {
      console.warn("Supabase insertion failed, using local caching", err);
      try {
        const localRequests = JSON.parse(localStorage.getItem("custom_commissions") || "[]");
        localRequests.push(submissionData);
        localStorage.setItem("custom_commissions", JSON.stringify(localRequests));
        
        setSuccess(true);
        setDescription("");
        loadHistory();
      } catch (e) {
        setError("Failed to register request. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper for Status Badge styling
  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
            <RefreshCw className="w-3 h-3 animate-spin duration-3000" /> Reviewing
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded animate-pulse">
            <Sparkles className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded">
            <HelpCircle className="w-3 h-3" /> Unknown
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-700 bg-[#08090C] text-[#EDECE7]">
      
      {/* Title Header */}
      <header className="mb-12 border-b border-white/[0.08] pb-8">
        <h2 className="text-[10px] text-[#A78BFA] font-bold tracking-[0.3em] uppercase mb-2">
          Bespoke Services
        </h2>
        <h1 className="text-3xl font-extrabold text-[#F4F3EF] uppercase tracking-tight">
          Custom Commission
        </h1>
        <p className="text-[#9A9DA6] text-xs mt-3 leading-relaxed font-light">
          Commission a custom hand-built rig. Specify whether you're building for individual purposes or a wider corporate organization, choose your usage priorities, and provide specifications. Our architecture lead will compile your request and return a proposal within 24-48 hours.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Request Form */}
        <div className="lg:col-span-5 space-y-6 bg-[#0E0F14] border border-white/[0.06] p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C5CFC]/5 rounded-full blur-[24px] pointer-events-none"></div>

          <h3 className="text-sm font-extrabold text-[#EDECE7] uppercase tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            New Commission Request
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-semibold">
              Commission request submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contact Email */}
            <div>
              <label className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                required
                disabled
                value={email}
                className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-xl outline-none text-xs text-[#EDECE7] opacity-65 cursor-not-allowed"
              />
            </div>

            {/* Need Category */}
            <div>
              <label className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                Need Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Individual", "Organization"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRequestType(t)}
                    className={`py-2 px-3 border text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      requestType === t
                        ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                        : "bg-white/[0.02] border-white/[0.08] text-[#8A8D96] hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Usage Focus */}
            <div>
              <label className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-2">
                Primary Usage Focus
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Gaming", "Work", "Stream"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUsage(u)}
                    className={`py-2 px-2.5 border text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      usage === u
                        ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                        : "bg-white/[0.02] border-white/[0.08] text-[#8A8D96] hover:text-white"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[9px] font-bold text-[#9A9DA6] uppercase tracking-widest mb-1.5">
                Specification Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe usage goals, hardware needs (CPU cores, RAM size), aesthetic theme, or other custom preferences..."
                className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-xl focus:ring-2 focus:ring-[#7C5CFC]/20 focus:border-[#7C5CFC] outline-none text-xs text-[#EDECE7] placeholder-[#5A5D65] resize-none transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#7C5CFC]/25 flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Submitting..." : "Submit Custom Request"}
            </Button>
          </form>
        </div>

        {/* Right Column: History Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-extrabold text-[#EDECE7] uppercase tracking-wider flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#A78BFA]" />
              Submission History
            </h3>
            <button
              onClick={loadHistory}
              disabled={loadingHistory}
              className="p-1.5 border border-white/10 rounded-lg text-[#6B6E76] hover:text-[#EDECE7] hover:bg-white/[0.04] transition-all cursor-pointer"
              title="Refresh History"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-20 text-center text-[#6B6E76] flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#7C5CFC]" />
              <span className="text-xs uppercase tracking-wider font-semibold">Loading past requests...</span>
            </div>
          ) : historyError ? (
            <p className="text-xs text-rose-400 py-10 text-center">{historyError}</p>
          ) : commissions.length === 0 ? (
            <div className="py-20 text-center text-[#6B6E76] border border-dashed border-white/[0.06] rounded-2xl bg-[#0E0F14]/30">
              <p className="text-xs">No custom request submissions found.</p>
              <p className="text-[10px] text-[#5A5D65] mt-1.5">Submit the form on the left to start a new build commission.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {commissions.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-[#0E0F14] border border-white/[0.06] rounded-xl p-5 space-y-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white/[0.04] text-[#C9C2FF] border border-white/[0.08] rounded">
                          {item.request_type}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white/[0.04] text-[#C9C2FF] border border-white/[0.08] rounded">
                          {item.usage_focus}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#5A5D65] font-mono">
                        Submitted: {new Date(item.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-light text-[#9A9DA6] leading-relaxed break-words whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>

                  {item.admin_notes && (
                    <div className="bg-[#12131A] border border-white/[0.04] p-3.5 rounded-lg space-y-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#7C5CFC]">Design Lead Notes</p>
                      <p className="text-[11px] text-[#8A8D96] leading-relaxed">
                        {item.admin_notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}