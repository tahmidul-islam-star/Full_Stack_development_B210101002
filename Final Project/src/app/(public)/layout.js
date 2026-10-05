import Navbar from "@/components/Navbar";
import PublicFooter from "@/components/PublicFooter";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar settings={settings} />
      <div className="flex-1">{children}</div>
      <PublicFooter settings={settings} />
    </div>
  );
}
