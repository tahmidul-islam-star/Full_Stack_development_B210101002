import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";
import ContestResult from "@/models/ContestResult";
import { Trophy, Calendar, ExternalLink, Clock, Sparkles } from "lucide-react";

export default async function ContestsPage() {
  await connectToDatabase();

  const contests = await Contest.find().sort({ contestDate: -1 });

  const standings = await ContestResult.find()
    .populate("user", "name department studentId avatarUrl")
    .sort({ problemsSolved: -1, rating: -1 })
    .limit(10);

  return (
    <>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            Competitive Programming
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Club Contests & Rankings</h1>
          <p className="text-slate-600 mt-1">Participate in IUPC contests and view leaderboard rankings.</p>
        </div>

        {/* Contests Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Contest Schedule
          </h2>

          {contests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
              No contests scheduled yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((c) => (
                <div
                  key={c._id.toString()}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-indigo-300 transition-all space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                        {c.platform || "VJudge"}
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
                    <p className="text-sm text-slate-600 mt-1 line-clamp-3 leading-relaxed">{c.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Date: {new Date(c.contestDate).toLocaleDateString()}</span>
                      {c.contestUrl && (
                        <a
                          href={c.contestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          Enter <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Global Leaderboard Table */}
        <section className="space-y-6 pt-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top CP Rankers
          </h2>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4 text-center">Problems Solved</th>
                    <th className="px-6 py-4 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {standings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-500">
                        No leaderboard standings entries yet.
                      </td>
                    </tr>
                  ) : (
                    standings.map((item, index) => (
                      <tr key={item._id.toString()} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-indigo-600">#{item.rank || index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {item.user?.name || "Member"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.user?.department || "CSE"}</td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-emerald-700">
                          {item.problemsSolved}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-amber-600">
                          {item.rating}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
