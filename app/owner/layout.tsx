"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", path: "/owner/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Properties", path: "/owner/properties", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Tenants", path: "/owner/tenants", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800"><span className="text-xl font-bold text-white tracking-tight">RentFlow</span></div>
      <nav className="flex-1 py-6 space-y-1 px-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith(item.path) ? "bg-blue-600 text-white font-medium" : "hover:bg-slate-800 hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Suspense fallback={<aside className="w-64 bg-slate-900 hidden md:flex"></aside>}><Sidebar /></Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="text-slate-500 font-medium">Owner Workspace</div>
          <div className="flex items-center gap-4"><span className="text-sm text-slate-600 font-medium">Welcome, Owner</span><Link href="/login" className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">Log out</Link></div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}