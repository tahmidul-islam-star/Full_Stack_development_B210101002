"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import { Bell, Plus, Pin, Trash2, Edit2, X, CheckCircle2 } from "lucide-react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "ANNOUNCEMENT",
    isPinned: false,
    attachmentUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notices");
      const json = await res.json();
      if (json.success) setNotices(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingNotice(null);
    setFormData({ title: "", content: "", category: "ANNOUNCEMENT", isPinned: false, attachmentUrl: "" });
    setModalOpen(true);
  };

  const handleOpenEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      content: notice.content || "",
      category: notice.category || "ANNOUNCEMENT",
      isPinned: notice.isPinned || false,
      attachmentUrl: notice.attachmentUrl || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingNotice ? `/api/admin/notices/${editingNotice._id}` : "/api/admin/notices";
      const method = editingNotice ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        setFormData({ title: "", content: "", category: "ANNOUNCEMENT", isPinned: false, attachmentUrl: "" });
        fetchNotices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!confirm("Delete this notice?")) return;
    try {
      const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
      if (res.ok) fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <Bell className="w-8 h-8 text-cyan-600" />
                Notice Board Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">Publish, edit, and pin club notices & announcements.</p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Notice</span>
            </button>
          </div>

          {/* Notices Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-slate-500">Loading notices...</div>
            ) : notices.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                No notices published yet.
              </div>
            ) : (
              notices.map((n) => (
                <div
                  key={n._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative group hover:border-indigo-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                        {n.category}
                      </span>

                      {n.isPinned && (
                        <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                          <Pin className="w-3.5 h-3.5" /> Pinned
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-slate-900">{n.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(n)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Edit Notice"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(n._id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="Delete Notice"
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingNotice ? "Edit Notice" : "Create New Notice"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                >
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                  <option value="CONTEST">CONTEST</option>
                  <option value="WORKSHOP">WORKSHOP</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label htmlFor="isPinned" className="text-xs font-medium text-slate-700">
                  Pin this notice to top of homepage
                </label>
              </div>

              <FileUpload
                label="Attachment (PDF / Image)"
                value={formData.attachmentUrl}
                onUploadComplete={(url) => setFormData({ ...formData, attachmentUrl: url })}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md mt-4 disabled:opacity-50"
              >
                {submitting ? "Publishing..." : editingNotice ? "Update Notice" : "Publish Notice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
