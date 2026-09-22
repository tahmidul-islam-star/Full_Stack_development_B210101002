import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/db";
import Event from "@/models/Event";
import { Calendar, MapPin, ExternalLink, Sparkles } from "lucide-react";

export default async function EventsPage() {
  await connectToDatabase();
  const events = await Event.find().sort({ eventDate: 1 });

  return (
    <>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            Workshops & Events
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Upcoming Club Events</h1>
          <p className="text-slate-600 mt-1">Join our hands-on workshops, bootcamps, and hackathons.</p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            No active events scheduled at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((evt) => (
              <div
                key={evt._id.toString()}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                {evt.coverImage && (
                  <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                    <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(evt.eventDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-3">{evt.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{evt.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{evt.venue}</span>
                    </div>

                    {evt.registrationLink && (
                      <a
                        href={evt.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <span>Register for Event</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
