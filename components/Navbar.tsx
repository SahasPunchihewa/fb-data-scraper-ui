"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/people", label: "People" },
  { href: "/posts", label: "Posts" },
  { href: "/sync", label: "Sync" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="bg-slate-900 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 h-14">
        <span className="font-bold text-lg tracking-tight text-white">
          📊 FB Insights
        </span>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                path === l.href
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

