"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import IDCard from "@/components/IDCard";
import { useSession } from "next-auth/react";
import { IdCard, ShieldCheck, Download } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export default function MemberCredentialPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/member/profile/${session.user.id}`);
      const json = await res.json();
      if (json.success) setProfile(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const cardElement = document.getElementById("cpc-id-card");
      if (!cardElement) {
        alert("ID Card element with CSS ID 'cpc-id-card' not found.");
        return;
      }

      const canvas = await html2canvas(cardElement, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [90, 140],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 90, 140);
      pdf.save(`CPC_ID_${profile?.studentId || profile?.name || "Member"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-8">
          <div className="w-full text-left border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED CLUB CREDENTIAL
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <IdCard className="w-8 h-8 text-indigo-600" />
              Digital Member ID Card
            </h1>
            <p className="text-sm text-slate-600 mt-1">Your official verified digital ID card with embedded QR verification code.</p>
          </div>

          {loading ? (
            <div className="py-12 text-slate-500">Loading digital credential...</div>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="w-full flex justify-center overflow-x-auto max-w-full pb-2">
                <div className="transform scale-[0.82] min-[400px]:scale-90 sm:scale-100 origin-top">
                  <IDCard user={profile} />
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? "Generating PDF..." : "Download Official PDF ID Card"}</span>
              </button>
            </div>
          )}
    </div>
  );
}
