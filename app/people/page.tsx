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
        <div>
          <h1 className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>People</h1>
          <p style={{ color: "var(--color-text-secondary)" }} className="mt-2 text-sm">Manage and view all interactions</p>
        </div>
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{total.toLocaleString()} total</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name…"
          className="flex-1 card px-4 py-2.5 text-sm focus:outline-none transition-all"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />
        <button
          type="submit"
          className="btn-primary text-sm"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); setOffset(0); }}
            className="btn-secondary text-sm"
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
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              relation === r.value
                ? "text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
            style={{
              background: relation === r.value ? "var(--color-primary)" : "var(--color-surface)",
              border: relation === r.value ? "none" : "1px solid var(--color-border)",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm" style={{ color: "#fb7185" }}>{error}</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No people found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--color-surface-light)", borderColor: "var(--color-border)" }} className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-12" style={{ color: "var(--color-text-secondary)" }}>#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>Relation</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>Reactions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>Comments</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>Reaction Types</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: "var(--color-border)" }} className="divide-y">
                {data.map((person, idx) => (
                  <tr key={person.id} className="transition-all hover:bg-[var(--color-surface-light)]">
                    <td className="px-4 py-3" style={{ color: "var(--color-text-muted)" }}>{offset + idx + 1}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--color-text-primary)" }}>{person.name}</td>
                    <td className="px-4 py-3">
                      <RelationBadge relation={person.relation} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: "var(--color-accent)" }}>{person.reactions}</td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: "#f59e0b" }}>{person.comments}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: "var(--color-text-primary)" }}>{person.total_interactions}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(person.reaction_types).map(([type, count]) => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-0.5 text-xs px-2 py-1 rounded"
                            style={{ background: "var(--color-surface-light)", color: "var(--color-text-secondary)" }}
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
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-600 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={offset + PAGE_SIZE >= total}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-600 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

