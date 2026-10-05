import { Globe, Mail, Share2 } from "lucide-react";

export default function PublicFooter({ settings }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <p className="font-bold text-slate-900">{settings.clubName}</p>
          <p className="mt-1">{settings.copyrightText}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:text-indigo-600">
            <Mail className="h-4 w-4" />
            Contact Us
          </a>
          <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-600">
            <Share2 className="h-4 w-4" />
            Facebook
          </a>
          <a href={settings.universityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-600">
            <Globe className="h-4 w-4" />
            University Club Page
          </a>
        </div>
      </div>
    </footer>
  );
}
