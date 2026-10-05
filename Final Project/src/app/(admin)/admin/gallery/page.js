"use client";

import { useEffect, useState } from "react";
import { Camera, Edit2, Plus, Trash2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";

const emptyItem = {
  title: "",
  description: "",
  imageUrl: "",
  category: "GENERAL",
  displayOrder: 0,
  isPublished: true,
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyItem);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/gallery", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to load gallery.");
      }
      setItems(result.data || []);
      setError("");
    } catch (fetchError) {
      console.error("Gallery management load error:", fetchError);
      setError(fetchError.message || "Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/gallery", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load gallery.");
        }
        if (active) setItems(result.data || []);
      })
      .catch((fetchError) => {
        console.error("Gallery management load error:", fetchError);
        if (active) setError(fetchError.message || "Unable to load gallery.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyItem);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...emptyItem, ...item });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        editingItem ? `/api/admin/gallery/${editingItem._id}` : "/api/admin/gallery",
        {
          method: editingItem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            displayOrder: Number(formData.displayOrder) || 0,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save gallery item.");
      }
      setModalOpen(false);
      await fetchItems();
      if (result.warning) setError(result.warning);
    } catch (submitError) {
      console.error("Gallery item save error:", submitError);
      setError(submitError.message || "Unable to save gallery item.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (item) => {
    if (!confirm(`Delete "${item.title}" from the gallery?`)) return;
    try {
      const response = await fetch(`/api/admin/gallery/${item._id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to delete gallery item.");
      }
      await fetchItems();
      if (result.warning) setError(result.warning);
    } catch (deleteError) {
      console.error("Gallery item delete error:", deleteError);
      setError(deleteError.message || "Unable to delete gallery item.");
    }
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-900">
            <Camera className="h-8 w-8 text-indigo-600" />
            Gallery Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">Upload and publish CPC photos and event memories.</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Add Gallery Item
        </button>
      </header>

      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {loading ? (
        <p className="py-12 text-center text-slate-500">Loading gallery…</p>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">No gallery items found.</div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <article key={item._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[16/10] bg-slate-100">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-xs text-indigo-600">{item.category} · Order {item.displayOrder}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold ${item.isPublished ? "text-emerald-700" : "text-slate-500"}`}>
                    {item.isPublished ? "Published" : "Hidden"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.description}</p>
                <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => openEdit(item)} className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:text-indigo-700" aria-label={`Edit ${item.title}`}><Edit2 className="h-4 w-4" /></button>
                  <button type="button" onClick={() => deleteItem(item)} className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:text-rose-600" aria-label={`Delete ${item.title}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="gallery-form-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 id="gallery-form-title" className="text-xl font-bold text-slate-900">{editingItem ? "Edit Gallery Item" : "Add Gallery Item"}</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block text-xs font-semibold text-slate-600">Title
                <input required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
              </label>
              <label className="block text-xs font-semibold text-slate-600">Description / caption
                <textarea rows={4} value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-600">Event / category
                  <input value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                </label>
                <label className="block text-xs font-semibold text-slate-600">Display order
                  <input type="number" value={formData.displayOrder} onChange={(event) => setFormData({ ...formData, displayOrder: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                </label>
              </div>
              <FileUpload label="Gallery image" value={formData.imageUrl} onUploadComplete={(imageUrl) => setFormData({ ...formData, imageUrl })} />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={formData.isPublished} onChange={(event) => setFormData({ ...formData, isPublished: event.target.checked })} />
                Published on public gallery
              </label>
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting || !formData.imageUrl} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                  {submitting ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
