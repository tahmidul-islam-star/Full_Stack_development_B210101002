"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  CreditCard,
  UserCheck,
  X,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [remarks, setRemarks] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/applications?status=${statusFilter}`);
      const json = await res.json();
      if (json.success) {
        setApplications(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, remarks }),
      });

      const json = await res.json();
      if (json.success) {
        if (selectedApp?._id === id) {
          setSelectedApp(null);
        }
        setRemarks("");
        fetchApplications();
      } else {
        alert(json.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedApp?._id === id) setSelectedApp(null);
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApps = applications.filter(
    (app) =>
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.department?.toLowerCase().includes(search.toLowerCase()) ||
      app.transactionNumber?.toLowerCase().includes(search.toLowerCase()) ||
      app.codeforcesHandle?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

  return (
    <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMIN CONTROL PANEL
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <FileCheck className="w-8 h-8 text-indigo-600" />
                Club Joining Applications
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Review and approve student membership applications to CSTU CPC.
              </p>
            </div>

            <div className="flex items-center gap-2">
              

              <button
                onClick={fetchApplications}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setStatusFilter("ALL")}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                statusFilter === "ALL"
                  ? "border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Received</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</p>
            </div>

            <div
              onClick={() => setStatusFilter("PENDING")}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                statusFilter === "PENDING"
                  ? "border-amber-600 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <p className="text-xs font-semibold text-amber-600 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Pending
              </p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
            </div>

            <div
              onClick={() => setStatusFilter("APPROVED")}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                statusFilter === "APPROVED"
                  ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                  : "border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <p className="text-xs font-semibold text-emerald-600 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedCount}</p>
            </div>

            <div
              onClick={() => setStatusFilter("REJECTED")}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                statusFilter === "REJECTED"
                  ? "border-rose-600 shadow-md ring-2 ring-rose-500/20"
                  : "border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <p className="text-xs font-semibold text-rose-600 uppercase flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">{rejectedCount}</p>
            </div>
          </div>

          {/* Search Bar & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name, Student ID, TxID, Codeforces..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 shadow-xs"
              >
                <option value="ALL">ALL APPLICATIONS</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Applicant Info</th>
                    <th className="px-6 py-4">Academic Details</th>
                    <th className="px-6 py-4">Codeforces</th>
                    <th className="px-6 py-4">Payment TxID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">
                        Loading applications...
                      </td>
                    </tr>
                  ) : filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">
                        No joining applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">{app.name}</p>
                            <p className="text-xs text-slate-500">{app.email}</p>
                            {app.phone && <p className="text-[11px] text-slate-400">{app.phone}</p>}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-indigo-600 font-mono">
                            ID: {app.studentId}
                          </p>
                          <p className="text-xs text-slate-800">{app.department}</p>
                          <p className="text-xs text-slate-500">Session: {app.session}</p>
                        </td>

                        <td className="px-6 py-4 font-mono text-xs">
                          {app.codeforcesHandle ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              {app.codeforcesHandle}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300 font-mono flex items-center gap-1.5 w-fit">
                            <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{app.paymentMethod}: {app.transactionNumber}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${
                              app.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : app.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {app.status === "APPROVED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {app.status === "REJECTED" && <XCircle className="w-3.5 h-3.5" />}
                            {app.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                            <span>{app.status}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="View Full Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            {app.status === "PENDING" && (
                              <>
                                <button
                                  disabled={updatingId === app._id}
                                  onClick={() => handleUpdateStatus(app._id, "APPROVED")}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs disabled:opacity-50"
                                  title="Approve Member"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>

                                <button
                                  disabled={updatingId === app._id}
                                  onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                                  title="Reject Application"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDelete(app._id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal View & Manage Details */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Application Review
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedApp.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Submitted on {new Date(selectedApp.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Student ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.studentId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Email Address:</span>
                <span className="font-semibold text-slate-900">{selectedApp.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Phone Number:</span>
                <span className="text-slate-900">{selectedApp.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="text-slate-900">{selectedApp.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Session:</span>
                <span className="text-slate-900">{selectedApp.session}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Codeforces Handle:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {selectedApp.codeforcesHandle || "None"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Payment Method:</span>
                <span className="font-bold text-indigo-700">{selectedApp.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedApp.transactionNumber}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Admin Remarks / Note
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add optional internal note..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={updatingId === selectedApp._id}
                onClick={() => handleUpdateStatus(selectedApp._id, "APPROVED")}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Account</span>
              </button>

              <button
                disabled={updatingId === selectedApp._id}
                onClick={() => handleUpdateStatus(selectedApp._id, "REJECTED")}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
