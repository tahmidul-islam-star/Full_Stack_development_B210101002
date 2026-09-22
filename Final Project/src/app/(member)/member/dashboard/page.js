"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { UserCheck, IdCard, FileCheck, Trophy, Bell, ArrowRight, Sparkles, Calendar } from "lucide-react";

export default function MemberDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMemberDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/member/dashboard");
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDashboard();
  }, []);

  return (
    <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/30 overflow-hidden shrink-0 shadow-md relative">
                {data?.profile?.avatarUrl ? (
                  <img
                    src={data.profile.avatarUrl}
                    alt={data.profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/20 font-extrabold text-2xl text-white">
                    {data?.profile?.name ? data.profile.name[0].toUpperCase() : "M"}
                  </div>
                )}
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 mb-2 backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  MEMBER PORTAL
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {data?.profile?.name || "Member"}!
                </h1>
                <p className="text-indigo-100 text-xs sm:text-sm mt-1">
                  Designation: <span className="text-white font-semibold">{data?.profile?.designation || "Member"}</span> • Dept: {data?.profile?.department || "CSE"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              href="/member/credential"
              className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 transition-all group shadow-sm flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <IdCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Digital ID Card</h3>
                <p className="text-xs text-slate-500 mt-0.5">View QR & download PDF</p>
              </div>
            </Link>

            <Link
              href="/member/applications"
              className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-amber-400 transition-all group shadow-sm flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Contest Applications</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {data?.applications?.length || 0} Submissions
                </p>
              </div>
            </Link>

            <Link
              href="/member/profile"
              className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 transition-all group shadow-sm flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Edit Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Update handles & avatar</p>
              </div>
            </Link>
          </div>

          {/* Member Profile Quick Card & Applications */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contest Applications Status */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-500" />
                    My Contest Registrations
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recent contest application statuses</p>
                </div>
                <Link
                  href="/member/applications"
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-slate-500 text-sm">Loading applications...</div>
              ) : !data?.applications || data.applications.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  No contest applications submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.applications.slice(0, 4).map((app) => (
                    <div
                      key={app._id.toString()}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {app.contestId?.title || "Contest"}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Team: <span className="text-slate-700 font-medium">{app.teamName || "Individual"}</span>
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          app.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : app.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Competitive Programming Handles Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-indigo-600" />
                      CP Handles & Credentials
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Your linked coding handles</p>
                  </div>
                  <Link
                    href="/member/profile"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Edit Handles
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Codeforces</span>
                    <span className="text-sm font-mono font-bold text-emerald-700">
                      {data?.profile?.codeforcesHandle || "Not linked"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">VJudge</span>
                    <span className="text-sm font-mono font-bold text-indigo-600">
                      {data?.profile?.vjudgeHandle || "Not linked"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">GitHub</span>
                    <span className="text-sm font-mono font-bold text-slate-800 truncate max-w-[200px]">
                      {data?.profile?.githubUrl || "Not linked"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 text-center">
                Keep handles updated to participate in club leaderboard rankings!
              </div>
            </div>
          </div>
    </>
  );
}
