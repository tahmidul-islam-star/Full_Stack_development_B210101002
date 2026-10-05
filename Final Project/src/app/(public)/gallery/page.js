"use client";

import { useEffect, useState } from "react";
import GalleryCard from "@/components/GalleryCard";
import { Sparkles, Camera, X, Trophy } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeImgSrc, setActiveImgSrc] = useState("");

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch("/api/public/gallery", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load gallery.");
        }
        setGalleryData(
          result.data.map((item) => ({
            ...item,
            id: item._id,
            img: item.imageUrl,
            description: item.caption || item.description || "",
          }))
        );
      } catch (loadError) {
        console.error("Gallery load failed:", loadError);
        setError("Unable to load the gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const handleOpenModal = (item, imgSrc) => {
    setSelectedItem(item);
    setActiveImgSrc(imgSrc || item.img);
  };

  return (
    <>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
            <Camera className="w-4 h-4 text-indigo-600" />
            <span>Club Photo Gallery & Event Memories</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Capturing Our Journey in Tech & Programming
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Moments from national IUPC contests, campus programming competitions, workshops, and achievements by Chandpur Science and Technology University students.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">Loading gallery...</div>
          ) : error ? (
            <div role="alert" className="sm:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">{error}</div>
          ) : galleryData.length ? (
            galleryData.map((item) => (
              <GalleryCard key={item.id} item={item} onOpenModal={handleOpenModal} />
            ))
          ) : (
            <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">No gallery images have been published yet.</div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Banner */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden shrink-0">
              <img
                src={activeImgSrc}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm inline-flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official CPC Memory
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md leading-snug">
                  {selectedItem.title}
                </h2>
              </div>
            </div>

            {/* Detailed Description Content */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1">
              <h3 className="font-bold text-base text-slate-900">Event Overview & Highlights</h3>
              {selectedItem.description && (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedItem.description}
                </p>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/contests"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>View Club Contests</span>
                </Link>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
