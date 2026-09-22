"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
  Users,
  Bell,
  Calendar,
  Trophy,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMIN CONTROL CENTER
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">System Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Manage club members, applications, announcements, events, and contests.</p>
            </div>

            <button
              onClick={fetchStats}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* Key Metric Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/admin/applications"
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-indigo-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Join Applications</span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.stats?.pendingJoinApplications || 0}</p>
              <p className="text-xs text-indigo-600 mt-2 font-medium flex items-center gap-1 group-hover:underline">
                Review Applications <ArrowRight className="w-3 h-3" />
              </p>
            </Link>

            <Link
              href="/admin/members"
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-blue-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Members</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.stats?.totalMembers || 0}</p>
              <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1 group-hover:underline">
                Manage Directory <ArrowRight className="w-3 h-3" />
              </p>
            </Link>

            <Link
              href="/admin/notices"
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-cyan-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Notices Posted</span>
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                  <Bell className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.stats?.totalNotices || 0}</p>
              <p className="text-xs text-cyan-600 mt-2 font-medium flex items-center gap-1 group-hover:underline">
                View Notice Board <ArrowRight className="w-3 h-3" />
              </p>
            </Link>

            <Link
              href="/admin/events"
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Active Events</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.stats?.totalEvents || 0}</p>
              <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1 group-hover:underline">
                Manage Events <ArrowRight className="w-3 h-3" />
              </p>
            </Link>

            <Link
              href="/admin/contests"
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-amber-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Contests</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.stats?.totalContests || 0}</p>
              <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1 group-hover:underline">
                Manage Contests <ArrowRight className="w-3 h-3" />
              </p>
            </Link>
          </div>

          {/* Pending Applications & Recent Members Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Membership Applications */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    Joining Applications
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Student membership requests</p>
                </div>
                <Link href="/admin/applications" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Manage All
                </Link>
              </div>

              {!data?.recentJoinApplications || data.recentJoinApplications.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs my-auto">
                  No pending join applications.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentJoinApplications.map((app) => (
                    <div
                      key={app._id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{app.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ID: <span className="text-indigo-600 font-mono font-semibold">{app.studentId}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          TxID: {app.paymentMethod} - {app.transactionNumber}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        app.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : app.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Contest Applications */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-500" />
                    Contest Applications
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Contest applications review</p>
                </div>
                <Link href="/admin/contests" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Manage All
                </Link>
              </div>

              {!data?.recentApplications || data.recentApplications.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs my-auto">
                  No pending contest applications.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{app.user?.name || "Member"}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Contest: <span className="text-indigo-600 font-semibold">{app.contest?.title}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        PENDING
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Members */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Recent Members
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Newly joined club members</p>
                </div>
                <Link href="/admin/members" className="text-xs font-semibold text-indigo-600 hover:underline">
                  View Directory
                </Link>
              </div>

              {!data?.recentMembers || data.recentMembers.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs my-auto">
                  No members found.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentMembers.map((m) => (
                    <div
                      key={m._id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                          {m.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{m.name}</h4>
                          <p className="text-xs text-slate-500">{m.department || "CSE"}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {m.designation || "Member"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
    </>
  );
}
