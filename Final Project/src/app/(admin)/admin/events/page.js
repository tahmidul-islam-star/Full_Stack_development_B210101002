"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import { Calendar, Plus, MapPin, ExternalLink, Trash2, Edit2, X } from "lucide-react";

function toLocalDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    eventDate: "",
    coverImage: "",
    registrationLink: "",
    status: "UPCOMING",
    isPublished: true,
    isFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Unable to load events.");
      setEvents(json.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/events", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load events.");
        }
        if (active) setEvents(result.data || []);
      })
      .catch((fetchError) => {
        console.error("Event management load error:", fetchError);
        if (active) setError(fetchError.message || "Unable to load events.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({ title: "", description: "", venue: "", eventDate: "", coverImage: "", registrationLink: "", status: "UPCOMING", isPublished: true, isFeatured: false });
    setModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || "",
      description: evt.description || "",
      venue: evt.venue || "",
      eventDate: toLocalDateTime(evt.eventDate),
      coverImage: evt.coverImage || "",
      registrationLink: evt.registrationLink || "",
      status: evt.status || "UPCOMING",
      isPublished: evt.isPublished !== false,
      isFeatured: Boolean(evt.isFeatured),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent._id}` : "/api/admin/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Unable to save event.");
      setModalOpen(false);
      setFormData({ title: "", description: "", venue: "", eventDate: "", coverImage: "", registrationLink: "", status: "UPCOMING", isPublished: true, isFeatured: false });
      fetchEvents();
      if (result.warning) setError(result.warning);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save event.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || "Unable to delete event.");
      fetchEvents();
      if (result.warning) setError(result.warning);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to delete event.");
    }
  };

  return (
    <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-emerald-600" />
                Event Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">Schedule and manage workshops, bootcamps, and hackathons.</p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>

          {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-slate-500">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                No active events created yet.
              </div>
            ) : (
              events.map((evt) => (
                <div
                  key={evt._id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {evt.coverImage && (
                      <div className="h-44 w-full bg-slate-100 overflow-hidden">
                        <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="p-6">
                      <p className="text-xs font-semibold text-emerald-600 mb-1">
                        {new Date(evt.eventDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{evt.title}</h3>
                      <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                        <span className={evt.isPublished === false ? "text-slate-500" : "text-emerald-700"}>{evt.isPublished === false ? "Hidden" : "Published"}</span>
                        {evt.isFeatured && <span className="text-amber-700">Featured</span>}
                        <span className="text-indigo-700">{evt.status || "UPCOMING"}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{evt.description}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(evt)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt._id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
               ))
            )}
          </div>

          {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingEvent ? "Edit Event Details" : "Create New Event"}
            </h2>
            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Event Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Venue / Location</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">External Registration URL</label>
                <input
                  type="url"
                  value={formData.registrationLink}
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="block text-xs font-semibold text-slate-600 uppercase">Status
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-900">
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 self-end pb-3 text-xs font-medium text-slate-700">
                  <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="h-4 w-4 rounded text-indigo-600" />
                  Published
                </label>
                <label className="flex items-center gap-2 self-end pb-3 text-xs font-medium text-slate-700">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="h-4 w-4 rounded text-indigo-600" />
                  Featured
                </label>
              </div>

              <FileUpload
                label="Cover Image"
                value={formData.coverImage}
                onUploadComplete={(url) => setFormData({ ...formData, coverImage: url })}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md mt-4 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
