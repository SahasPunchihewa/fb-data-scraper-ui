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
    <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] backdrop-blur-sm" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <span className="font-bold text-lg tracking-tight" style={{ color: "var(--color-text-primary)" }}>
          📊 FB Insights
        </span>
        <div className="flex gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                path === l.href
                  ? "bg-[var(--color-primary)] text-white shadow-lg"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)]"
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

