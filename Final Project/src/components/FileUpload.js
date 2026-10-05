"use client";

import { useId, useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";

const imageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export default function FileUpload({
  onUploadComplete,
  value,
  label = "Upload Image",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/avif",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();
  const inputRef = useRef(null);
  const acceptsPdf = accept.split(",").some((type) => type.trim() === "application/pdf");
  const previewIsPdf = value?.split(/[?#]/, 1)[0].toLowerCase().endsWith(".pdf");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      const acceptedByInput = accept
        .split(",")
        .some((type) => type.trim() === file.type || (type.trim() === "image/*" && imageTypes.has(file.type)));
      if (!acceptedByInput || !(imageTypes.has(file.type) || (acceptsPdf && file.type === "application/pdf"))) {
        throw new Error(acceptsPdf
          ? "Choose a JPG, PNG, WEBP, GIF, AVIF, or PDF file."
          : "Choose a JPG, PNG, WEBP, GIF, or AVIF image.");
      }

      const maxFileSize = file.type === "application/pdf" ? 15 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size <= 0 || file.size > maxFileSize) {
        throw new Error(file.type === "application/pdf"
          ? "PDF files must be smaller than 15 MB."
          : "Images must be smaller than 10 MB.");
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onUploadComplete(data.url);
      } else {
        throw new Error(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setError("");
    onUploadComplete("");
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {label}
      </span>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {previewIsPdf ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-40 items-center justify-center gap-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              <FileText className="h-8 w-8" />
              View uploaded PDF
            </a>
          ) : (
            <img src={value} alt="Uploaded file preview" className="h-40 w-full object-cover" />
          )}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-3">
            <label
              htmlFor={inputId}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Replace file"}
            </label>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all ${uploading ? "cursor-wait" : "cursor-pointer hover:border-indigo-500 hover:bg-white"}`}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          ) : (
            <>
              <Upload className="mb-2 h-7 w-7 text-slate-400" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-indigo-600">Click to upload</span>
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                {acceptsPdf ? "JPG, PNG, WEBP, GIF, AVIF, or PDF" : "JPG, PNG, WEBP, GIF, or AVIF"}
              </p>
            </>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={handleFileChange}
        className="sr-only"
      />

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
