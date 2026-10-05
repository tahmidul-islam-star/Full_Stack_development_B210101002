import Link from "next/link";
import {
  Award,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Camera,
  ExternalLink,
  FileText,
  GraduationCap,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectToDatabase();
  const activeMemberCount = await User.countDocuments({
    status: "ACTIVE",
    role: "MEMBER",
  });
  const settings = await getSiteSettings();
  const stats = settings.statistics.map((stat) => ({
    ...stat,
    value: stat.usesMemberCount
      ? `${activeMemberCount}+`
      : stat.value,
  }));
  const statIcons = { Users, Trophy, Zap, Award };
  const statStyles = {
    Users: "text-indigo-600 bg-indigo-50",
    Trophy: "text-amber-600 bg-amber-50",
    Zap: "text-blue-600 bg-blue-50",
    Award: "text-emerald-600 bg-emerald-50",
  };
  const sectionLinks = [
    {
      title: "Notices",
      description: "Read the latest club announcements and updates.",
      href: "/notices",
      action: "View Notices",
      Icon: Bell,
    },
    {
      title: "Gallery",
      description: "Explore moments from club events and activities.",
      href: "/gallery",
      action: "Explore Gallery",
      Icon: Camera,
    },
    {
      title: "Executive Members",
      description: "Meet the student leaders serving the club.",
      href: "/members",
      action: "Meet the Team",
      Icon: Users,
    },
    {
      title: "Advisor Panel",
      description: "Get to know the faculty guiding the club.",
      href: "/advisor",
      action: "View Advisors",
      Icon: GraduationCap,
    },
  ];
  const titleParts = settings.heroTitle.split(" • ");
  const highlightedTitle = titleParts.pop();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      <main className="flex-1">
        <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden bg-white border-b border-slate-200/80">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-200/60 via-blue-200/40 to-cyan-200/50 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-8 shadow-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Chandpur Science and Technology University</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
              {titleParts.length > 0 && `${titleParts.join(" • ")} • `}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {highlightedTitle}
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              {settings.heroSubtitle || settings.clubDescription}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
              <Link
                href={settings.membershipCtaUrl}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5 text-indigo-200" />
                <span>{settings.membershipCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={settings.constitutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base flex items-center justify-center gap-2.5 transition-colors shadow-xs"
              >
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>{settings.constitutionCtaText}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {stats.map((stat) => {
                const Icon = statIcons[stat.icon] || Users;
                return (
                  <div
                    key={stat.label}
                    className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:border-indigo-300 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl ${statStyles[stat.icon] || statStyles.Users} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                    <span className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="explore-cpc-heading"
          className="bg-slate-50 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-2 sm:mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
                Explore the club
              </p>
              <h2
                id="explore-cpc-heading"
                className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
              >
                Discover CPC
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {sectionLinks.map(({ title, description, href, action, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-indigo-700" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    {action}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
