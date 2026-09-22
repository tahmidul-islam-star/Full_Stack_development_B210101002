import Link from "next/link";
import {
  Code2,
  Trophy,
  Bell,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  FileText,
  ExternalLink,
  Camera,
  Users,
  Award,
  Zap,
  Terminal,
  Compass,
} from "lucide-react";
import galleryData from "@/data/gallery.json";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Notice from "@/models/Notice";
import ContestResult from "@/models/ContestResult";
import { sortByDesignation } from "@/lib/designations";

export default async function Home() {
  await connectToDatabase();

  const rawMembers = await User.find({ status: "ACTIVE", role: "MEMBER" })
    .select("name designation department session avatarUrl codeforcesHandle")
    .lean();

  const members = sortByDesignation(rawMembers).slice(0, 6);

  const notices = await Notice.find()
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(3);

  const standings = await ContestResult.find()
    .populate("user", "name department studentId avatarUrl codeforcesHandle")
    .sort({ problemsSolved: -1, rating: -1 })
    .limit(5);

  const stats = [
    { label: "Active Members", value: `${rawMembers.length || 120}+`, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Contests Conducted", value: "25+", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Workshops & Events", value: "40+", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Department Support", value: "CSE & ICT", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const pillars = [
    {
      title: "Competitive Programming",
      desc: "Regular intra-university contests, VJudge bootcamps, and national IUPC participation.",
      icon: Terminal,
      color: "from-indigo-600 to-blue-600",
    },
    {
      title: "Software & Web Development",
      desc: "Hands-on projects, modern tech stacks, hackathons, and collaborative software engineering.",
      icon: Code2,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Skill Bootcamps & Workshops",
      desc: "Expert-led interactive sessions covering algorithms, data structures, and industry tools.",
      icon: Zap,
      color: "from-cyan-600 to-teal-600",
    },
    {
      title: "Mentorship & Guidance",
      desc: "Continuous supervision from CSTU faculty advisors and senior competitive programmers.",
      icon: Compass,
      color: "from-emerald-600 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden bg-white border-b border-slate-200/80">
        {/* Background Decorative Lighting Mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-200/60 via-blue-200/40 to-cyan-200/50 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-8 shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Chandpur Science and Technology University</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Code • Learn • Build •{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Lead
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            The official hub for competitive programmers, software developers, and tech innovators at Chandpur Science and Technology University.
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/join"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <UserPlus className="w-5 h-5 text-indigo-200" />
              <span>Apply for Club Membership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://drive.google.com/file/d/1BQzvrV79zSwGQtjq3doPpi5-jXqdmh4m"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Club Constitution</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:border-indigo-300 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${st.bg} ${st.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{st.value}</span>
                  <span className="text-xs font-semibold text-slate-500 mt-1">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4 Pillars / Features Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Club Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              What We Do at CSTU CPC
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Building a culture of problem solving, coding excellence, and technology leadership.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pil.color} text-white flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {pil.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                      {pil.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Announcements Snapshot */}
      {notices.length > 0 && (
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                  <Bell className="w-3.5 h-3.5 text-indigo-600" />
                  Official Bulletins
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Latest Announcements</h2>
                <p className="text-sm text-slate-600 mt-1">Stay updated with official notices and contest news</p>
              </div>
              <Link
                href="/notices"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 hover:bg-slate-200 text-xs sm:text-sm font-bold text-slate-800 transition-colors shadow-xs self-start sm:self-auto"
              >
                <span>View All Notices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <div
                  key={notice._id.toString()}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-300 hover:shadow-lg transition-all duration-200 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                        {notice.category}
                      </span>
                      {notice.isPinned && (
                        <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                          ★ Pinned
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-snug">{notice.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{new Date(notice.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <Link href="/notices" className="text-indigo-600 font-bold hover:underline">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Executive & Club Members Showcase */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Club Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Club Leadership & Programmers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Meet the executive committee members and active programmers of CSTU CPC.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {members.map((member) => (
              <div
                key={member._id.toString()}
                className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center justify-between hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-xs group relative overflow-hidden"
              >
                <div className="flex flex-col items-center w-full min-w-0">
                  {/* Avatar Frame */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3.5 border-2 border-slate-100 group-hover:border-indigo-500 shadow-sm transition-all duration-300 shrink-0">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white font-black text-2xl sm:text-3xl">
                        {member.name ? member.name[0].toUpperCase() : "M"}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1 w-full group-hover:text-indigo-600 transition-colors">
                    {member.name}
                  </h3>

                  {/* Designation Badge */}
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                      {member.designation || "Member"}
                    </span>
                  </div>

                  {/* Session & Department */}
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-2 line-clamp-1 w-full">
                    {member.department || "CSE"} • {member.session || "2022-23"}
                  </p>
                </div>

                {/* Codeforces Handle Badge */}
                {member.codeforcesHandle ? (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 w-full flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-emerald-700 bg-emerald-50/80 py-1 rounded-xl border border-emerald-200/60 truncate">
                    CF: {member.codeforcesHandle}
                  </div>
                ) : (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 w-full flex items-center justify-center text-[10px] sm:text-xs font-medium text-slate-400 py-1">
                    CSTU CPC Member
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-sm font-bold text-slate-900 transition-colors shadow-xs"
            >
              <span>View Full Member Directory</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contest Standings Leaderboard */}
      {standings.length > 0 && (
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Leaderboard Rankings
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" />
                Contest Performance Leaderboard
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">Top rankers in club programming contests</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100/90 text-xs uppercase font-extrabold text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Member Name</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4 text-center">Problems Solved</th>
                      <th className="px-6 py-4 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standings.map((item, index) => {
                      const rankNum = item.rank || index + 1;
                      return (
                        <tr key={item._id.toString()} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                              rankNum === 1
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : rankNum === 2
                                ? "bg-slate-200 text-slate-800 border border-slate-300"
                                : rankNum === 3
                                ? "bg-orange-100 text-orange-800 border border-orange-300"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              #{rankNum}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {item.user?.name || "Member"}
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-xs font-medium">{item.user?.department || "CSE"}</td>
                          <td className="px-6 py-4 text-center font-mono font-bold text-emerald-700">
                            {item.problemsSolved}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-amber-600">
                            {item.rating}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Event Photo Gallery Highlight */}
      {galleryData.length > 0 && (
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  Visual Highlights
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Event & Achievement Gallery</h2>
                <p className="text-slate-600 text-sm mt-1">Memories from IUPCs, intra-university contests, and workshops</p>
              </div>

              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-bold text-slate-900 transition-colors self-start sm:self-auto shadow-xs"
              >
                <span>View Full Photo Gallery</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryData.slice(0, 4).map((item, index) => (
                <Link
                  key={index}
                  href="/gallery"
                  className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-slate-200 bg-white text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              CPC
            </div>
            <span className="font-bold text-slate-900">CSTU Computer & Programming Club</span>
          </div>
          <p>© 2026 CSTU Computer & Programming Club | All Rights Reserved</p>
          <p className="text-slate-500 font-medium">Chandpur Science and Technology University</p>
        </div>
      </footer>
    </div>
  );
}
