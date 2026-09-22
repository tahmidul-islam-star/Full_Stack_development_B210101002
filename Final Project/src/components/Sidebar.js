"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Bell,
  Calendar,
  Trophy,
  FileCheck,
  IdCard,
  UserCheck,
  ShieldCheck,
  User,
  Code2,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  const adminNav = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/applications", label: "Join Applications", icon: UserCheck },
    { href: "/admin/members", label: "Member Management", icon: Users },
    { href: "/admin/notices", label: "Notice Board", icon: Bell },
    { href: "/admin/events", label: "Event Management", icon: Calendar },
    { href: "/admin/contests", label: "Contests & Standings", icon: Trophy },
  ];

  const memberNav = [
    { href: "/member/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/member/profile", label: "My Profile", icon: User },
    { href: "/member/credential", label: "Digital ID Card", icon: IdCard },
    { href: "/member/applications", label: "Contest Applications", icon: FileCheck },
  ];

  const navItems = isAdmin ? adminNav : memberNav;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5 overflow-y-auto">
      <div className="space-y-6">
        {/* Top Header with Brand Logo & Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-slate-900 leading-tight">
                CSTU CPC
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Dashboard Panel</p>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 overflow-hidden shrink-0 shadow-xs">
            {session?.user?.avatarUrl ? (
              <img
                src={session.user.avatarUrl}
                alt={session.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-blue-600 font-extrabold text-sm text-white">
                {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-slate-900 truncate leading-tight">
              {session?.user?.name || "User"}
            </h4>
            <p className="text-[11px] font-semibold text-indigo-600 truncate mt-0.5">
              {session?.user?.designation || (isAdmin ? "Administrator" : "Member")}
            </p>

            <div className="flex items-center gap-1.5 mt-0.5">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  ADMIN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-100 text-indigo-700 border border-indigo-300 uppercase tracking-wider">
                  MEMBER
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {isAdmin ? "Admin Controls" : "Member Options"}
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 pt-4 border-t border-slate-200 space-y-2 shrink-0">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            Public Site
          </span>
          <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-bold">CPC</span>
        </Link>

        <button
          onClick={() => {
            setMobileOpen(false);
            signOut({ callbackUrl: "/" });
          }}
          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        {/* Left Side: Desktop Logo Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-slate-900 leading-tight">
              CSTU CPC
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Dashboard Panel</p>
          </div>
        </Link>

        {/* Right Side: Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 focus:outline-none transition-colors"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Left Side Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Off-Canvas Drawer (Left side) */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 shrink-0 min-h-screen sticky top-0 h-screen shadow-xs">
        {sidebarContent}
      </aside>
    </>
  );
}

