"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  Search,
  X,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Code2,
} from "lucide-react";
import { isExecutiveDesignation } from "@/lib/memberClasses";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [constitutionUrl, setConstitutionUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("executive");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setSelectedMember(null);
      if (event.key === "Escape") setSelectedAdvisor(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    async function loadProfileContent() {
      try {
        const [advisorResponse, settingsResponse] = await Promise.all([
          fetch("/api/public/advisors", { cache: "no-store" }),
          fetch("/api/public/settings", { cache: "no-store" }),
        ]);
        const [advisorResult, settingsResult] = await Promise.all([
          advisorResponse.json(),
          settingsResponse.json(),
        ]);
        if (!advisorResponse.ok || !advisorResult.success) {
          throw new Error(advisorResult.error || "Unable to load advisors.");
        }
        setAdvisors(advisorResult.data || []);
        if (settingsResponse.ok && settingsResult.success) {
          setConstitutionUrl(settingsResult.data.constitutionUrl);
        }
      } catch (loadError) {
        console.error("Profile content load failed:", loadError);
      }
    }

    loadProfileContent();
  }, []);

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

  const matchesMemberSearch = (m) => {
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
  };
  const executiveMembers = members.filter(
    (member) =>
      member.memberClass === "EXECUTIVE_MEMBER" ||
      isExecutiveDesignation(member.designation)
  );
  const leadershipMembers = executiveMembers
    .slice(0, 2)
    .filter(matchesMemberSearch);
  const otherExecutiveMembers = executiveMembers
    .slice(2)
    .filter(matchesMemberSearch);
  const visibleExecutiveMembers = [
    ...leadershipMembers,
    ...otherExecutiveMembers,
  ];
  const filteredAdvisors = advisors.filter((advisor) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return [
      advisor.name,
      advisor.title,
      advisor.designation,
      advisor.department,
      advisor.institution,
    ].some((value) => value?.toLowerCase().includes(query));
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">CSTU CPC Executive Committee</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Meet the student leaders serving the CSTU Computer & Programming Club.
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

            {constitutionUrl && (
              <a
                href={constitutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Club Constitution</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        <div
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="CSTU CPC profiles"
        >
          {[
            { id: "executive", label: "Executive Members" },
            { id: "advisors", label: "Advisors" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="mb-8 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation, or department..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 shadow-xs"
          />
        </div>

        {activeTab === "advisors" ? (
          filteredAdvisors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
              No advisors match your search.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAdvisors.map((advisor) => (
                <article
                  key={advisor._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1">
                    {advisor.avatarUrl ? (
                      <img
                        src={advisor.avatarUrl}
                        alt={advisor.name}
                        className="h-full w-full rounded-lg object-cover object-[center_25%]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-4xl font-semibold text-indigo-700">
                        {advisor.name
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="px-1 pt-4 text-center">
                    <h2 className="text-base font-bold text-slate-900">{advisor.name}</h2>
                    <p className="mt-1 text-sm font-medium text-indigo-700">
                      {advisor.designation || advisor.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedAdvisor(advisor)}
                      className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-indigo-600 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      View Profile
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : loading ? (
          <div className="space-y-10 animate-pulse">
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="aspect-[4/5] rounded-xl bg-slate-200" />
                  <div className="mx-auto mt-5 h-5 w-2/3 rounded bg-slate-200" />
                  <div className="mx-auto mt-2 h-4 w-1/2 rounded bg-slate-200" />
                  <div className="mt-5 h-10 rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[4/5] rounded-xl bg-slate-200" />
                  <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mx-auto mt-2 h-3 w-1/2 rounded bg-slate-200" />
                  <div className="mt-4 h-9 rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-700 shadow-sm">
            <p className="font-semibold">{error}</p>
          </div>
        ) : visibleExecutiveMembers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            No executive members found.
          </div>
        ) : (
          <div className="space-y-12">
            {leadershipMembers.length > 0 && (
              <section aria-labelledby="leadership-heading">
                <div className="mb-5 border-b border-slate-200 pb-3">
                  <h2
                    id="leadership-heading"
                    className="text-xl font-bold tracking-tight text-slate-900"
                  >
                    Club Leadership
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {leadershipMembers.map((member) => (
                    <article
                      key={member._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-full w-full rounded-lg object-cover object-[center_25%]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-5xl font-semibold text-indigo-700">
                            {member.name ? member.name[0].toUpperCase() : "M"}
                          </div>
                        )}
                      </div>
                      <div className="px-2 pt-5 text-center">
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                          {member.name}
                        </h3>
                        {member.designation && (
                          <p className="mt-1 text-sm font-semibold text-indigo-700">
                            {member.designation}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedMember(member)}
                          className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          View Profile
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {otherExecutiveMembers.length > 0 && (
              <section aria-labelledby="executive-committee-heading">
                <div className="mb-5 border-b border-slate-200 pb-3">
                  <h2
                    id="executive-committee-heading"
                    className="text-xl font-bold tracking-tight text-slate-900"
                  >
                    Executive Committee
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {otherExecutiveMembers.map((member) => (
                    <article
                      key={member._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-full w-full rounded-lg object-cover object-[center_25%]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-4xl font-semibold text-indigo-700">
                            {member.name ? member.name[0].toUpperCase() : "M"}
                          </div>
                        )}
                      </div>
                      <div className="px-1 pt-4 text-center">
                        <h3 className="text-base font-bold text-slate-900">
                          {member.name}
                        </h3>
                        {member.designation && (
                          <p className="mt-1 text-sm font-medium text-indigo-700">
                            {member.designation}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedMember(member)}
                          className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-indigo-600 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          View Profile
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMember(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-profile-title"
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200"
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  {selectedMember.avatarUrl ? (
                    <img
                      src={selectedMember.avatarUrl}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-2xl font-extrabold text-white">
                      {selectedMember.name ? selectedMember.name[0].toUpperCase() : "M"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 id="member-profile-title" className="text-xl font-bold text-slate-900 truncate">
                    {selectedMember.name}
                  </h2>
                  {selectedMember.designation &&
                    selectedMember.designation.toLowerCase() !== "member" && (
                      <p className="text-sm font-semibold text-indigo-600 mt-1">
                        {selectedMember.designation}
                      </p>
                    )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {selectedMember.bio && (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {selectedMember.bio}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Session</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {selectedMember.session || "2022-23"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Department</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {selectedMember.department || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedMember.studentId && (
                  <p className="flex items-center gap-3 text-sm text-slate-700">
                    <IdCard className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{selectedMember.studentId}</span>
                  </p>
                )}
                {selectedMember.email && (
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex items-center gap-3 text-sm text-indigo-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{selectedMember.email}</span>
                  </a>
                )}
                {selectedMember.phone && (
                  <a
                    href={`tel:${selectedMember.phone}`}
                    className="flex items-center gap-3 text-sm text-indigo-600 hover:underline"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{selectedMember.phone}</span>
                  </a>
                )}
                {selectedMember.codeforcesHandle && (
                  <a
                    href={`https://codeforces.com/profile/${selectedMember.codeforcesHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    Codeforces Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedMember.vjudgeHandle && (
                  <a
                    href={`https://vjudge.net/user/${selectedMember.vjudgeHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
                  >
                    VJudge Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedMember.githubUrl && (
                  <a
                    href={selectedMember.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
                  >
                    <Code2 className="w-4 h-4" />
                    GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {!selectedMember.studentId &&
                  !selectedMember.email &&
                  !selectedMember.phone &&
                  !selectedMember.codeforcesHandle &&
                  !selectedMember.vjudgeHandle &&
                  !selectedMember.githubUrl && (
                    <p className="flex items-center gap-3 text-sm text-slate-500">
                      <MapPin className="w-4 h-4" />
                      No additional profile details available.
                    </p>
                  )}
              </div>
            </div>
          </section>
        </div>
      )}
      {selectedAdvisor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedAdvisor(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="advisor-profile-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {selectedAdvisor.avatarUrl ? (
                    <img
                      src={selectedAdvisor.avatarUrl}
                      alt={selectedAdvisor.name}
                      className="h-full w-full object-cover object-[center_25%]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-indigo-700">
                      {selectedAdvisor.name
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 id="advisor-profile-title" className="truncate text-xl font-bold text-slate-900">
                    {selectedAdvisor.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-indigo-700">
                    {selectedAdvisor.designation || selectedAdvisor.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdvisor(null)}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close advisor profile"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-800">{selectedAdvisor.title}</p>
                {selectedAdvisor.department && (
                  <p className="text-slate-600">{selectedAdvisor.department}</p>
                )}
                {selectedAdvisor.institution && (
                  <p className="text-slate-600">{selectedAdvisor.institution}</p>
                )}
              </div>
              {selectedAdvisor.bio && (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {selectedAdvisor.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-3 text-sm">
                {selectedAdvisor.email && (
                  <a href={`mailto:${selectedAdvisor.email}`} className="font-medium text-indigo-700 hover:underline">
                    Email
                  </a>
                )}
                {selectedAdvisor.websiteUrl && (
                  <a href={selectedAdvisor.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 hover:underline">
                    Website
                  </a>
                )}
                {selectedAdvisor.linkedinUrl && (
                  <a href={selectedAdvisor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 hover:underline">
                    LinkedIn
                  </a>
                )}
                {selectedAdvisor.facebookUrl && (
                  <a href={selectedAdvisor.facebookUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 hover:underline">
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
