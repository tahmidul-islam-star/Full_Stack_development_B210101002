"use client";

import { useState } from "react";
import { Maximize2, Sparkles, Image as ImageIcon, Calendar } from "lucide-react";

export default function GalleryCard({ item, onOpenModal }) {
  const [imgSrc, setImgSrc] = useState(item.img);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    // If .jpg fails, try .png or fallback placeholder
    if (imgSrc.endsWith(".jpg")) {
      setImgSrc(imgSrc.replace(".jpg", ".png"));
    } else if (imgSrc.endsWith(".png")) {
      setImgSrc(imgSrc.replace(".png", ".jpeg"));
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      onClick={() => onOpenModal && onOpenModal(item, imgSrc)}
      className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={item.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-600 text-white p-6 text-center">
            <ImageIcon className="w-10 h-10 mb-2 opacity-80" />
            <span className="font-bold text-sm">{item.title}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 font-semibold text-xs flex items-center gap-1.5 shadow-md">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Full Photo & Story</span>
          </span>
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-indigo-700 border border-indigo-100 shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>CSTU CPC Event</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Click to read full story</span>
          <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
}
