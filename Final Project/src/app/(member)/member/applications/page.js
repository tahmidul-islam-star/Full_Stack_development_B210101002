"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { FileCheck, Plus, Trophy, Calendar, CheckCircle2, Clock, XCircle, X } from "lucide-react";

export default function MemberApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    contestId: "",
    teamName: "",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, contestRes] = await Promise.all([
        fetch("/api/member/dashboard"),
        fetch("/api/public/contests"),
      ]);
      const appJson = await appRes.json();
      const contestJson = await contestRes.json();

      if (appJson.success) setApplications(appJson.applications || []);
      if (contestJson.success) setContests(contestJson.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.contestId) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/member/contests/${formData.contestId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: formData.teamName,
          remarks: formData.remarks,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setModalOpen(false);
        setFormData({ contestId: "", teamName: "", remarks: "" });
        fetchData();
      } else {
        setError(data.error || "Failed to submit application");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <FileCheck className="w-8 h-8 text-amber-500" />
                Contest Applications
              </h1>
              <p className="text-sm text-slate-600 mt-1">Submit contest registration requests and check status.</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Contest</span>
            </button>
          </div>

          {/* Applications list */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-500 py-12">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center text-slate-500 py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                You haven't submitted any contest applications yet.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {app.contest?.platform || "VJudge"}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-1">{app.contest?.title || "Contest"}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Applied on: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                    {app.teamName && (
                      <p className="text-xs text-indigo-600 font-semibold mt-1">Team: {app.teamName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 ${
                      app.status === "PENDING"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : app.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}>
                      {app.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                      {app.status === "APPROVED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {app.status === "REJECTED" && <XCircle className="w-3.5 h-3.5" />}
                      <span>{app.status}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Apply to Contest</h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Select Contest</label>
                <select
                  required
                  value={formData.contestId}
                  onChange={(e) => setFormData({ ...formData, contestId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                >
                  <option value="">Choose Contest...</option>
                  {contests.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.platform})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Team Name (Optional)</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  placeholder="e.g. CSTU_Coders"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Remarks / Notes</label>
                <textarea
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  placeholder="Any additional notes for Admin..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md mt-4 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Contest Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
