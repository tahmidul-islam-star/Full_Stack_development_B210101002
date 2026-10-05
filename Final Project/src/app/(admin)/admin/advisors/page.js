"use client";

import { useEffect, useState } from "react";
import { Edit2, GraduationCap, Plus, Trash2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";

const emptyAdvisor = {
  name: "",
  title: "Advisor, CSTU CPC",
  designation: "",
  department: "",
  institution: "Chandpur Science and Technology University",
  bio: "",
  email: "",
  avatarUrl: "",
  websiteUrl: "",
  linkedinUrl: "",
  facebookUrl: "",
  displayOrder: 0,
  isActive: true,
  isPublished: true,
};

const textFields = [
  ["name", "Name", true],
  ["title", "Club title", false],
  ["designation", "Designation", false],
  ["department", "Department", false],
  ["institution", "Institution", false],
  ["email", "Email", false],
  ["websiteUrl", "Website URL", false],
  ["linkedinUrl", "LinkedIn URL", false],
  ["facebookUrl", "Facebook URL", false],
];

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminAdvisorsPage() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [formData, setFormData] = useState(emptyAdvisor);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAdvisors = async () => {
    try {
      const response = await fetch("/api/admin/advisors", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to load advisors.");
      }
      setAdvisors(result.data || []);
      setError("");
    } catch (fetchError) {
      console.error("Advisor management load error:", fetchError);
      setError(fetchError.message || "Unable to load advisors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/advisors", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load advisors.");
        }
        if (active) setAdvisors(result.data || []);
      })
      .catch((fetchError) => {
        console.error("Advisor management load error:", fetchError);
        if (active) setError(fetchError.message || "Unable to load advisors.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setEditingAdvisor(null);
    setFormData(emptyAdvisor);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (advisor) => {
    setEditingAdvisor(advisor);
    setFormData({ ...emptyAdvisor, ...advisor });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        editingAdvisor
          ? `/api/admin/advisors/${editingAdvisor._id}`
          : "/api/admin/advisors",
        {
          method: editingAdvisor ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            displayOrder: Number(formData.displayOrder) || 0,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save advisor.");
      }
      setModalOpen(false);
      await fetchAdvisors();
      if (result.warning) setError(result.warning);
    } catch (submitError) {
      console.error("Advisor save error:", submitError);
      setError(submitError.message || "Unable to save advisor.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAdvisor = async (advisor) => {
    if (!confirm(`Delete advisor ${advisor.name}?`)) return;
    try {
      const response = await fetch(`/api/admin/advisors/${advisor._id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to delete advisor.");
      }
      await fetchAdvisors();
      if (result.warning) setError(result.warning);
    } catch (deleteError) {
      console.error("Advisor delete error:", deleteError);
      setError(deleteError.message || "Unable to delete advisor.");
    }
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            Advisor Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage advisor profiles and their public visibility.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Advisor
        </button>
      </header>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-12 text-center text-slate-500">Loading advisors…</p>
      ) : advisors.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No advisors have been added yet.
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {advisors.map((advisor) => (
            <article key={advisor._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-indigo-600">
                  {advisor.avatarUrl ? (
                    <img src={advisor.avatarUrl} alt={advisor.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-bold text-white">
                      {initials(advisor.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900">{advisor.name}</h2>
                  <p className="mt-1 text-sm text-indigo-700">{advisor.designation || advisor.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{advisor.department}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-slate-600">{advisor.bio || "No biography provided."}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className={`text-xs font-semibold ${advisor.isActive && advisor.isPublished ? "text-emerald-700" : "text-slate-500"}`}>
                  {advisor.isActive && advisor.isPublished ? "Published" : "Hidden"}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(advisor)} className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700" aria-label={`Edit ${advisor.name}`}>
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => deleteAdvisor(advisor)} className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${advisor.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="advisor-form-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 id="advisor-form-title" className="text-xl font-bold text-slate-900">
              {editingAdvisor ? "Edit Advisor" : "Add Advisor"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {textFields.map(([field, label, required]) => (
                  <label key={field} className="block text-xs font-semibold text-slate-600">
                    {label}
                    <input
                      type={field.toLowerCase().includes("url") ? "url" : field === "email" ? "email" : "text"}
                      required={required}
                      value={formData[field] || ""}
                      onChange={(event) => setFormData({ ...formData, [field]: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </label>
                ))}
                <label className="block text-xs font-semibold text-slate-600">
                  Display order
                  <input type="number" value={formData.displayOrder} onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                </label>
              </div>
              <label className="block text-xs font-semibold text-slate-600">
                Biography / details
                <textarea rows={4} value={formData.bio} onChange={(event) => setFormData({ ...formData, bio: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
              </label>
              <FileUpload label="Advisor portrait" value={formData.avatarUrl} onUploadComplete={(avatarUrl) => setFormData({ ...formData, avatarUrl })} />
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })} />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={formData.isPublished} onChange={(event) => setFormData({ ...formData, isPublished: event.target.checked })} />
                  Published
                </label>
              </div>
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                  {submitting ? "Saving…" : editingAdvisor ? "Save Changes" : "Add Advisor"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
