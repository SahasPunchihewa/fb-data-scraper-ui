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
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 h-14">
        <span className="font-bold text-lg tracking-tight">
          📊 FB Insights
        </span>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                path === l.href
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
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

