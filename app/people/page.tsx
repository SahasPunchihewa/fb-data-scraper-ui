"use client";

import { useCallback, useEffect, useState } from "react";
import RelationBadge from "@/components/RelationBadge";
import { getPeople, type PersonInsight } from "@/lib/api";

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

const RELATIONS = [
  { value: "", label: "All" },
  { value: "friend", label: "🧑‍🤝‍🧑 Friend" },
  { value: "friend_and_follower", label: "🌟 Friend + Follower" },
  { value: "follower_only", label: "👣 Follower Only" },
  { value: "other", label: "❔ Other" },
];

const PAGE_SIZE = 50;

export default function PeoplePage() {
  const [data, setData] = useState<PersonInsight[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [relation, setRelation] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPeople({ limit: PAGE_SIZE, offset, relation: relation || undefined, search: search || undefined });
      setData(res.data);
      setTotal(res.total);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [offset, relation, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRelationChange = (r: string) => {
    setRelation(r);
    setOffset(0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setOffset(0);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">People</h1>
        <span className="text-sm text-slate-500">{total.toLocaleString()} total</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name…"
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); setOffset(0); }}
            className="px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        )}
      </form>

      {/* Relation filter tabs */}
      <div className="flex flex-wrap gap-2">
        {RELATIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => handleRelationChange(r.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              relation === r.value
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 text-sm">{error}</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No people found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Relation</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Reactions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Comments</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Reaction Types</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((person, idx) => (
                  <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400">{offset + idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{person.name}</td>
                    <td className="px-4 py-3">
                      <RelationBadge relation={person.relation} />
                    </td>
                    <td className="px-4 py-3 text-right text-indigo-600 font-medium">{person.reactions}</td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">{person.comments}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">{person.total_interactions}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(person.reaction_types).map(([type, count]) => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-0.5 bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded"
                          >
                            {REACTION_EMOJI[type] ?? "❔"} {count}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={offset + PAGE_SIZE >= total}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

