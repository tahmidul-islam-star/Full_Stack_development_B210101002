"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Users, Globe, FileSpreadsheet, FileText, ExternalLink, Search } from "lucide-react";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/public/members?status=ACTIVE&role=MEMBER");
        const data = await res.json();
        if (data.success) {
          setMembers(data.data || []);
        } else {
          setError(data.error || "Failed to fetch members");
        }
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members directory.");
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.designation?.toLowerCase().includes(q) ||
      m.department?.toLowerCase().includes(q) ||
      m.session?.toLowerCase().includes(q) ||
      m.codeforcesHandle?.toLowerCase().includes(q) ||
      m.vjudgeHandle?.toLowerCase().includes(q)
    );
  });

  return (
    <>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header section with Existing Members Spreadsheet link */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              Member Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">CSTU CPC Members</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Official list of registered club members ordered by designation priority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://docs.google.com/spreadsheets/d/14jChPVDj6ysKATHUHb7Y0CWWwAnlOcs4"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>View Members Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="https://drive.google.com/file/d/1BQzvrV79zSwGQtjq3doPpi5-jXqdmh4m"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Club Constitution</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-8 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation, department, handle..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 shadow-xs"
          />
        </div>

        {/* Member Cards Grid / Loading / Error */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center animate-pulse shadow-sm"
              >
                <div className="w-24 h-24 rounded-2xl bg-slate-200 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-700 shadow-sm">
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            No active members found.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((m) => (
              <div
                key={m._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-indigo-300 hover:shadow-md transition-all shadow-sm group"
              >
                <div className="relative w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden mb-4 border border-slate-200">
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-600 font-extrabold text-2xl text-white">
                      {m.name ? m.name[0].toUpperCase() : "M"}
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 line-clamp-1">{m.name}</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{m.designation || "Member"}</p>
                <p className="text-xs text-slate-500 mt-1">Session: {m.session || "2022-23"}</p>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{m.department}</p>

                {/* Handles */}
                <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-3 text-slate-600">
                  {m.codeforcesHandle && (
                    <a
                      href={`https://codeforces.com/profile/${m.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 transition-colors text-xs font-mono"
                      title={`Codeforces: ${m.codeforcesHandle}`}
                    >
                      CF: <span className="text-emerald-700 font-bold">{m.codeforcesHandle}</span>
                    </a>
                  )}
                  {m.githubUrl && (
                    <a
                      href={m.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-900 transition-colors"
                      title="GitHub Profile"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

