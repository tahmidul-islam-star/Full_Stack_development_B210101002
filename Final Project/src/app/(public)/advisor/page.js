"use client";

import Navbar from "@/components/Navbar";
import { UserCheck, Shield, Building2, GraduationCap, X, Award, ExternalLink } from "lucide-react";
import { useState } from "react";

const staticAdvisors = [
  {
    id: "atiqur-rahman",
    name: "Professor Dr. M. Atiqur Rahman",
    title: "Chief Advisor, CSTU CPC",
    designation: "Vice-Chancellor",
    department: null,
    institution: "Chandpur Science and Technology University",
    badge: "Chief Advisor",
    bio: "Professor Dr. M. Atiqur Rahman serves as the Vice-Chancellor of Chandpur Science and Technology University (CSTU) and the Chief Advisor of CSTU Computer & Programming Club (CPC). He provides overall vision and strategic guidance for promoting technical excellence, research, and innovation across the university.",
    email: "vc@cstu.ac.bd",
  },
  {
    id: "jahidul-islam",
    name: "Md. Jahidul Islam",
    title: "Advisor, CSTU CPC",
    designation: "Chairman",
    department: "Department of Computer Science and Engineering",
    institution: "Chandpur Science and Technology University",
    badge: "Advisor",
    bio: "Md. Jahidul Islam is the Chairman of the Department of Computer Science and Engineering at CSTU. As an Advisor to CSTU CPC, he actively mentors competitive programmers, guides student developers, and fosters an empowering technical culture.",
    email: "jahidul@cse.cstu.ac.bd",
  },
  {
    id: "sohel-rana",
    name: "Sohel Rana",
    title: "Advisor, CSTU CPC",
    designation: "Chairman",
    department: "Department of Information and Communication Technology",
    institution: "Chandpur Science and Technology University",
    badge: "Advisor",
    bio: "Sohel Rana is the Chairman of the Department of Information and Communication Technology at CSTU. Serving as an Advisor for CSTU CPC, he supports student technology initiatives, hackathons, and skill-building programs.",
    email: "sohel@ict.cstu.ac.bd",
  },
];

export default function AdvisorPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

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

        {/* Advisor Grid matching static card data */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {staticAdvisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group relative overflow-hidden"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                  {advisor.name}
                </h2>

                <p className="text-sm font-medium text-indigo-700 mb-1">
                  {advisor.title}
                </p>

                <p className="text-sm text-slate-600 font-normal">
                  {advisor.designation}
                </p>

                {advisor.department && (
                  <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                    {advisor.department}
                  </p>
                )}

                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                  {advisor.institution}
                </p>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => setSelectedAdvisor(advisor)}
                  className="px-5 py-2.5 rounded-lg bg-[#1b365d] hover:bg-[#122544] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {selectedAdvisor.badge}
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
