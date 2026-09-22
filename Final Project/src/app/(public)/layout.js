import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
