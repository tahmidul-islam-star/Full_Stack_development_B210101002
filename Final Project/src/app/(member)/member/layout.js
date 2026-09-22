import Sidebar from "@/components/Sidebar";

export default function MemberLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
