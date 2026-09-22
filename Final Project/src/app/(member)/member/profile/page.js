"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import { useSession } from "next-auth/react";
import { User, Save, CheckCircle2 } from "lucide-react";

export default function MemberProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    studentId: "",
    department: "",
    session: "",
    avatarUrl: "",
    codeforcesHandle: "",
    vjudgeHandle: "",
    githubUrl: "",
  });

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/member/profile/${session.user.id}`);
      const json = await res.json();
      if (json.success) {
        setFormData({
          name: json.data.name || "",
          phone: json.data.phone || "",
          studentId: json.data.studentId || "",
          department: json.data.department || "",
          session: json.data.session || "",
          avatarUrl: json.data.avatarUrl || "",
          codeforcesHandle: json.data.codeforcesHandle || "",
          vjudgeHandle: json.data.vjudgeHandle || "",
          githubUrl: json.data.githubUrl || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`/api/member/profile/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        update({ name: formData.name, avatarUrl: formData.avatarUrl });
      } else {
        setMessage("Error updating profile.");
      }
    } catch (err) {
      setMessage("Failed to save changes.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <User className="w-8 h-8 text-indigo-600" />
              Edit Profile
            </h1>
            <p className="text-sm text-slate-600 mt-1">Manage your personal information, competitive handles, and photo.</p>
          </div>

          {/* Top Profile Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex items-center gap-6 shadow-sm relative overflow-hidden">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 border-2 border-indigo-200 overflow-hidden shrink-0 shadow-sm">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-600 text-3xl font-extrabold text-white">
                  {formData.name ? formData.name[0].toUpperCase() : "M"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-slate-900 truncate">{formData.name || "Member Name"}</h2>
              <p className="text-xs font-semibold text-indigo-600 mt-1">{formData.designation || "Member"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formData.department || "CSE"} • Session: {formData.session || "2022-23"}</p>
            </div>
          </div>

          {message && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                  placeholder="+88017..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Competitive Handles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Codeforces Handle</label>
                  <input
                    type="text"
                    value={formData.codeforcesHandle}
                    onChange={(e) => setFormData({ ...formData, codeforcesHandle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white font-mono"
                    placeholder="tourist"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">VJudge Handle</label>
                  <input
                    type="text"
                    value={formData.vjudgeHandle}
                    onChange={(e) => setFormData({ ...formData, vjudgeHandle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <FileUpload
              label="Avatar Photo"
              value={formData.avatarUrl}
              onUploadComplete={(url) => setFormData({ ...formData, avatarUrl: url })}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? "Saving Profile..." : "Save Profile Changes"}</span>
            </button>
          </form>
    </>
  );
}
