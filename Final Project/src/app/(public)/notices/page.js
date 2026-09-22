import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/db";
import Notice from "@/models/Notice";
import { Bell, Pin, Calendar, Sparkles } from "lucide-react";

export default async function NoticesPage() {
  await connectToDatabase();
  const notices = await Notice.find().sort({ isPinned: -1, createdAt: -1 });

  return (
    <>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Bell className="w-3.5 h-3.5" />
            Official Notices
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Club Announcements</h1>
          <p className="text-slate-600 mt-1">Official club updates, schedules, and important notices.</p>
        </div>

        {notices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            No notices posted yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {notices.map((n) => (
              <div
                key={n._id.toString()}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {n.category}
                    </span>
                    {n.isPinned && (
                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                        <Pin className="w-3.5 h-3.5" /> Pinned
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">{n.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>

                  {n.attachmentUrl && (
                    <a
                      href={n.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Download Attachment →
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
