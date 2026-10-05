"use client";

import { UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdvisorPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdvisors() {
      try {
        const response = await fetch("/api/public/advisors", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load advisors.");
        }
        setAdvisors(result.data || []);
      } catch (loadError) {
        console.error("Advisor load failed:", loadError);
        setError("Unable to load advisors. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadAdvisors();
  }, []);

  return (
    <>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Advisor Panel
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
            Distinguished faculty members guiding CSTU Computer & Programming Club towards innovation, competitive programming excellence, and leadership.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-slate-500">Loading advisors...</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : advisors.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">No advisors have been published yet.</p>
        ) : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {advisors.map((advisor) => (
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
        }
      </main>

      {/* Profile Detail Modal */}
      {selectedAdvisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAdvisor(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {selectedAdvisor.avatarUrl ? (
                  <img src={selectedAdvisor.avatarUrl} alt="" className="h-full w-full object-cover object-[center_25%]" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-indigo-600">
                    <UserCheck className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {selectedAdvisor.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedAdvisor.name}</h3>
              </div>
            </div>

            <div className="space-y-1 text-sm border-t border-b border-slate-200 py-4">
              <p className="text-indigo-700 font-semibold">{selectedAdvisor.title}</p>
              <p className="text-slate-800 font-medium">{selectedAdvisor.designation}</p>
              {selectedAdvisor.department && (
                <p className="text-slate-600">{selectedAdvisor.department}</p>
              )}
              <p className="text-slate-600">{selectedAdvisor.institution}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Biography</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedAdvisor.bio}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAdvisor(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
