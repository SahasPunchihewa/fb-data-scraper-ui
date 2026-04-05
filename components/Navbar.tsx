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
    <nav className="sticky top-0 z-40 border-b backdrop-blur-sm" style={{ 
      borderColor: "var(--color-border)",
      background: "rgba(13, 17, 23, 0.9)"
    }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <span className="font-bold text-lg" style={{ color: "var(--color-text)" }}>
              FB Insights
            </span>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Analytics Dashboard</p>
          </div>
        </div>
        
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                path === l.href
                  ? "text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
              style={{
                background: path === l.href ? "var(--color-primary)" : "transparent"
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

