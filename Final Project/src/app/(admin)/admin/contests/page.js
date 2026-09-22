"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Trophy, Plus, CheckCircle2, XCircle, Clock, Trash2, Edit2, X, ExternalLink, ShieldCheck, UserCheck } from "lucide-react";

export default function AdminContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContest, setEditingContest] = useState(null);

  // Application / Result modal states
  const [selectedContest, setSelectedContest] = useState(null);
  const [applications, setApplications] = useState([]);
  const [results, setResults] = useState([]);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  // Result entry form
  const [members, setMembers] = useState([]);
  const [resultForm, setResultForm] = useState({ userId: "", problemsSolved: 0, rating: 1000, rank: 1 });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "VJudge",
    contestUrl: "",
    contestDate: "",
    registrationDeadline: "",
    status: "UPCOMING",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/contests");
      const json = await res.json();
      if (json.success) setContests(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/members");
      const json = await res.json();
      if (json.success) setMembers(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchContestDetails = async (contestId) => {
    try {
      const [appRes, resRes] = await Promise.all([
        fetch(`/api/admin/contests/${contestId}/applications`),
        fetch(`/api/admin/contests/${contestId}/results`),
      ]);
      const appJson = await appRes.json();
      const resJson = await resRes.json();

      if (appJson.success) setApplications(appJson.data || []);
      if (resJson.success) setResults(resJson.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContests();
    fetchMembers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingContest(null);
    setFormData({
      title: "",
      description: "",
      platform: "VJudge",
      contestUrl: "",
      contestDate: "",
      registrationDeadline: "",
      status: "UPCOMING",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (c) => {
    setEditingContest(c);
    setFormData({
      title: c.title || "",
      description: c.description || "",
      platform: c.platform || "VJudge",
      contestUrl: c.contestUrl || "",
      contestDate: c.contestDate ? new Date(c.contestDate).toISOString().split("T")[0] : "",
      registrationDeadline: c.registrationDeadline ? new Date(c.registrationDeadline).toISOString().split("T")[0] : "",
      status: c.status || "UPCOMING",
    });
    setModalOpen(true);
  };

  const handleSubmitContest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingContest ? `/api/admin/contests/${editingContest._id}` : "/api/admin/contests";
      const method = editingContest ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchContests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContest = async (id) => {
    if (!confirm("Delete this contest entry?")) return;
    try {
      const res = await fetch(`/api/admin/contests/${id}`, { method: "DELETE" });
      if (res.ok) fetchContests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenApplications = (c) => {
    setSelectedContest(c);
    fetchContestDetails(c._id);
    setAppModalOpen(true);
  };

  const handleOpenResults = (c) => {
    setSelectedContest(c);
    fetchContestDetails(c._id);
    setResultModalOpen(true);
  };

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      const res = await fetch(`/api/admin/contests/${selectedContest._id}/applications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status }),
      });
      if (res.ok) {
        fetchContestDetails(selectedContest._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    if (!resultForm.userId) return;

    try {
      const res = await fetch(`/api/admin/contests/${selectedContest._id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultForm),
      });
      if (res.ok) {
        setResultModalOpen(false);
        fetchContestDetails(selectedContest._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" />
                Contest Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">Manage contests, process member applications, and update standings.</p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Contest</span>
            </button>
          </div>

          {/* Contests Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-slate-500">Loading contests...</div>
            ) : contests.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                No contests configured yet.
              </div>
            ) : (
              contests.map((c) => (
                <div
                  key={c._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-indigo-300 transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                        {c.platform}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === "UPCOMING"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : c.status === "RUNNING"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900">{c.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Contest Date: {new Date(c.contestDate).toLocaleDateString()}</span>
                      {c.contestUrl && (
                        <a
                          href={c.contestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenApplications(c)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <span>Applications</span>
                      </button>
                      <button
                        onClick={() => handleOpenResults(c)}
                        className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Standings</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Edit Contest"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContest(c._id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="Delete Contest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create / Edit Contest Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingContest ? "Edit Contest" : "Create New Contest"}
            </h2>

            <form onSubmit={handleSubmitContest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contest Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Platform</label>
                  <input
                    type="text"
                    required
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                    placeholder="VJudge, Codeforces..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="RUNNING">RUNNING</option>
                    <option value="ENDED">ENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contest URL</label>
                <input
                  type="url"
                  value={formData.contestUrl}
                  onChange={(e) => setFormData({ ...formData, contestUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contest Date</label>
                  <input
                    type="date"
                    required
                    value={formData.contestDate}
                    onChange={(e) => setFormData({ ...formData, contestDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Registration Deadline</label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md mt-4 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingContest ? "Update Contest" : "Create Contest"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {appModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setAppModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Contest Applications</h2>
            <p className="text-xs text-indigo-600 font-semibold mb-6">{selectedContest?.title}</p>

            {applications.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-200">
                No applications submitted for this contest yet.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900">{app.user?.name || "Member"}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                          app.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : app.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {app.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                          {app.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                          {app.status === "PENDING" && <Clock className="w-3 h-3" />}
                          <span>{app.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{app.user?.email} • {app.user?.studentId || "No ID"}</p>
                      {app.teamName && <p className="text-xs text-indigo-600 font-semibold mt-1">Team: {app.teamName}</p>}
                      {app.remarks && <p className="text-xs text-slate-500 italic mt-0.5">Remarks: "{app.remarks}"</p>}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <label className="text-xs font-semibold text-slate-500">Change Status:</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase outline-none cursor-pointer border transition-colors shadow-xs ${
                          app.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                            : app.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                            : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                        }`}
                      >
                        <option value="PENDING" className="bg-white text-slate-900 font-sans">PENDING</option>
                        <option value="APPROVED" className="bg-white text-slate-900 font-sans">APPROVED</option>
                        <option value="REJECTED" className="bg-white text-slate-900 font-sans">REJECTED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standings Modal */}
      {resultModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setResultModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Contest Standings Entry</h2>
            <p className="text-xs text-indigo-600 font-semibold mb-6">{selectedContest?.title}</p>

            {(() => {
              const approvedMembers = applications
                .filter((app) => app.status === "APPROVED" && app.user)
                .map((app) => app.user);

              return (
                <form onSubmit={handleAddResult} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">Add Rank / Result</h4>

                  {approvedMembers.length === 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      ⚠️ No approved applicants found for this contest. Please approve contest applications first before adding standings.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Approved Contest Participant</label>
                      <select
                        required
                        value={resultForm.userId}
                        onChange={(e) => setResultForm({ ...resultForm, userId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 outline-none"
                      >
                        <option value="">Select Approved Member...</option>
                        {approvedMembers.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name} ({m.studentId || m.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">Problems Solved</label>
                      <input
                        type="number"
                        value={resultForm.problemsSolved}
                        onChange={(e) => setResultForm({ ...resultForm, problemsSolved: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase">Rating Score</label>
                      <input
                        type="number"
                        value={resultForm.rating}
                        onChange={(e) => setResultForm({ ...resultForm, rating: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={approvedMembers.length === 0}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
                  >
                    Save Result Entry
                  </button>
                </form>
              );
            })()}

            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Current Leaderboard</h4>
            {results.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
                No standings entered yet.
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={r._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-indigo-600 mr-2">#{i + 1}</span>
                      <span className="font-semibold text-slate-900">{r.user?.name || "Member"}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-emerald-700 font-bold">{r.problemsSolved} Solved</span>
                      <span className="text-amber-600 font-bold">{r.rating} Rating</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
