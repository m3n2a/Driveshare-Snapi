"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { auth } from "@/lib/firebase";

const NAV_ITEMS = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Create", href: "/create", icon: PlusSquare },
  { name: "Profile", href: "/profile", icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userData } = useAuth();

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--outline)]/20 bg-[var(--surface)] h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-[var(--primary)] tracking-tight">Snapi</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--primary-container)] text-[var(--primary)] font-semibold shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-dim)] hover:text-[var(--text-primary)]"
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "fill-[var(--primary)]/20" : ""}`} />
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--outline)]/20">
          <Link
            href="/settings"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-dim)] hover:text-[var(--text-primary)] transition-all"
          >
            <Settings className="w-6 h-6" />
            <span className="text-lg">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--error)] hover:bg-[var(--error)]/10 transition-all"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-lg">Log Out</span>
          </button>
          
          <div className="mt-6 flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-dim)] overflow-hidden border border-[var(--outline)]/20">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-2 text-[var(--text-secondary)]" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{userData?.displayName}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">@{userData?.username}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)]/80 backdrop-blur-xl border-t border-[var(--outline)]/20 z-50 px-6 py-3 flex justify-between items-center pb-safe">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isActive ? "text-[var(--primary)] bg-[var(--primary-container)]" : "text-[var(--text-secondary)]"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "fill-[var(--primary)]/20" : ""}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
