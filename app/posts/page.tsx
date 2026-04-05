"use client";

import { useEffect, useState } from "react";
import { getPosts, type PostInsight } from "@/lib/api";

const REACTION_EMOJI: Record<string, string> = {
  heart: "❤️",
  love: "❤️",
  like: "👍",
  care: "🤗",
  wow: "😮",
  haha: "😂",
  sad: "😢",
  angry: "😡",
};

const RELATION_SHORT: Record<string, string> = {
  friend: "F",
  friend_and_follower: "F+Fo",
  follower_only: "Fo",
  other: "?",
};

const RELATION_COLORS: Record<string, string> = {
  friend: "bg-slate-800 text-cyan-400 border border-cyan-500/30",
  friend_and_follower: "bg-slate-800 text-amber-400 border border-amber-500/30",
  follower_only: "bg-slate-800 text-sky-400 border border-sky-500/30",
  other: "bg-slate-800 text-slate-400 border border-slate-600",
};

type SortKey = "post_number" | "total_reactions" | "total_comments" | "total";
type SortDir = "asc" | "desc";

export default function PostsPage() {
  const [posts, setPosts] = useState<PostInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("post_number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...posts].sort((a, b) => {
    let av = 0, bv = 0;
    if (sortKey === "post_number") { av = a.post_number ?? 9999; bv = b.post_number ?? 9999; }
    if (sortKey === "total_reactions") { av = a.total_reactions; bv = b.total_reactions; }
    if (sortKey === "total_comments") { av = a.total_comments; bv = b.total_comments; }
    if (sortKey === "total") { av = a.total_reactions + a.total_comments; bv = b.total_reactions + b.total_comments; }
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕";

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="bg-slate-800 border border-rose-500/50 rounded-xl p-6 text-rose-400 text-sm shadow-lg shadow-rose-500/10">{error}</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Posts</h1>
        <span className="text-sm text-slate-400">{posts.length} posts</span>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th
                  onClick={() => toggleSort("post_number")}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide cursor-pointer hover:text-slate-100 select-none w-24"
                >
                  Post <SortIcon col="post_number" />
                </th>
                <th
                  onClick={() => toggleSort("total_reactions")}
                  className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wide cursor-pointer hover:text-slate-100 select-none"
                >
                  Reactions <SortIcon col="total_reactions" />
                </th>
                <th
                  onClick={() => toggleSort("total_comments")}
                  className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wide cursor-pointer hover:text-slate-100 select-none"
                >
                  Comments <SortIcon col="total_comments" />
                </th>
                <th
                  onClick={() => toggleSort("total")}
                  className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wide cursor-pointer hover:text-slate-100 select-none"
                >
                  Total <SortIcon col="total" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Reaction Types
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  By Relation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sorted.map((post) => {
                const total = post.total_reactions + post.total_comments;
                return (
                  <tr key={post.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-100">{post.post_label}</td>
                    <td className="px-4 py-3 text-right text-cyan-400 font-medium">{post.total_reactions}</td>
                    <td className="px-4 py-3 text-right text-amber-400 font-medium">{post.total_comments}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-200">{total}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(post.reaction_types)
                          .sort(([, a], [, b]) => b - a)
                          .map(([type, count]) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-0.5 bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded"
                            >
                              {REACTION_EMOJI[type] ?? "❔"} {count}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(post.reactions_by_relation)
                          .sort(([, a], [, b]) => b - a)
                          .map(([rel, count]) => (
                            <span
                              key={rel}
                              className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded font-medium ${RELATION_COLORS[rel] ?? "bg-slate-700 text-slate-400"}`}
                            >
                              {RELATION_SHORT[rel] ?? rel} {count}
                            </span>
                          ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span>Relation legend:</span>
        {Object.entries(RELATION_SHORT).map(([rel, short]) => (
          <span key={rel} className={`px-2 py-0.5 rounded font-medium ${RELATION_COLORS[rel]}`}>
            {short} = {rel.replace(/_/g, " ")}
          </span>
        ))}
      </div>
    </div>
  );
}

