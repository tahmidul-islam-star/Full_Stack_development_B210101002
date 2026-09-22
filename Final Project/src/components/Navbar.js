"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Code2, LogOut, LayoutDashboard, User, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/join", label: "Join Club" },
    { href: "/gallery", label: "Gallery" },
    { href: "/notices", label: "Notices" },
    { href: "/events", label: "Events" },
    { href: "/contests", label: "Contests" },
    { href: "/members", label: "Members" },
    { href: "/advisor", label: "Advisors" },
  ];

  const dashboardUrl =
    session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/member/dashboard";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Code2 className="w-6 h-6 text-indigo-600 group-hover:rotate-12 transition-transform duration-200" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-slate-900">
                CSTU CPC
              </div>
              <p className="text-xs text-slate-500 font-medium">Code • Learn • Build • Lead</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {status === "loading" ? (
              <div className="w-32 h-9 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={dashboardUrl}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-sm font-medium text-slate-800 transition-colors shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>Dashboard</span>
                  {session.user?.role === "ADMIN" ? (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-100 text-indigo-700 border border-indigo-300">
                      MEMBER
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 border border-slate-300 text-slate-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login?role=member"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
                >
                  <User className="w-4 h-4 text-indigo-200" />
                  <span>Member Login</span>
                </Link>

                <Link
                  href="/login?role=admin"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-semibold text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                href={dashboardUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-md"
              >
                <span>Go to Dashboard</span>
                <span className="text-xs uppercase px-2 py-0.5 bg-black/20 rounded font-bold">
                  {session.user?.role}
                </span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                href="/login?role=member"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Member Login</span>
              </Link>
              <Link
                href="/login?role=admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-slate-900 text-amber-300 font-semibold text-sm shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
